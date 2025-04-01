import { Component, inject, computed, OnInit } from '@angular/core';
import { StoryListComponent } from '../../story/story-list/story-list.component';
import { VotingCardComponent } from '../voting-card/voting-card.component';
import { RoomService } from '../../../core/services/room.service';
import { StoryService } from '../../../core/services/story.service';
import { CardType, CardValue } from '../../../shared/types';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { FormsModule } from '@angular/forms';
import { MatGridListModule } from '@angular/material/grid-list';
import { StoryStatus } from '../../../shared/models/story';
import { ActivatedRoute } from '@angular/router';
import { UUID } from 'crypto';
import { VoteService } from '../../../core/services/vote.service';
import { ModeratorPanelComponent } from '../moderator-panel/moderator-panel.component';

@Component({
  selector: 'app-voting-page',
  standalone: true,
  imports: [CommonModule, StoryListComponent, VotingCardComponent, ModeratorPanelComponent, FormsModule, MatGridListModule],
  templateUrl: './voting-page.component.html',
  styleUrl: './voting-page.component.scss'
})
export class VotingPageComponent implements OnInit {
  private storyService = inject(StoryService);
  private roomService = inject(RoomService);
  private voteService = inject(VoteService);
  private route = inject(ActivatedRoute);

  roomId: string | null = null;

  currentStory = this.storyService.currentStory;
  currentRoom = this.roomService.currentRoom;
  voteSession = this.voteService.session;

  ngOnInit() {
    this.roomId = this.route.snapshot.paramMap.get('roomId');
    if (this.roomId) {
      this.roomService.setCurrentRoom(this.roomId as UUID);
    } else {
      console.error('Invalid UUID:', this.roomId);
    }
    console.log('Room ID:', this.roomId);
    this.storyService.setFirstStoryAsCurrent();

    console.log(this.currentRoom());
    console.log(this.currentStory());
  }

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
    
    this.voteService.submitVote(vote).subscribe();
    console.log(this.storyService.stories());
  }

  handleModeratorAction(event: { type: string, data?: any }) {
    const story = this.currentStory();
    if (!story) {
      console.error('No current story selected');
      return;
    }
    
    switch(event.type) {
      case 'start':
        this.voteService.updateVotingSession({ 
          status: 'active', 
          startTime: new Date() 
        }).subscribe();
        break;
      case 'resetTimer':
        this.voteService.updateVotingSession({ 
          startTime: new Date() 
        }).subscribe();
        break;
      case 'flipCards':
        this.voteService.revealVotes().subscribe();
        break;
      case 'clearVotes':
        this.voteService.updateVotingSession({ 
          votes: {} 
        }).subscribe();
        break;
      case 'skipStory':
        this.voteService.closeVotingSession().subscribe(() => {
          this.storyService.updateStory(story.id, { 
            status: StoryStatus.COMPLETED 
          }).subscribe(() => {
            this.storyService.moveToNextStory();
          });
        });
        break;
      case 'finishVoting':
        this.voteService.closeVotingSession().subscribe(() => {
          this.storyService.updateStory(story.id, { 
            finalResult: event.data 
          }).subscribe();
        });
        break;
      case 'nextStory':
        // Move to next story
        break;
    }
  }
}

function isValidUUID(roomId: string) {
  throw new Error('Function not implemented.');
}