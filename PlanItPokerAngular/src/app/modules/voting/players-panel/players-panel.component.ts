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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-players-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatCheckboxModule, ],
  templateUrl: './players-panel.component.html',
  styleUrl: './players-panel.component.scss'
})
export class PlayersPanelComponent{
  protected connectionState = inject(ConnectionStateService);
  protected playerState = inject(PlayerStateService);
  protected voteState = inject(VoteStateService);
  protected authService = inject(AuthService);
  protected PlayerRole = PlayerRole;
  private wsMessages = inject(WebSocketMessageService);
  protected showCopiedFeedback = false;

  protected votedMap = computed(() => {
    return new Set(this.votes().map(v => v.userId));
  });

  
  protected players = this.playerState.players;
  protected voteSession = this.voteState.voteSession;
  protected inviteLink = computed(() => window.location.href);
  readonly playerRole = computed(()=> {
    const userId = this.authService.getUserIdFromJWT();
    return this.players().find(p => p.userId === userId)?.role;
  });
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
      p.connected && !this.voteState.hasVoted(p.userId) && p.role !== PlayerRole.OBSERVER
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

  hasVoted(playerId: string): boolean {
    return this.votedMap().has(playerId);
  }

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
    this.editingRolePlayerId.set(null);
  }
}