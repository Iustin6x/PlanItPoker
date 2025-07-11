import { Component, computed, inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StoryDetailsDialogComponent } from '../story-details-dialog/story-details-dialog.component';
import { StoryStatus } from '../../../shared/models/story';
import { StoryDTO } from '../../../shared/models/wbs';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';
import { StoryStateService } from '../../../core/services/story-state.service';
import { WebSocketMessageService } from '../../../core/services/web-socket-message.service';
import { PlayerStateService } from '../../../core/services/player-state.service';
import { ConnectionStateService } from '../../../core/services/connection-state.service';

@Component({
  selector: 'app-story-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatIconModule,
    DragDropModule,
    MatTableModule,
  ],
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent {
  private dialog = inject(MatDialog);
  protected storyState = inject(StoryStateService);
  private wsMessageService = inject(WebSocketMessageService);
  private playerState = inject(PlayerStateService);
  private connectionState = inject(ConnectionStateService);

  
    // Expozăm proprietatea isModerator
  readonly playerRole = this.playerState.playerRole;
  

  protected selectedTab = signal(0);
  
  protected filteredStories = computed(() => {
    switch (this.selectedTab()) {
      case 0: return this.storyState.activeStories();
      case 1: return this.storyState.completedStories();
      case 2: return this.storyState.stories();
      default: return [];
    }
  });

  readonly displayedColumns = computed(() => {
    const baseColumns = ['position', 'name'];
    return this.playerRole() === 'MODERATOR' ? [...baseColumns, 'actions'] : baseColumns;
  });

  // Story actions
  handleDeleteStory(storyId: string): void {
    this.wsMessageService.deleteStory(storyId);
    
  }

  handleCreateStory(name: string): void {
    this.wsMessageService.createStory(name);
  }

  handleUpdateStory(storyId: string, name: string): void {
    this.wsMessageService.updateStory(storyId, name);
  }

  handleEditStory(story: StoryDTO): void {
    this.dialog.open(StoryDetailsDialogComponent, {
      data: story,  
      width: '600px'
    }).afterClosed().subscribe(updatedStory => {
      if (updatedStory) {
        this.handleUpdateStory(story.id, updatedStory.name);  
      }
    });
  }

  openCreateDialog(): void {
    this.dialog.open(StoryDetailsDialogComponent, {
      width: '600px'
    }).afterClosed().subscribe(newStory => {
      if (newStory) {
        this.handleCreateStory(newStory.name);
      }
    });
  }
}