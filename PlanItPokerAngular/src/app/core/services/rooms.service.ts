import { Injectable, inject, signal } from '@angular/core';
import { delay, finalize, Observable, of, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Room, RoomStatus } from '../../shared/models/room';
import { UserService } from './user.service';
import { generateUUID, UUID } from '../../shared/types';


@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private userService = inject(UserService);
  private _rooms = signal<Room[]>(this.initializeMockRooms());
  private latency = 500;

  rooms = this._rooms.asReadonly();
  loading = signal(false);

  private initializeMockRooms(): Room[] {
    const defaultSettings = {
      requireAuth: false,
      allowSpectators: true,
      maxParticipants: 20,
      votingTimeLimit: 300
    };

    return [
      this.createRoomEntity({
        id: 'd8a12f04-3c5b-4d7e-8f6a-1c3b9d7e8f6c' as UUID,
        name: 'Sprint Planning',
        cardType: 'fibonacci'
      }),
      this.createRoomEntity({
        id: '550e8400-e29b-41d4-a716-446655440000' as UUID,
        name: 'Tech Debt Discussion',
        cardType: 'sequential'
      })
    ];
  }

  private createRoomEntity(data: Partial<Room>): Room {
    const userId = this.userService.currentUserId;
    
    return {
      id: generateUUID(),
      name: '',
      cardType: 'fibonacci',
      customCards: [],
      adminIds: [userId as UUID],
      participants: [userId as UUID],
      votingSessions: [],
      status: RoomStatus.ACTIVE,
      settings: {
        requireAuth: false,
        allowSpectators: true,
        maxParticipants: 20,
        votingTimeLimit: 300,
        allowRevotes: true,
        hideResultsUntilEnd: false
      },
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data
    };
  }

  private generateRoomId(): UUID {
    return uuidv4() as UUID;
  }

  getRooms(): Observable<Room[]> {
    this.loading.set(true);
    return of(this._rooms()).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  getRoomById(id: UUID): Observable<Room> {
    this.loading.set(true);
    const room = this._rooms().find(r => r.id === id);
    return (room ? of({...room}) : throwError(() => new Error(`Room ${id} not found`))).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  createRoom(roomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>): Observable<Room> {
    this.loading.set(true);
    const newRoom = this.createRoomEntity({
      ...roomData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    this._rooms.update(rooms => [...rooms, newRoom]);
    return of(newRoom).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  updateRoom(id: UUID, updates: Partial<Room>): Observable<Room> {
    this.loading.set(true);
    return new Observable<Room>(subscriber => {
      const rooms = this._rooms();
      const index = rooms.findIndex(r => r.id === id);
      
      if (index === -1) {
        subscriber.error(new Error(`Room ${id} not found`));
        return;
      }

      const updatedRoom = {
        ...rooms[index],
        ...updates,
        updatedAt: new Date(),
        id // Prevent ID change
      };

      this._rooms.update(currentRooms => 
        currentRooms.map(room => 
          room.id === id ? updatedRoom : room
        )
      );

      subscriber.next(updatedRoom);
      subscriber.complete();
    }).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  deleteRoom(id: UUID): Observable<void> {
    this.loading.set(true);
    return new Observable<void>(subscriber => {
      const exists = this._rooms().some(r => r.id === id);
      if (!exists) {
        subscriber.error(new Error(`Room ${id} not found`));
        return;
      }

      this._rooms.update(rooms => rooms.filter(r => r.id !== id));
      subscriber.next();
      subscriber.complete();
    }).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  updateCustomCards(roomId: UUID, cards: (number | '?')[]): Observable<void> {
    this.loading.set(true);
    return new Observable<void>(subscriber => {
      this._rooms.update(rooms => 
        rooms.map(room => 
          room.id === roomId 
            ? { 
                ...room, 
                customCards: [...cards],
                cardType: 'custom',
                updatedAt: new Date()
              }
            : room
        )
      );
      subscriber.next();
      subscriber.complete();
    }).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }
}