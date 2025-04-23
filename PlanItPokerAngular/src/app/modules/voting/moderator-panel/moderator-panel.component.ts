import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionStatus } from '../../../shared/models/room/voting-session.model';
import { VoteStateService } from '../../../core/services/vote-state.service';
import { PlayerStateService } from '../../../core/services/player-state.service';
import { WebSocketMessageService } from '../../../core/services/web-socket-message.service';
import { ConnectionStateService } from '../../../core/services/connection-state.service';
import { AuthService } from '../../../core/services/auth.service';
import { PlayerRole } from '../../../shared/models/room/player.model';
import { RoomStateService } from '../../../core/services/room-state.service';
import { StoryStateService } from '../../../core/services/story-state.service';

@Component({
  selector: 'app-moderator-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moderator-panel.component.html',
  styleUrl: './moderator-panel.component.scss'
})
export class ModeratorPanelComponent{
  protected connectionState = inject(ConnectionStateService);
  private roomState = inject(RoomStateService);
  private voteState = inject(VoteStateService);
  private playerState = inject(PlayerStateService);
  private storyState = inject(StoryStateService);
  private wsMessages = inject(WebSocketMessageService);
  protected authService = inject(AuthService)

  selectedResult: string | null = null;
  protected hasActiveStory = this.storyState.activeStories;
  protected voteSession = this.voteState.voteSession;
  protected result = this.voteState.result;
  protected players = this.playerState.players;
  protected cards = this.roomState.cards;

  protected sessionLoaded = this.voteState.sessionLoaded;

  readonly PlayerRole = PlayerRole;
  readonly playerRole = this.playerState.playerRole;

  // readonly isModerator = computed(() => {
  //   const userId = this.authService.getUserIdFromJWT();
  //   return true;
  // });

  constructor() {
    effect(() => {
      const currentResult = this.result();
      const availableCards = this.cards();


      console.log(availableCards);
      console.log("CURRENT RESULT "+ currentResult);
    
      if (!availableCards || availableCards.length === 0) return;
      if (currentResult == null) return;

      console.log("da");
    
      const exactMatch = availableCards.find(c => c === currentResult);
      if (exactMatch) {
        this.selectedResult = exactMatch.toString();
      } else {
        const specialCaseMatch = availableCards.find(c => c === '?');
        this.selectedResult = specialCaseMatch || availableCards[0].toString();
      }
    });
  }

  // ngOnInit() {
  //   effect(() => {
  //     const currentResult = this.result();
  //     const availableCards = this.cards();
  //     console.log("result " + this.selectedResult);

  //     if (currentResult && availableCards.length > 0) {
  //       const exactMatch = availableCards.find(c => c === currentResult);
  //       if (exactMatch) {
  //         this.selectedResult = exactMatch.toString();
  //       } else {
  //         const specialCaseMatch = availableCards.find(c => c === '?');
  //         this.selectedResult = specialCaseMatch || availableCards[0].toString();
  //       }
  //     } else if (availableCards.length > 0) {
  //       // Default to first card if no result
  //       this.selectedResult = availableCards[0].toString();
  //     }
  //   });
  // }

  handleAction(type: string, data?: any) {
    const session = this.voteSession();

    if (type === 'start') {
      this.wsMessages.startVoting();
      return; 
    }

    if (!session) return;

    switch (type) {
  
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

}