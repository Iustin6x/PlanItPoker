import { Injectable, inject, signal } from '@angular/core';
import { delay, finalize, Observable, of, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { CardValue, UUID } from '../../shared/types';
import { UserService } from './user.service';
import { VoteSession, SessionStatus } from '../../shared/models/room';

@Injectable({ providedIn: 'root' })
export class VoteService {
  private _session = signal<VoteSession>(this.initializeMockSession());
  private latency = 500;
  private userService = inject(UserService);
  
  session = this._session.asReadonly();
  loading = signal(false);

  private initializeMockSession(): VoteSession {
    const now = new Date();
    return {
      storyId: uuidv4() as UUID,
      roomId: uuidv4() as UUID,
      startTime: new Date(now.getTime() - 3600000),
      endTime: new Date(now.getTime() - 1800000),
      status: 'active',
      votes: {},
      revealed: false,
    };
  }

  getSession(): Observable<VoteSession> {
    this.loading.set(true);
    return of({ ...this._session() }).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  startSession(storyId: UUID, roomId: UUID): Observable<VoteSession> {
    this.loading.set(true);
    const newSession: VoteSession = {
      storyId,
      roomId,
      startTime: new Date(),
      status: 'active',
      votes: {},
      revealed: false
    };
    
    this._session.set(newSession);
    return of(newSession).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  endSession(): Observable<VoteSession> {
    return this.updateSession({
      endTime: new Date(),
      status: 'completed',
      revealed: true
    });
  }

  submitVote(vote: CardValue): Observable<VoteSession> {
    const userId = this.userService.currentUserId;
    if (!userId) return throwError(() => new Error('User not authenticated'));
    
    return this.updateSession({
      votes: { [userId]: vote }
    });
  }

  revealVotes(): Observable<VoteSession> {
    return this.updateSession({ revealed: true });
  }

  private updateSession(updates: Partial<VoteSession>): Observable<VoteSession> {
    this.loading.set(true);
    return new Observable<VoteSession>(subscriber => {
      const updatedSession = {
        ...this._session(),
        ...updates,
        votes: updates.votes
          ? { ...this._session().votes, ...updates.votes }
          : this._session().votes
      };

      this._session.set(updatedSession);

      subscriber.next(updatedSession);
      subscriber.complete();
    }).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  updateVotingSession(updates: Partial<VoteSession>): Observable<VoteSession> {
    return this.updateSession(updates);
  }

  closeVotingSession(): Observable<VoteSession> {
    return this.endSession();
  }
}