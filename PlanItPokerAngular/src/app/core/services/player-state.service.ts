import { computed, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { PlayerDTO } from '../../shared/models/wbs';
import { PlayerRole } from '../../shared/models/room/player.model';
import { VoteStateService } from './vote-state.service';

@Injectable({ providedIn: 'root' })
export class PlayerStateService {
  private authService = inject(AuthService);

  private _players = signal<PlayerDTO[]>([]);
  readonly players = this._players.asReadonly();

  readonly isModerator = computed(() => {
    const userId = this.authService.getUserIdFromJWT();
    console.log('Checking isModerator for userId:', userId);
    return this._players().some(p => p.userId === userId && p.role === PlayerRole.MODERATOR);
  });

  getPlayer(playerId: string): PlayerDTO | undefined {
    return this._players().find(p => p.id === playerId);
  }

  setPlayers(players: PlayerDTO[]) {
    console.log('Setting players:', players);
    this._players.set(players || []);
  }

  

  updatePlayer(player: PlayerDTO) {
    this._players.update(players => {
      const index = players.findIndex(p => p.id === player.id);
      if (index === -1) {
        return [...players, player];
      } else {
        const updated = [...players];
        updated[index] = player;
        return updated;
      }
    });
  }

  markPlayerVoted(playerId: string) {
    this._players.update(players =>
      players.map(p =>
        p.id === playerId ? { ...p, hasVoted: true } : p
      )
    );
  }

  disconnectPlayer(playerId: string) {
    console.log("disconect function");
    console.log(playerId);
    console.log(this.players());

    this._players.update(list =>
      list.map(p => (p.id === playerId ? { ...p, connected: false } : p))
    );

    console.log(this.players);
  }

  changeName(playerId: string, newName: string) {
    this._players.update(list =>
      list.map(p => (p.id === playerId ? { ...p, name: newName } : p))
    );
  }

  changeRole(playerId: string, newRole: PlayerRole) {
    console.log("change role "+ playerId + " " + newRole)
    this._players.update(list =>
      list.map(p => (p.id === playerId ? { ...p, role: newRole } : p))
    );
  }
}
