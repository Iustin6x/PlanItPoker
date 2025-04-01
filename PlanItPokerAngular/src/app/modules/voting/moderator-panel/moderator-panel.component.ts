import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { VoteSession } from '../../../shared/models/room';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardValue } from '../../../shared/types';
import { StoryService } from '../../../core/services/story.service';
import { UUID } from 'crypto';
import { SessionStatus } from '../../../shared/models/room'; // Asigură-te că importi SessionStatus

@Component({
  selector: 'app-moderator-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './moderator-panel.component.html',
  styleUrl: './moderator-panel.component.scss'
})
export class ModeratorPanelComponent {
  @Input() voteSession: VoteSession | null = null;
  @Input() availableCards: CardValue[] = [];
  @Output() action = new EventEmitter<{ type: string, data?: any }>();

  private storyService = inject(StoryService);
  selectedResult: string | null = null;

  get calculatedResult(): string | null {
    if (!this.voteSession?.revealed) return null;
    const votes = Object.values(this.voteSession.votes);
    
    const counts: { [key: string]: number } = {};
    let max = 0;
    let result = '';
    
    votes.forEach(vote => {
      // Convertim explicit la string
      const stringValue = String(vote);
      counts[stringValue] = (counts[stringValue] || 0) + 1;
      
      if (counts[stringValue] > max) {
        max = counts[stringValue];
        result = stringValue;
      }
    });
    
    return result || null;
  }

  ngOnInit() {
    if (this.voteSession?.revealed) {
      this.selectedResult = this.calculatedResult;
    }
  }

  handleAction(type: string, data?: any) {
    if (!this.voteSession) {
      console.error('No active voting session');
      return;
    }
    
    this.action.emit({ type, data });
  }

  private getDefaultSession(): VoteSession {
    return {
      storyId: '' as UUID,
      roomId: '' as UUID,
      startTime: new Date(),
      status: SessionStatus.Pending,
      votes: {},
      revealed: false
    };
  }

  get safeVoteSession(): VoteSession {
    return this.voteSession || this.getDefaultSession();
  }
}