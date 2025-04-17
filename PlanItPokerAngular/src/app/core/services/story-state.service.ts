import { computed, Injectable, signal } from '@angular/core';
import { StoryDTO } from '../../shared/models/wbs';

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

  setStories(stories: StoryDTO[]) {
    this._stories.set(stories);
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
}
