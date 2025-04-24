import { computed, Injectable, signal } from '@angular/core';
import { StoryDTO, VoteSessionDTO } from '../../shared/models/wbs';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root'
})
export class StoryStateService {
  private _stories = signal<StoryDTO[]>([]);
  readonly stories = this._stories.asReadonly();

  readonly activeStories = computed(() =>
    this._stories().filter(s => s.status === 'ACTIVE')
  );

  readonly completedStories = computed(() =>
    this._stories().filter(s => ( s.status === 'COMPLETED' || s.status === 'SKIPPED'))
  );

  
  private _viewedStory = signal<StoryDTO | null>(null);
  readonly viewedStory = this._viewedStory.asReadonly();


  private _viewedSession = signal<VoteSessionDTO | null>(null);
  readonly viewedSession = this._viewedSession.asReadonly();
  

  setViewedStory(story: StoryDTO) {
    this._viewedStory.set(story);
  }

  setViewedSession(session: VoteSessionDTO | null): void {
    this._viewedSession.set(session);
  }

  clearViewedData() {
    this._viewedStory.set(null);
    this._viewedSession.set(null);
  }

  setStories(stories: StoryDTO[]) {
    this._stories.set(stories);
  }

  clearViewedSession(): void {
    this._viewedSession.set(null);
  }

  addStory(story: StoryDTO) {
    this._stories.update(list => [...list, story]);
  }

  updateStory(story: StoryDTO) {
    this._stories.update(list =>
      list.map(s => (s.id === story.id ? story : s))
    );
  }

  deleteStory(storyId: string) {
    this._stories.update(list => list.filter(s => s.id !== storyId));
  }

  getStory(storyId: string): StoryDTO | undefined {
    return this._stories().find(s => s.id === storyId);
  }

  getCurrentSession(storyId: string): VoteSessionDTO | null {
    const session = this._viewedSession();
    return session?.storyId === storyId ? session : null;
  }


  
}
