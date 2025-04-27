import { ChangeDetectionStrategy, Component, inject, input, model, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { Story, StoryStatus } from '../../../shared/models/story';
import { v4 as uuidv4 } from 'uuid';
import { StoryDTO } from '../../../shared/models/wbs';
import { ConnectionStateService } from '../../../core/services/connection-state.service';
import { StoryStateService } from '../../../core/services/story-state.service';
import { WebSocketMessageService } from '../../../core/services/web-socket-message.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PlayerStateService } from '../../../core/services/player-state.service';

@Component({
  selector: 'app-story-details-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './story-details-dialog.component.html',
  styleUrls: ['./story-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryDetailsDialogComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<StoryDetailsDialogComponent>);
  protected initialData = input<Partial<StoryDTO>>(inject(MAT_DIALOG_DATA));

  private connectionState = inject(ConnectionStateService);
  protected storyState = inject(StoryStateService);
  private wsMessageService = inject(WebSocketMessageService);
  private playerState = inject(PlayerStateService);

  protected _loading = this.connectionState.loading;
  protected _viewedSession = this.storyState.viewedSession;
  protected _players = this.playerState.players;

  // Get dialog mode based on initial data and status
  get mode(): 'create' | 'edit' | 'view' {
    const data = this.initialData();
    if (!data?.id) return 'create';
    if (data.status === StoryStatus.COMPLETED) return 'view';
    return 'edit';
  }

  // Story data model with defaults if not provided
  storyData = model<StoryDTO>({
    id: this.initialData()?.id || ' ',
    name: '',
    finalResult: null,
    status: this.initialData()?.status || StoryStatus.ACTIVE,
    ...this.initialData()
  });

  constructor() { }

  ngOnInit() {
    const storyId = this.initialData()?.id;
    const status = this.initialData()?.status;
    if (storyId && status == StoryStatus.COMPLETED) {
      // Set loading state before sending the request
      this.connectionState.setLoading(true);
      this.wsMessageService.getStoryWithSession(storyId); 
    } else {
      console.error('No valid story ID found');
    }
  }

  getPlayerName(userId: string): string {
    const players = this._players(); // obținem lista actuală de jucători
    const player = players.find(p => p.userId === userId);
    return player ? player.name : 'Unknown Player';
  }

  protected isValidForm(): boolean {
    const { name } = this.storyData();
    return (this.mode !== 'view') && name.trim().length >= 3;
  }

  // Check if the component is in edit mode (story has an ID)
  get isEditMode(): boolean {
    return !!this.initialData()?.id;
  }

  // Check if the component is in view mode (status is completed)
  get isViewMode(): boolean {
    return this.mode === 'view';
  }

  // Loading state from the connection state service
  get isLoading(): boolean {
    return this._loading();
  }

  // Return true if form is visible (not loading and not in view mode)
  get isFormVisible(): boolean {
    return !this.isLoading && !this.isViewMode;
  }

  // Handle form submission (return updated story)
  protected submit(): void {
    const story: StoryDTO = {
      ...this.storyData(),
    };
    console.log("submit " + story.name); 
    this.dialogRef.close(story);
  }

  // Close the dialog without submitting
  protected closeDialog(): void {
    this.dialogRef.close();
  }
}
