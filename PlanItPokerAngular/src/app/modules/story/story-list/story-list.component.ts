import { Component, OnInit } from '@angular/core';
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
  stories: Story[] = [
    { id: 'd8a12f04-3c5b-4d7e-8f6a-1c3b9d7e8f6c' as UUID, roomId: 'd8a12f04-3c5b-4d7e-8f6a-1c3b9d7e8f6c' as UUID, title: 'Story 1', status: StoryStatus.ACTIVE, sessions: [] },
    { id: 'd8a12f04-3c5b-4d7e-8f6a-1c3b9d7e9f6c' as UUID, roomId: 'd8a12f04-3c5b-4d7e-8f6a-1c3b9d7e8f6c' as UUID, title: 'Story 2', status: StoryStatus.COMPLETED, sessions: [] },
    { id: 'd8a12f04-3c5b-4d7e-8f6a-1c3b9d7e6f6c' as UUID, roomId: 'd8a12f04-3c5b-4d7e-8f6a-1c3b9d7e8f6c' as UUID, title: 'Story 3', status: StoryStatus.SKIPPED, sessions: [] }
  ];
  filteredStories: Story[] = [];
  selectedTab = 0;

  get activeStories() {
    return this.stories.filter(s => s.status === StoryStatus.ACTIVE);
  }
  
  get completedStories() {
    return this.stories.filter(s => s.status === StoryStatus.COMPLETED);
  }
  
  get allStories() {
    return this.stories;
  }

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.filterStories();
  }

  filterStories() {
    switch (this.selectedTab) {
      case 0:
        this.filteredStories = this.stories.filter(s => s.status === StoryStatus.ACTIVE);
        break;
      case 1:
        this.filteredStories = this.stories.filter(s => s.status === StoryStatus.COMPLETED);
        break;
      case 2:
        this.filteredStories = [...this.stories];
        break;
    }
  }

  openStoryDialog(story?: Story) {
    this.dialog.open(StoryDetailsDialogComponent, {
      width: '400px',
      data: story ? { story, isEdit: true } : { isEdit: false }
    });
  }

  openAddStoryDialog() {
    const dialogRef = this.dialog.open(StoryDetailsDialogComponent, {
      width: '400px',
      data: { isEdit: false }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Assuming the result contains the new story data, you can push it to the stories array
        this.stories.push(result);
        this.filterStories(); // Update the filtered stories
      }
    });
  }

  
}