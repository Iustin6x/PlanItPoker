import { Injectable, inject, signal } from '@angular/core';
import { catchError, delay, finalize, map, Observable, of, tap, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Room, RoomDialogDTO} from '../../shared/models/room';
import { UserService } from './user.service';
import { CardType, UUID } from '../../shared/types';
import { Player, PlayerRole } from '../../shared/models/room/player.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private _currentRoom = signal<Room | undefined>(undefined);
  private _rooms = signal<RoomDialogDTO[]>([]);
  private latency = 500;

  rooms = this._rooms.asReadonly();
  currentRoom = this._currentRoom.asReadonly();
  loading = signal(false);

  setCurrentRoom(roomId: UUID): void {
    const room = this._rooms().find(r => r.id === roomId);
    if (room) {
      // If you need to convert DTO to Room entity
      this._currentRoom.set(this.convertDtoToRoom(room));
    }
  }

  clearCurrentRoom(): void {
    this._currentRoom.set(undefined);
  }


  getRooms(): Observable<RoomDialogDTO[]> {
    this.loading.set(true);
  
    return this.http.get<any[]>('http://localhost:8080/api/rooms').pipe(
      tap(response => console.log("Raw response:", response)),
      map(apiRooms => apiRooms.map(room => this.mapToRoomDTO(room))),
      tap(mappedRooms => {
        console.log("Mapped rooms:", mappedRooms);
        this._rooms.set(mappedRooms); 
      }),
      catchError(error => {
        console.error("Error fetching rooms:", error);
        return throwError(() => error);
      }),
      finalize(() => {
        this.loading.set(false);
      })
    );
  }

  private mapToRoomDTO(apiRoom: any): RoomDialogDTO {
    return {
      id: apiRoom.id as UUID,
      name: apiRoom.name,
      cardType: CardType.FIBONACCI, // Default value
      cards: [], // Default empty array
      lastVotedStory: apiRoom.lastVotedStory || 'No completed stories',
      totalPoints: apiRoom.totalPoints || 0,
      inviteLink: apiRoom.inviteLink,
      userRole: apiRoom.role as PlayerRole
    };
  }

  private convertDtoToRoom(dto: RoomDialogDTO): Room {
    return {
      id: dto.id!,
      name: dto.name,
      cardType: dto.cardType,
      cards: dto.cards,
      players: [], // You might need to fetch players separately
      stories: [],
      inviteLink: dto.inviteLink!,
    };
  }

  createRoom(dto: { name: string; cardType: CardType }): Observable<RoomDialogDTO> {
    this.loading.set(true);

    return this.http.post<any>('http://localhost:8080/api/room', dto).pipe(
      map(apiRoom => this.mapToRoomDTO(apiRoom)),
      tap(newRoomDto => {
        // Adaugă camera nouă la lista de camere
        this._rooms.update(rooms => [...rooms, newRoomDto]);
  
        // Poți seta camera creată ca fiind `currentRoom`, dacă vrei
        this._currentRoom.set(this.convertDtoToRoom(newRoomDto));
      }),
      catchError(error => {
        console.error('Error creating room:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loading.set(false))
    );
  }


  updateRoom(id: UUID, updates: Partial<Room>): Observable<RoomDialogDTO> {
    this.loading.set(true);
    return this.http.put<any>(`http://localhost:8080/api/rooms/${id}`, updates).pipe(
      map(apiRoom => this.mapToRoomDTO(apiRoom)),
      tap(updatedDto => {
        this._rooms.update(rooms =>
          rooms.map(room =>
            room.id === id ? updatedDto : room
          )
        );
  
        if (this._currentRoom()?.id === id) {
          this._currentRoom.set(this.convertDtoToRoom(updatedDto));
        }
      }),
      catchError(error => {
        console.error('Error updating room:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  deleteRoom(id: UUID): Observable<void> {
    this.loading.set(true);
    return this.http.delete<void>(
      `http://localhost:8080/api/rooms/${id}`
    ).pipe(
      tap(() => {
        // Șterge camera din lista locală
        this._rooms.update(rooms => rooms.filter(r => r.id !== id));
        
        // Resetează camera curentă dacă a fost ștearsă
        if (this._currentRoom()?.id === id) {
          this.clearCurrentRoom();
        }
      }),
      catchError(error => {
        console.error('Error deleting room:', error);
        return throwError(() => error);
      }),
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