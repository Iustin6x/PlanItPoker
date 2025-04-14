import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionStatus } from '../../../shared/models/room/voting-session.model';
import { VoteStateService } from '../../../core/services/vote-state.service';
import { PlayerStateService } from '../../../core/services/player-state.service';
import { WebSocketMessageService } from '../../../core/services/web-socket-message.service';

@Component({
  selector: 'app-moderator-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moderator-panel.component.html',
  styleUrl: './moderator-panel.component.scss'
})
export class ModeratorPanelComponent implements OnInit {
  private voteState = inject(VoteStateService);
  private playerState = inject(PlayerStateService);
  private wsMessages = inject(WebSocketMessageService);

  selectedResult: string | null = null;
  protected isModerator = this.playerState.isModerator;
  protected voteSession = this.voteState.voteSession;
  protected result = this.voteState.result;

  ngOnInit() {
    console.log("moderator panel" + this.isModerator());
    this.selectedResult = this.result();
  }

  handleAction(type: string, data?: any) {
    const session = this.voteSession();
    if (!session) return;

    switch (type) {
      case 'start':
        this.wsMessages.startVoting();
        break;

      case 'flipCards':
        this.wsMessages.revealVotes(session.id);
        break;

      case 'clearVotes':
        this.wsMessages.clearVotes(session.id);
        break;

      case 'skipStory':
        this.wsMessages.skipStory(session.id, session.storyId);
        break;

      case 'finishVoting':
        if (data) {
          this.wsMessages.endVoteSession(session.id, data);
        }
        break;
    }
  }

  get safeVoteSession() {
    return this.voteSession() || this.getDefaultSession();
  }

  private getDefaultSession() {
    return {
      id: '',
      storyId: '',
      roomId: '',
      startTime: new Date().toISOString(),
      status: SessionStatus.PENDING,
      votes: [],
      revealed: false
    };
  }
}