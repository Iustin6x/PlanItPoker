import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { PlayerDTO } from '../../shared/models/wbs';
import { PlayerRole } from '../../shared/models/room/player.model';
import { VoteStateService } from './vote-state.service';

@Injectable({ providedIn: 'root' })
export class PlayerStateService {
  private authService = inject(AuthService);
  private voteState = inject(VoteStateService);

  private _players = signal<PlayerDTO[]>([]);
  readonly players = this._players.asReadonly();

  readonly votes = this.voteState.votes;

  readonly playerRole = computed(()=>{
    const userId = this.authService.getUserIdFromJWT();
    return this._players().find(p => p.userId == userId)?.role;
  });


  getPlayer(playerId: string): PlayerDTO | undefined {
    return this._players().find(p => p.id === playerId);
  }

  setPlayers(players: PlayerDTO[]) {
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


  disconnectPlayer(playerId: string) {

    this._players.update(list =>
      list.map(p => (p.id === playerId ? { ...p, connected: false } : p))
    );
  }

  changeName(playerId: string, newName: string) {
    this._players.update(list =>
      list.map(p => (p.id === playerId ? { ...p, name: newName } : p))
    );
  }

  changeRole(playerId: string, newRole: PlayerRole) {

    this._players.update(list =>
      list.map(p => (p.id === playerId ? { ...p, role: newRole } : p))
    );
  }
}
