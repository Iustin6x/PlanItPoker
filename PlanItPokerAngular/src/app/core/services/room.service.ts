import { Injectable, inject, signal } from '@angular/core';
import { catchError, finalize, map, Observable, tap, throwError } from 'rxjs';
import { Room, RoomDialogDTO } from '../../shared/models/room';
import { UserService } from './user.service';
import { CardType, UUID } from '../../shared/types';
import { PlayerRole } from '../../shared/models/room/player.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class RoomService {
  private http = inject(HttpClient);
  private userService = inject(UserService);
  private _currentRoom = signal<Room | undefined>(undefined);
  private _rooms = signal<RoomDialogDTO[]>([]);

  rooms = this._rooms.asReadonly();
  currentRoom = this._currentRoom.asReadonly();
  loading = signal(false);

  setCurrentRoom(roomId: UUID): void {
    const room = this._rooms().find(r => r.id === roomId);
    if (room) {
      this._currentRoom.set(this.convertDtoToRoom(room));
    }
  }

  clearCurrentRoom(): void {
    this._currentRoom.set(undefined);
  }

  getRooms(): Observable<RoomDialogDTO[]> {
    this.loading.set(true);
    return this.http.get<any[]>('http://localhost:8080/api/rooms', {
      headers: this.createAuthorizationHeader()
    }).pipe(
      map(apiRooms => apiRooms.map(room => this.mapToRoomDTO(room))),
      tap(mappedRooms => this._rooms.set(mappedRooms)),
      catchError(error => {
        console.error("Error fetching rooms:", error);
        return throwError(() => error);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  private mapToRoomDTO(apiRoom: any): RoomDialogDTO {
    return {
      id: apiRoom.id as UUID,
      name: apiRoom.name,
      cardType: CardType.FIBONACCI,
      cards: [],
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
      players: [],
      stories: [],
      inviteLink: dto.inviteLink!,
    };
  }

  createRoom(dto: { name: string; cardType: CardType }): Observable<RoomDialogDTO> {
    this.loading.set(true);
    return this.http.post<any>('http://localhost:8080/api/room', dto, { 
      headers: this.createAuthorizationHeader() 
    }).pipe(
      map(apiRoom => this.mapToRoomDTO(apiRoom)),
      tap(newRoomDto => {
        this._rooms.update(rooms => [...rooms, newRoomDto]);
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
    return this.http.put<any>(`http://localhost:8080/api/rooms/${id}`, updates, { 
      headers: this.createAuthorizationHeader() 
    }).pipe(
      map(apiRoom => this.mapToRoomDTO(apiRoom)),
      tap(updatedDto => {
        this._rooms.update(rooms => rooms.map(room => 
          room.id === id ? updatedDto : room
        ));
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
      `http://localhost:8080/api/rooms/${id}`, 
      { headers: this.createAuthorizationHeader() }
    ).pipe(
      tap(() => {
        this._rooms.update(rooms => rooms.filter(r => r.id !== id));
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

  private createAuthorizationHeader() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const jwtToken = localStorage.getItem('jwt');
      if (jwtToken) {
        return new HttpHeaders().set("Authorization", "Bearer " + jwtToken);
      }
    }
    return undefined;
  }
}