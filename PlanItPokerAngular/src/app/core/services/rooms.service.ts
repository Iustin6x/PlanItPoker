import { Injectable } from '@angular/core';
import { Room } from '../../shared/models/room.model';
import { delay, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoomsService {
  private rooms: Room[] = [
    {
      id: '1',
      name: 'Sprint Planning',
      cardType: 'fibonacci',
    },
    {
      id: '2',
      name: 'Tech Debt Discussion',
      cardType: 'scrum',
    }
  ];

  private latency = 500; // Simulează latența rețelei în ms


  getRooms(): Observable<Room[]> {
    return of([...this.rooms]).pipe(delay(this.latency));
  }


  getRoomById(id: string): Observable<Room> {
    const room = this.rooms.find(r => r.id === id);
    return room 
      ? of({...room}).pipe(delay(this.latency)) 
      : throwError(() => `Room ${id} not found`).pipe(delay(this.latency));
  }


  createRoom(roomData: Omit<Room, 'id' | 'createdAt'>): Observable<Room> {
    const newRoom: Room = {
      ...roomData,
      id: Date.now().toString(),
    };
    
    this.rooms.push(newRoom);
    return of(newRoom).pipe(delay(this.latency));
  }

  updateRoom(id: string, updates: Partial<Room>): Observable<Room> {
    const index = this.rooms.findIndex(r => r.id === id);
    
    if (index === -1) {
      return throwError(() => `Room ${id} not found`).pipe(delay(this.latency));
    }

    const updatedRoom = {
      ...this.rooms[index],
      ...updates,
      id 
    };

    this.rooms[index] = updatedRoom;
    return of(updatedRoom).pipe(delay(this.latency));
  }

  deleteRoom(id: string): Observable<void> {
    const initialLength = this.rooms.length;
    this.rooms = this.rooms.filter(r => r.id !== id);
    
    return initialLength > this.rooms.length
      ? of(undefined).pipe(delay(this.latency))
      : throwError(() => `Room ${id} not found`).pipe(delay(this.latency));
  }
}
