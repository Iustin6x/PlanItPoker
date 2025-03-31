import { Injectable, inject, signal } from '@angular/core';
import { delay, finalize, Observable, of, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { CardValue, UUID } from '../../shared/types';
import { Story, StoryStatus } from '../../shared/models/story';
import { VoteSession } from '../../shared/models/room';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class StoryService {
  private _stories = signal<Story[]>(this.initializeMockStories());
  private latency = 500;
  private userService = inject(UserService);
  
  stories = this._stories.asReadonly();
  loading = signal(false);

  

  private initializeMockStories(): Story[] {
    return [
      this.createStoryEntity({
        id: 'a1b2c3d4-1234-5678-9abc-def123456789' as UUID,
        name: 'User Authentication',
        roomId: 'd8a12f04-3c5b-4d7e-8f6a-1c3b9d7e8f6c' as UUID,
        status: StoryStatus.COMPLETED,
        session: {
          startTime: new Date(),
          status: 'active',
          votes: {} as Record<UUID, CardValue>,
          revealed: false
        }
      }),
      this.createStoryEntity({
        id: 'b2c3d4e5-2345-6789-0abc-ef1234567890' as UUID,
        name: 'Payment Gateway Integration',
        roomId: '550e8400-e29b-41d4-a716-446655440000' as UUID,
        status: StoryStatus.ACTIVE,
        session: {
          startTime: new Date(Date.now() - 3600000),
          endTime: new Date(),
          status: 'completed',
          votes: {
            '550e8400-e29b-41d4-a716-446655440000': '5',
            'd8a12f04-3c5b-4d7e-8f6a-1c3b9d7e8f6c': '8'
          },
          revealed: true
        }
      })
    ];
  }

  private createStoryEntity(data: Partial<Story>): Story {
    return {
      id: uuidv4() as UUID,
      name: '',
      roomId: '' as UUID,
      status: StoryStatus.ACTIVE,
      session: {
        startTime: new Date(),
        status: 'pending',
        votes: {} as Record<UUID, CardValue>,
        revealed: false
      },
      finalResult: undefined,
      ...data
    };
  }

  getStories(): Observable<Story[]> {
    this.loading.set(true);
    return of(this._stories()).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  getStoryById(id: UUID): Observable<Story> {
    this.loading.set(true);
    const story = this._stories().find(s => s.id === id);
    return (story ? of({...story}) : throwError(() => new Error(`Story ${id} not found`))).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  getStoriesByRoomId(roomId: UUID): Observable<Story[]> {
    this.loading.set(true);
    const stories = this._stories().filter(story => story.roomId === roomId);
    return (stories.length > 0 ? of([...stories]) : throwError(() => new Error(`No stories found for room ${roomId}`)))
      .pipe(
        delay(this.latency),
        finalize(() => this.loading.set(false))
      );
  }

  createStory(dto: { name: string; roomId: UUID }): Observable<Story> {
    this.loading.set(true);
    const newStory = this.createStoryEntity({
      ...dto,
      status: StoryStatus.ACTIVE
    });
    
    this._stories.update(stories => [...stories, newStory]);
    return of(newStory).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  updateStory(id: UUID, updates: Partial<Story>): Observable<Story> {
    this.loading.set(true);
    return new Observable<Story>(subscriber => {
      const stories = this._stories();
      const index = stories.findIndex(s => s.id === id);
      
      if (index === -1) {
        subscriber.error(new Error(`Story ${id} not found`));
        return;
      }

      const updatedStory = {
        ...stories[index],
        ...updates,
        session: {...stories[index].session} // Preserve existing session
      };

      this._stories.update(currentStories => 
        currentStories.map(story => 
          story.id === id ? updatedStory : story
        )
      );

      subscriber.next(updatedStory);
      subscriber.complete();
    }).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  deleteStory(id: UUID): Observable<void> {
    this.loading.set(true);
    return new Observable<void>(subscriber => {
      const exists = this._stories().some(s => s.id === id);
      if (!exists) {
        subscriber.error(new Error(`Story ${id} not found`));
        return;
      }

      this._stories.update(stories => stories.filter(s => s.id !== id));
      subscriber.next();
      subscriber.complete();
    }).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  updateVotingSession(storyId: UUID, updates: Partial<VoteSession>): Observable<Story> {
    this.loading.set(true);
    return new Observable<Story>(subscriber => {
      const stories = this._stories();
      const storyIndex = stories.findIndex(s => s.id === storyId);
      
      if (storyIndex === -1) {
        subscriber.error(new Error(`Story ${storyId} not found`));
        return;
      }

      const updatedStory = {
        ...stories[storyIndex],
        session: {
          ...stories[storyIndex].session,
          ...updates,
          votes: updates.votes 
            ? { ...stories[storyIndex].session.votes, ...updates.votes }
            : stories[storyIndex].session.votes
        }
      };

      this._stories.update(currentStories =>
        currentStories.map(story =>
          story.id === storyId ? updatedStory : story
        )
      );

      subscriber.next(updatedStory);
      subscriber.complete();
    }).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }
  revealVotes(storyId: UUID): Observable<Story> {
    return this.updateVotingSession(storyId, { revealed: true });
  }

  closeVotingSession(storyId: UUID): Observable<Story> {
    return this.updateVotingSession(storyId, { 
      status: 'completed',
      endTime: new Date(),
      revealed: true
    });
  }

  submitVote(storyId: UUID, vote: CardValue): Observable<Story> {
    const userId = this.userService.currentUserId;
    return this.updateVotingSession(storyId, {
      votes: { [userId]: vote }
    });
  }
}