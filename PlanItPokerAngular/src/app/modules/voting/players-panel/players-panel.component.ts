import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlayerRole } from '../../../shared/models/room/player.model';
import { PlayerStateService } from '../../../core/services/player-state.service';
import { VoteStateService } from '../../../core/services/vote-state.service';
import { ConnectionStateService } from '../../../core/services/connection-state.service';
import { PlayerDTO } from '../../../shared/models/wbs';

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
  protected showCopiedFeedback = false;

  // Computed values
  protected players = this.playerState.players;
  protected voteSession = this.voteState.voteSession;
  protected inviteLink = computed(() => window.location.href);
  protected PlayerRole = PlayerRole;

  trackById(index: number, player: PlayerDTO): any {
    return player.id; 
  }

  getPlayerVote(playerId: string): string {
    const votes = this.voteState.votes();
    return votes.find(v => v.userId === playerId)?.cardValue || '?';
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
    return this.voteState.votes().some(v => v.userId === playerId);
  }

  getRoleBadge(role: PlayerRole): string {
    switch(role) {
      case PlayerRole.MODERATOR: return '👑';
      case PlayerRole.OBSERVER: return '👀';
      default: return '';
    }
  }
}