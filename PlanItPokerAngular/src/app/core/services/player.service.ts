import { Injectable, inject, signal } from '@angular/core';
import { Observable, throwError, of } from 'rxjs';
import { delay, finalize, map, switchMap, catchError } from 'rxjs/operators';
import { RoomService } from './room.service';
import { Player, PlayerRole } from '../../shared/models/room/player.model';
import { UUID } from '../../shared/types';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private roomService = inject(RoomService);
  private latency = 500;
  loading = signal(false);

  // Metode existente actualizate pentru noul model
  getPlayersInRoom(roomId: UUID): Observable<Player[]> {
    this.loading.set(true);
    return this.roomService.getRoomById(roomId).pipe(
      map(room => room.players.map(p => this.mapToPlayer(p))),
      catchError(error => throwError(() => error)),
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  updatePlayerRole(roomId: UUID, playerId: UUID, role: PlayerRole): Observable<{ message: string }> {
    this.loading.set(true);
    return this.roomService.getRoomById(roomId).pipe(
      switchMap(room => {
        const updatedPlayers = room.players.map(p => 
          p.id === playerId ? { ...p, role } : p
        );
        return this.roomService.updateRoom(roomId, { players: updatedPlayers });
      }),
      map(() => ({ message: 'Role updated' })),
      catchError(error => throwError(() => error)),
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  updatePlayerName(roomId: UUID, playerId: UUID, name: string): Observable<{ message: string }> {
    this.loading.set(true);
    return this.roomService.getRoomById(roomId).pipe(
      switchMap(room => {
        const updatedPlayers = room.players.map(p => 
          p.id === playerId ? { ...p, name } : p
        );
        return this.roomService.updateRoom(roomId, { players: updatedPlayers });
      }),
      map(() => ({ message: 'Name updated' })),
      catchError(error => throwError(() => error)),
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  deletePlayer(roomId: UUID, playerId: UUID): Observable<{ message: string }> {
    this.loading.set(true);
    return this.roomService.getRoomById(roomId).pipe(
      switchMap(room => {
        const updatedPlayers = room.players.filter(p => p.id !== playerId);
        return this.roomService.updateRoom(roomId, { players: updatedPlayers });
      }),
      map(() => ({ message: 'Player removed' })),
      catchError(error => throwError(() => error)),
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  // Metodă helper pentru maparea corectă a player-ilor
  private mapToPlayer(data: any): Player {
    return {
      id: data.id,
      roomId: data.roomId,
      userId: data.userId,
      name: data.name,
      avatar: data.avatar,
      role: data.role,
      hasVoted: data.hasVoted,
      isConnected: data.isConnected,
      vote: data.vote
    };
  }
}