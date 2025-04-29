import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardType, CardValue, PREDEFINED_CARD_SETS } from '../../../shared/types';
import { RoomStateService } from '../../../core/services/room-state.service';
import { AuthService } from '../../../core/services/auth.service';
import { VoteStateService } from '../../../core/services/vote-state.service';
import { WebSocketMessageService } from '../../../core/services/web-socket-message.service';
import { RoomMessageHandlerService } from '../../../core/services/room-message-handler.service';
import { PlayerStateService } from '../../../core/services/player-state.service';
import { PlayerRole } from '../../../shared/models/room/player.model';

@Component({
  selector: 'app-voting-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './voting-card.component.html',
  styleUrls: ['./voting-card.component.scss']
})
export class VotingCardComponent {
  private roomState = inject(RoomStateService);
  private authService = inject(AuthService);
  private voteState = inject(VoteStateService);
  private wsMessages = inject(WebSocketMessageService);
  private playerState = inject(PlayerStateService);

  readonly cardType = this.roomState.cardType;
  readonly voteSession = this.voteState.voteSession;
  readonly cardValues = this.roomState.cards;
  readonly playerRole = this.playerState.playerRole;
  readonly name = this.roomState.roomName;
  readonly allowQuestionMark = this.roomState.allowQuestionMark;
  readonly allowVoteModification = this.roomState.allowVoteModification;
  private voteChanged = signal(0);



  readonly isRevealed = computed(() => {
    return this.voteSession()?.revealed ?? false;
  });
  
  protected cards = computed(() => {
    const type = this.cardType();  
    let allCards = type === CardType.CUSTOM ? 
      this.cardValues() : 
      PREDEFINED_CARD_SETS[type];  
    
    if (this.allowQuestionMark()) {
      allCards = [...allCards, '?']; 
    }
  
    return allCards;  
  });


  protected selectedCard = computed<CardValue | null>(() => {
    if (this.playerRole() === PlayerRole.OBSERVER) return null;
    
    const rawValue = this.voteState.currentVote();
    if (!rawValue) return null;
  
    const cards = this.cards();
    const sampleCard = cards[0];
    
    if (typeof sampleCard === 'number') {
      return Number(rawValue);
    }
    return rawValue;
  });

  readonly selectedValue = computed(() => {
    const userId = this.authService.getUserIdFromJWT();
    return this.voteSession()?.votes.find(v => v.userId === userId)?.cardValue || null;
  });

  readonly votingLocked = computed(() => {
    return (
      this.playerRole() !== PlayerRole.OBSERVER &&
      this.selectedValue() !== null &&
      !this.allowVoteModification() &&
      !this.isRevealed()
    );
  });

  constructor() {
    effect(() => {
      const session = this.voteSession();
      const votes = this.voteState.votes();
      this.voteChanged.update(v => v + 1);
    });
  }



  selectCard(card: CardValue): void {
    const session = this.voteSession();
    if (!session || this.playerRole() === PlayerRole.OBSERVER) return;
    if (!this.allowVoteModification() && this.selectedCard() === card) return;
    this.wsMessages.addVote(session.id, card.toString());
  }
}