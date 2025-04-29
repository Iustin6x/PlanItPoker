import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { VoteDTO, VoteSessionDTO } from '../../shared/models/wbs';
import { SessionStatus } from '../../shared/models/room/voting-session.model';
import { WebSocketService } from './websocket.service';
import { StoryStateService } from './story-state.service';
import { AuthService } from './auth.service';
import { CardValue } from '../../shared/types';
import { PlayerStateService } from './player-state.service';

@Injectable({
  providedIn: 'root'
})
export class VoteStateService {
  private ws = inject(WebSocketService);
  private storyState = inject(StoryStateService);
  private authService = inject(AuthService);

  private _currentVote = signal<string | null>(null);
  readonly currentVote = this._currentVote.asReadonly();

  private _voteSession = signal<VoteSessionDTO | null>(null);
  readonly voteSession = this._voteSession.asReadonly();

  readonly sessionLoaded = computed(() => this.voteSession() !== null);

  private _result = signal<string | null>(null);
  readonly result = this._result.asReadonly();

  private _votes = signal<VoteDTO[]>([])
  readonly votes = this._votes.asReadonly();

  

  readonly isRevealed = computed(() => {
    return this._voteSession()?.revealed ?? false;
  });


  constructor() {
    effect(() => {
      const session = this._voteSession();
      if (session) {
        this._votes.set([...session.votes]);
        this._result.set(session.result);
      }
    });
  }




  revealVotes(votes: VoteDTO[], result: string | null) {
    this._votes.set([...votes]);
    this._result.set(result);
    this._voteSession.update(session =>
      session ? { ...session, votes: [...votes], result, revealed: true } : session
    );
    this.resetCurrentVote();
  }

  readonly currentStory = computed(() => {
    const session = this._voteSession();
    if (!session) return null;

    return this.storyState.getStory(session.storyId);
  });



  submitVote(cardValue: string): void {
    const session = this._voteSession();
    if (!session) {
      console.error('No active voting session!');
      return;
    }

    const sessionId = session.id;
    if (sessionId) {
      this.ws.send({
        type: 'addVote',
        sessionId: sessionId,
        cardValue: cardValue
      });
    } else {
      console.error('Session ID is missing');
    }
  }

  skipStory(storyId: string): void {
    const session = this._voteSession();
    if (!session) return;

    this.ws.send({
      type: 'skipVote',
      sessionId: session.id,
      storyId: storyId
    });

    this.resetCurrentVote();
  }

  voteAdded(vote: VoteDTO, cardValue: string | undefined): void {
    const existingVotes = this._votes();

    const alreadyExists = existingVotes.some(v => v.userId === vote.userId);
    if (alreadyExists) return;

    const updatedVotes = [...existingVotes, vote];
    this._votes.set(updatedVotes);

    this._voteSession.update(session => {
      if (!session) return null;
      return {
        ...session,
        votes: [...session.votes, vote]
      };
    });
    console.log("vot adaugat ",cardValue)
    if (cardValue !== undefined) {
      this.setCurrentVote(cardValue);
    }
  }



  setSession(session: VoteSessionDTO | null): void {
    this._voteSession.set(session);
  }

  clearVotes() {

    this._voteSession.update(session =>
      session ? { ...session, votes: [], revealed: false } : session
    );
    this.resetCurrentVote();
  }

  showVotes(votes: VoteDTO[]) {
    this._voteSession.update(session =>
      session ? { ...session, votes, revealed: true } : null
    );
    this.resetCurrentVote();
  }

  endSession(finalValue: string) {
    this._voteSession.update(session =>
      session ? {
        ...session,
        status: SessionStatus.COMPLETED,
        finalValue: finalValue
      } : null
    );
    this.resetCurrentVote();  
  }


  hasVoted(playerId: string): boolean {
    return this._votes().some(vote => vote.userId === playerId);
  }

  setCurrentVote(cardValue: string | null): void {
    this._currentVote.set(cardValue);
  }

  private resetCurrentVote() {
    this._currentVote.set(null);
  }
}
