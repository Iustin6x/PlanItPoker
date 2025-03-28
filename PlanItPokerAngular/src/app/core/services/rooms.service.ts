import { Injectable, signal } from '@angular/core';
import { Room } from '../../shared/models/room.model';
import { delay, finalize, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private _rooms = signal<Room[]>([
    {
      id: '1',
      name: 'Sprint Planning',
      cardType: 'fibonacci',
      customCards: [],
      createdAt: new Date()
    },
    {
      id: '2',
      name: 'Tech Debt Discussion',
      cardType: 'scrum',
      customCards: [],
      createdAt: new Date()
    }
  ]);

  rooms = this._rooms.asReadonly();
  loading = signal(false);
  private latency = 500;

  getRooms(): Observable<Room[]> {
    this.loading.set(true);
    return of(this._rooms()).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  getRoomById(id: string): Observable<Room> {
    this.loading.set(true);
    const room = this._rooms().find(r => r.id === id);
    return (room ? of({...room}) : throwError(() => `Room ${id} not found`)).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  createRoom(roomData: Omit<Room, 'id' | 'createdAt'>): Observable<Room> {
    this.loading.set(true);
    const newRoom: Room = {
      ...roomData,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    this._rooms.update(rooms => [...rooms, newRoom]);
    return of(newRoom).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  updateRoom(id: string, updates: Partial<Room>): Observable<Room> {
    this.loading.set(true);
    return new Observable<Room>(subscriber => {
      const rooms = this._rooms();
      const index = rooms.findIndex(r => r.id === id);
      
      if (index === -1) {
        subscriber.error(`Room ${id} not found`);
        return;
      }

      const updatedRoom = {
        ...rooms[index],
        ...updates,
        id // ID-ul original
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

  deleteRoom(id: string): Observable<void> {
    this.loading.set(true);
    return new Observable<void>(subscriber => {
      const initialRooms = this._rooms();
      const roomExists = initialRooms.some(r => r.id === id);
      
      if (!roomExists) {
        subscriber.error(`Room ${id} not found`);
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

  updateCustomCards(roomId: string, cards: string[]): Observable<void> {
    this.loading.set(true);
    return new Observable<void>(subscriber => {
      this._rooms.update(rooms => 
        rooms.map(room => 
          room.id === roomId 
            ? { 
                ...room, 
                customCards: [...cards], 
                cardType: 'custom' 
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