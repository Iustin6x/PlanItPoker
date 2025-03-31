import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StoryDetailsDialogComponent } from '../story-details-dialog/story-details-dialog.component';
import { Story, StoryStatus } from '../../../shared/models/story';
import { UUID } from '../../../shared/types';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatOptionModule } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { filter, take } from 'rxjs';
import { RoomService } from '../../../core/services/room.service';
import { StoryService } from '../../../core/services/story.service';

@Component({
  selector: 'app-story-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatListModule,
    MatTabsModule,
    MatIconModule,
  ],
  templateUrl: './story-list.component.html',
  styleUrls: ['./story-list.component.scss']
})
export class StoryListComponent implements OnInit {
  private roomService = inject(RoomService);
  private storyService = inject(StoryService);
  private dialog = inject(MatDialog);


  filteredStories: Story[] = [];
  selectedTab = 0;

  stories = this.storyService.stories;
  isLoading = this.roomService.loading;

  get activeStories() {
    return this.stories().filter(s => s.status === StoryStatus.ACTIVE);
  }
  
  get completedStories() {
    return this.stories().filter(s => s.status === StoryStatus.COMPLETED);
  }
  
  get allStories() {
    return this.stories();
  }

  constructor(){
    this.roomService.getRoomsByUserId();
  }
  ngOnInit() {
    this.filterStories();
  }

  filterStories() {
    switch (this.selectedTab) {
      case 0:
        this.filteredStories = this.stories().filter(s => s.status === StoryStatus.ACTIVE);
        break;
      case 1:
        this.filteredStories = this.stories().filter(s => s.status === StoryStatus.COMPLETED);
        break;
      case 2:
        this.filteredStories = [...this.stories()];
        break;
    }
  }
  handleSelectStory(storyId: UUID): void {
    this.storyService.setCurrentStory(storyId);
  }

  handleDeleteStory(storyId: UUID): void {
      this.storyService.deleteStory(storyId).subscribe({
        error: (err) => console.error('Ștergerea a eșuat:', err)
      });
    }
  
    handleEditStory(story: Story): void {
      console.log("open edit"+story.name);
      this.openStoryDialog(
        { 
          id: story.id,
          name: story.name,
          roomId: story.roomId,
          session: story.session,
          status: story.status,
          finalResult: story.finalResult,
        },
        (dto) => this.updateStory(dto) 
      );
    }

    openCreateDialog(): void {
      this.openStoryDialog(
        undefined, // No initial data for creation
        (dto) => this.createStory(dto)
      );
    }

    private updateStory(dto: Story): void {
      console.log(dto);
        if (!dto.id) {
          console.error('Update failed: Missing room ID');
          return;
        }
      
        this.storyService.updateStory(dto.id, dto).subscribe({
          next: () => {
            this.refreshStories();
            // Consider adding success feedback here
          },
          error: (err) => this.handleStoryError('Update', err)
        });
      }


    private openStoryDialog(initialData: Partial<Story> | undefined, callback: (dto: Story) => void): void {
        const dialogRef = this.dialog.open(StoryDetailsDialogComponent, {
          width: '600px',
          disableClose: true,
          data: initialData
        });
      
        dialogRef.afterClosed()
          .pipe(
            filter(story => this.isValidStory(story)), // Consolidated validation
            take(1) // Ensure automatic cleanup
          )
          .subscribe({
            next: (dto: Story) => callback(dto),
            error: (err) => this.handleDialogError(err)
          });
      }

      private isValidStory(dto: unknown): dto is Story {
          return !!dto && 
                 typeof dto === 'object' &&
                 !Array.isArray(dto) &&
                 'name' in dto &&
                 typeof (dto as Story).name === 'string';
        }

        private handleDialogError(err: any): void {
          console.error('Dialog operation failed:', err);
        }

        private createStory(story: Story): void {
            this.storyService.createStory(story).subscribe({
              next: (createdStory) => this.handleCreatedStory(createdStory),
              error: (err) => this.handleStoryError('Creation', err)
            });
          }

          private handleStoryError(operation: string, err: any): void {
            console.error(`${operation} failed:`, err);
            // Consider adding user feedback here (e.g., snackbar/toast)
            // Consider implementing retry logic for specific error cases
          }

          refreshStories(): void {
            this.storyService.getStories().subscribe();
          }

          private handleCreatedStory(createdStory: Story): void {
              this.refreshStories();
              console.log(this.stories());
              this.filterStories();
            }
}