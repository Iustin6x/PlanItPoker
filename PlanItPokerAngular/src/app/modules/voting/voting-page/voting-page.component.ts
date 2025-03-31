import { Component, inject, computed } from '@angular/core';
import { StoryListComponent } from '../../story/story-list/story-list.component';
import { VotingCardComponent } from '../voting-card/voting-card.component';
import { RoomService } from '../../../core/services/room.service';
import { StoryService } from '../../../core/services/story.service';
import { CardType, CardValue } from '../../../shared/types';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { async } from 'rxjs';

@Component({
  selector: 'app-voting-page',
  standalone: true,
  imports: [CommonModule, StoryListComponent, VotingCardComponent],
  templateUrl: './voting-page.component.html',
  styleUrl: './voting-page.component.scss'
})
export class VotingPageComponent {
  private storyService = inject(StoryService);
  private roomService = inject(RoomService);
  private userService = inject(UserService);

  // Use signals directly
  currentStory = this.storyService.currentStory;

  currentRoom = computed(() => {
    const story = this.currentStory();
    return story ? this.roomService.rooms().find(r => r.id === story.roomId) : undefined;
  });

  customCardSet = computed((): CardValue[] => {
    const room = this.currentRoom();
    return room?.cardType === CardType.CUSTOM 
      ? [...(room.cards || [])] 
      : [];
  });

  handleVote(vote: CardValue) {
    const story = this.currentStory();
    if (!story) {
      console.error('No current story selected');
      return;
    }
    
    this.storyService.submitVote(
      story.id, 
      vote
    ).subscribe();

    console.log(this.storyService.stories());
  }
}