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

  private _voteSession = signal<VoteSessionDTO | null>(null);
  readonly voteSession = this._voteSession.asReadonly();


  readonly sessionLoaded = computed(() => this.voteSession() !== null);

  
  private _localVote = signal<string | null>(null);
  readonly localVote = this._localVote.asReadonly();


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
    session ? {...session, votes: [...votes], result, revealed: true} : session
  );
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
  }

  voteAdded(vote: VoteDTO): void {
    console.log("vote added");
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
  }

  

  setSession(session: VoteSessionDTO | null): void {
    this._voteSession.set(session);
  }

  clearVotes() {
    this.clearAllLocalVotesForSession();
    this._voteSession.update(session =>
      session ? { ...session, votes: [], revealed: false } : session
    );
  }

  showVotes(votes: VoteDTO[]) {
    this._voteSession.update(session =>
      session ? { ...session, votes, revealed: true } : null
    );
  }

  endSession(finalValue: string) {
    this._voteSession.update(session =>
      session ? {
        ...session,
        status: SessionStatus.COMPLETED,
        finalValue: finalValue
      } : null
    );

    const userId = this.authService.getUserIdFromJWT();
    const sessionId = this._voteSession()?.id;
    if (sessionId && userId) {
      localStorage.removeItem(`vote-${sessionId}-${userId}`);
    }
  }


  hasVoted(playerId: string): boolean {
    return this._votes().some(vote => vote.userId === playerId);
  }



  saveLocalVote(cardValue: CardValue): void {
    const session = this._voteSession();
    const userId = this.authService.getUserIdFromJWT();
    if (!session || !userId) return;

    const key = this.getLocalStorageKey(session.id, userId);
    localStorage.setItem(key, JSON.stringify({ sessionId: session.id, cardValue }));
    this._localVote.set(cardValue.toString());
  }

  getLocalVote(): string | null {
    const session = this._voteSession();
    const userId = this.authService.getUserIdFromJWT();
    if (!session || !userId) return null;

    const key = this.getLocalStorageKey(session.id, userId);
    const savedVote = localStorage.getItem(key);
    return this.parseLocalVote(savedVote, session.id);
  }

  private parseLocalVote(savedVote: string | null, currentSessionId: string): string | null {
    if (!savedVote) return null;
    
    try {
      const { sessionId, cardValue } = JSON.parse(savedVote);
      return sessionId === currentSessionId ? cardValue : null;
    } catch (e) {
      console.error('Error parsing local vote:', e);
      return null;
    }
  }


  clearLocalVote(): void {
    const session = this._voteSession();
    const userId = this.authService.getUserIdFromJWT();
    if (!session || !userId) return;

    const key = this.getLocalStorageKey(session.id, userId);
    localStorage.removeItem(key);
  }

  clearAllLocalVotesForSession(): void {
    const session = this._voteSession();
    if (!session) return;

    const prefix = `vote-${session.id}-`;
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith(prefix)) {
        localStorage.removeItem(key);
      }
    });
  }

  private getLocalStorageKey(sessionId: string, userId: string): string {
    return `vote-${sessionId}-${userId}`;
  }



}
