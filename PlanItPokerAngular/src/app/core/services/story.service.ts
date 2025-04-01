import { Injectable, inject, signal } from '@angular/core';
import { delay, finalize, Observable, of, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

import { UUID } from '../../shared/types';
import { Story, StoryStatus } from '../../shared/models/story';
import { UserService } from './user.service';

@Injectable({ providedIn: 'root' })
export class StoryService {
  private _stories = signal<Story[]>(this.initializeMockStories());
  private _currentStory = signal<Story | undefined>(undefined);
  private latency = 500;
  
  stories = this._stories.asReadonly();
  currentStory = this._currentStory.asReadonly();
  loading = signal(false);
  
  private initializeMockStories(): Story[] {
    return [
      this.createStoryEntity({
        id: 'a1b2c3d4-1234-5678-9abc-def123456789' as UUID,
        name: 'User Authentication',
        roomId: 'd8a12f04-3c5b-4d7e-8f6a-1c3b9d7e8f6c' as UUID,
        status: StoryStatus.COMPLETED,
        finalResult: '8'
      }),
      this.createStoryEntity({
        id: 'b2c3d4e5-2345-6789-0abc-ef1234567890' as UUID,
        name: 'Payment Gateway Integration',
        roomId: '550e8400-e29b-41d4-a716-446655440000' as UUID,
        order: 0,
        status: StoryStatus.ACTIVE
      })
    ];
  }

  private createStoryEntity(data: Partial<Story>): Story {
    return {
      id: uuidv4() as UUID,
      name: '',
      roomId: '' as UUID,
      status: StoryStatus.ACTIVE,
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

  createStory(dto: { name: string; roomId: UUID }): Observable<Story> {
    this.loading.set(true);
    
    const activeStoriesInRoom = this._stories().filter(story => 
      story.roomId === dto.roomId && 
      story.status === StoryStatus.ACTIVE
    );
  
    const maxOrder = activeStoriesInRoom.reduce((max, story) => 
      story.order && story.order > max ? story.order : max, 
      0
    );
  
    const newStory = this.createStoryEntity({
      ...dto,
      status: StoryStatus.ACTIVE,
      order: maxOrder + 1
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

      const originalStory = stories[index];
      const updatedStory = { ...originalStory, ...updates };

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

  updateStoryOrder(orderedIds: UUID[]): Observable<void> {
    this.loading.set(true);
    return new Observable<void>(subscriber => {
      const updatedStories = this._stories().map(story => {
        const newOrder = orderedIds.indexOf(story.id) + 1;
        if (story.status === StoryStatus.ACTIVE && 
            orderedIds.includes(story.id) && 
            story.order !== newOrder) {
          return { ...story, order: newOrder };
        }
        return story;
      });
  
      this._stories.set(updatedStories);
      subscriber.next();
      subscriber.complete();
    }).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  setFirstStoryAsCurrent(): void {
    const stories = this._stories().filter(s => s.status === StoryStatus.ACTIVE);
    this._currentStory.set(stories.length > 0 ? stories[0] : undefined);
  }

  setCurrentStory(storyId: UUID): void {
    const story = this._stories().find(s => s.id === storyId);
    if (story) {
      this._currentStory.set(story);
    }
  }

  moveToNextStory(): void {
    const stories = this._stories();
    const currentIndex = stories.findIndex(s => s.id === this._currentStory()?.id);
    
    if (currentIndex >= 0 && currentIndex < stories.length - 1) {
      this._currentStory.set(stories[currentIndex + 1]);
    }
  }  
}
