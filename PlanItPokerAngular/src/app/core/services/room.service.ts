import { Injectable, inject, signal } from '@angular/core';
import { delay, finalize, Observable, of, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Room, RoomStatus } from '../../shared/models/room';
import { UserService } from './user.service';
import { CardType, UUID } from '../../shared/types';
import { Player, PlayerRole } from '../../shared/models/room/player.model';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private userService = inject(UserService);
  private _rooms = signal<Room[]>(this.initializeMockRooms());
  private latency = 500;

  rooms = this._rooms.asReadonly();
  loading = signal(false);

  private initializeMockRooms(): Room[] {
    return [
      this.createRoomEntity({
        id: 'd8a12f04-3c5b-4d7e-8f6a-1c3b9d7e8f6c' as UUID,
        name: 'Sprint Planning',
        cardType: CardType.FIBONACCI,
        players: this.generateMockPlayers(3, 'd8a12f04-3c5b-4d7e-8f6a-1c3b9d7e8f6c' as UUID)
      }),
      this.createRoomEntity({
        id: '550e8400-e29b-41d4-a716-446655440000' as UUID,
        name: 'Tech Debt Discussion',
        cardType: CardType.SEQUENTIAL,
        players: this.generateMockPlayers(2, '550e8400-e29b-41d4-a716-446655440000' as UUID)
      })
    ];
  }

  private createRoomEntity(data: Partial<Room>): Room {
    const userId = this.userService.currentUserId;
    
    return {
      id: uuidv4() as UUID,
      name: '',
      ownerId: userId as UUID,
      cardType: CardType.FIBONACCI,
      cards: [],
      players: [],
      stories: [],
      inviteLink: '',
      createdAt: new Date(),
      ...data
    };
  }

  private generateMockPlayers(count: number, roomId: UUID): Player[] {
    return Array.from({ length: count }, (_, i) => ({
      id: uuidv4() as UUID,
      roomId: roomId,
      userId: uuidv4() as UUID,
      name: `Player ${i + 1}`,
      role: i === 0 ? PlayerRole.MODERATOR : PlayerRole.PLAYER,
      hasVoted: Math.random() > 0.5,
      isConnected: Math.random() > 0.8
    }));
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


  getRoomsByUserId(id?: UUID): Observable<Room[]> {
    this.loading.set(true);
    const userId = id ?? this.userService.currentUserId;
    const rooms = this._rooms().filter(room => room.players.some(player => player.userId === userId));
    return (rooms.length > 0 ? of([...rooms]) : throwError(() => new Error(`No rooms found for user with ID ${userId}`)))
      .pipe(
        delay(this.latency),
        finalize(() => this.loading.set(false)),
      );
  }
  
  

  createRoom(dto: { name: string; cardType: CardType }): Observable<Room> {
    this.loading.set(true);
    const newRoom = this.createRoomEntity({
      ...dto,
      players: this.generateMockPlayers(1, uuidv4() as UUID)
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
        updatedAt: new Date()
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
                cards: [...cards],
                cardType: CardType.CUSTOM,
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