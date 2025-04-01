import { Component, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Player, PlayerRole } from '../../../shared/models/room/player.model';
import { UUID } from '../../../shared/types';
import { CardValue } from '../../../shared/types';

@Component({
  selector: 'app-players-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './players-panel.component.html',
  styleUrl: './players-panel.component.scss'
})
export class PlayersPanelComponent {
  @Input() players: Player[] = [];
  @Input() isRevealed = false;
  @Input() inviteLink = '';
  @Input() votes: Record<UUID, CardValue> = {};
  @Output() inviteCopied = new EventEmitter<void>();
  
  protected PlayerRole = PlayerRole;
  protected showCopiedFeedback = signal(false);

  getPlayerVote(playerId: UUID): CardValue | '?' {
    return this.votes[playerId] ?? '?';
  }

  copyInviteLink() {
    navigator.clipboard.writeText(this.inviteLink).then(() => {
      this.showCopiedFeedback.set(true);
      setTimeout(() => this.showCopiedFeedback.set(false), 2000);
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

  getRoleBadge(role: PlayerRole): string {
    switch(role) {
      case PlayerRole.MODERATOR: return '👑';
      case PlayerRole.OBSERVER: return '👀';
      default: return '';
    }
  }
}