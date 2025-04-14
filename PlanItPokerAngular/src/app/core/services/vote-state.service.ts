import { computed, inject, Injectable, signal } from '@angular/core';
import { VoteDTO, VoteSessionDTO } from '../../shared/models/wbs';
import { SessionStatus } from '../../shared/models/room/voting-session.model';
import { WebSocketService } from './websocket.service';
import { StoryStateService } from './story-state.service';

@Injectable({
  providedIn: 'root'
})
export class VoteStateService {
  private ws = inject(WebSocketService);
  private storyState = inject(StoryStateService);

  private _voteSession = signal<VoteSessionDTO | null>(null);
  readonly voteSession = this._voteSession.asReadonly();
  

  private _result = signal<string | null>(null);
  readonly result = this._result.asReadonly();

  private _votes = signal<VoteDTO[]>([])
  readonly votes = this._votes.asReadonly();
  

  updateVotes(votes: VoteDTO[], result: string | null) {
    this._votes.set(votes);
    this._result.set(result);
  }
  
  readonly revealedVotes = computed(() =>
    this._voteSession()?.revealed ? this._voteSession()?.votes ?? [] : null
  );

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

  setSession(session: VoteSessionDTO) {
    console.log("set votesession");
    this._voteSession.set(session || null);
  }

  clearVotes() {
    this._voteSession.update(session =>
      session ? { ...session, votes: [] } : session
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
  }

  hasVoted(playerId: string): boolean {
    return this._voteSession()?.votes.some(v => v.userId === playerId) ?? false;
  }

  
}
