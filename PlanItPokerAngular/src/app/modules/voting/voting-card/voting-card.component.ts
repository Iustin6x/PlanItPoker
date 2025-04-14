import { Component, computed, effect, inject } from '@angular/core';
import { CardType, CardValue, PREDEFINED_CARD_SETS } from '../../../shared/types';
import { CommonModule } from '@angular/common';
import { RoomStateService } from '../../../core/services/room-state.service';
import { AuthService } from '../../../core/services/auth.service';
import { VoteStateService } from '../../../core/services/vote-state.service';
import { WebSocketMessageService } from '../../../core/services/web-socket-message.service';
import { RoomMessageHandlerService } from '../../../core/services/room-message-handler.service';

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
  private ws = inject(WebSocketMessageService);
  private roomHandler = inject(RoomMessageHandlerService);
  private wsMessages = inject(WebSocketMessageService);

  readonly cardType = this.roomState.cardType;
  readonly voteSession = this.voteState.voteSession;
  readonly cardValues = this.roomState.cards;

  readonly name = this.roomState.roomName;

  protected cards = computed(() => {
    const type = this.roomState.cardType();
    return type === CardType.CUSTOM ? 
      this.roomState.cards() : 
      PREDEFINED_CARD_SETS[type];
  });

  protected selectedCard = computed(() => 
    this.voteState.votes().find(v => v.userId === this.authService.getUserIdFromJWT())?.cardValue
  );

  constructor(){
    
    console.log("voting card " + this.cardType() +" " + this.cardValues() + " " );
    effect(() => {
      const session = this.voteSession();
      console.log('[EFFECT] VoteSession loaded:', session);
    });
    
  }

  readonly selectedValue = computed(() => {
    const userId = this.authService.getUserIdFromJWT();
    return this.voteSession()?.votes.find(v => v.userId === userId)?.cardValue || null;
  });

  selectCard(card: CardValue): void {
    console.log("press" + this.voteSession());
    const session = this.voteSession();
    if (!session) return;
    
    this.wsMessages.addVote(session.id, card.toString());
    console.log("press vote")
  }
}