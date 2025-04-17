import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerRole } from '../../../shared/models/room/player.model';
import { PlayerStateService } from '../../../core/services/player-state.service';
import { VoteStateService } from '../../../core/services/vote-state.service';
import { ConnectionStateService } from '../../../core/services/connection-state.service';
import { PlayerDTO } from '../../../shared/models/wbs';
import { AuthService } from '../../../core/services/auth.service';
import { WebSocketMessageService } from '../../../core/services/web-socket-message.service';

@Component({
  selector: 'app-players-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './players-panel.component.html',
  styleUrl: './players-panel.component.scss'
})
export class PlayersPanelComponent{
  protected connectionState = inject(ConnectionStateService);
  protected playerState = inject(PlayerStateService);
  protected voteState = inject(VoteStateService);
  protected authService = inject(AuthService);
  private wsMessages = inject(WebSocketMessageService);
  protected showCopiedFeedback = false;

  
  protected players = this.playerState.players;
  protected voteSession = this.voteState.voteSession;
  protected inviteLink = computed(() => window.location.href);
  protected PlayerRole = PlayerRole;
  readonly isModerator = computed(() => {
    const userId = this.authService.getUserIdFromJWT();
    return this.players().some(p => 
      p.userId === userId && p.role === PlayerRole.MODERATOR
    );
  });
  protected votes = this.voteState.votes;
  protected editingPlayerId = signal<string | null>(null);
  protected editingRolePlayerId = signal<string | null>(null);
  protected roles = Object.values(PlayerRole).filter(v => typeof v === 'string') as PlayerRole[];
  protected sortedPlayers = computed(() => {
    return this.players().slice().sort((a, b) => {
      return (b.connected ? 1 : 0) - (a.connected ? 1 : 0);
    });
  });

  protected notVotedOnlinePlayers = computed(() => {
    if (!this.voteSession()) return [];
    return this.players().filter(p =>
      p.connected && !p.hasVoted
    );
  });

  protected waitingMessage = computed(() => {
    const remaining = this.notVotedOnlinePlayers();
    const count = remaining.length;
  
    if (count === 0) {
      return "All players have voted!";
    }
    if (count === 1) {
      return `Waiting for ${remaining[0].name} to vote`;
    }
    if (count === 2) {
      return `Waiting for ${remaining[0].name} and ${remaining[1].name} to vote`;
    }
  
    return `${count} players still need to vote`;
  });

  trackById(index: number, player: PlayerDTO): any {
    return player.id; 
  }

  getPlayerVote(userId: string): string {

    return this.votes().find(v => v.userId === userId)?.cardValue || '?';
  }

  copyInviteLink() {
    navigator.clipboard.writeText(this.inviteLink()).then(() => {
      this.showCopiedFeedback = true;
      setTimeout(() => this.showCopiedFeedback = false, 2000);
    });
  }

  getAvatarInitials(name: string): string {
    return name.split(' ')
      .filter(part => part.length > 0)
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  // hasVoted(playerId: string): boolean {
  //   return this.voteState.votes().some(v => v.userId === playerId);
  // }
  

  getRoleBadge(role: PlayerRole): string {
    switch(role) {
      case PlayerRole.MODERATOR: return '👑';
      case PlayerRole.OBSERVER: return '👀';
      default: return '';
    }
  }

  startEditName(player: PlayerDTO): void {
    const userId = this.authService.getUserIdFromJWT();
    if (this.isModerator() || player.userId === userId) {
      this.editingPlayerId.set(player.id);
    }
  }

  saveName(player: PlayerDTO): void {
    this.wsMessages.changePlayerName(player.id, player.name.trim())
    if (player.name.trim() && player.name !== this.playerState.getPlayer(player.id)?.name) {
      // this.playerState.changeName(player.id, player.name.trim());
      // this.wsMessages.changePlayerName(player.id, player.name.trim())
    }
    this.editingPlayerId.set(null);
  }

  startEditRole(player: PlayerDTO): void {
    if (this.isModerator()) {
      this.editingRolePlayerId.set(player.id);
    }
  }

  saveRole(player: PlayerDTO): void {
    this.wsMessages.changePlayerRole(player.id, player.role);
    console.log("saveRole " + this.playerState.getPlayer(player.id)?.role);
    this.editingRolePlayerId.set(null);
  }
}