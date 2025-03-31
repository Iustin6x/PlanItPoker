import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
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
import { UUID } from 'crypto';

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
    MatIconModule
  ],
  templateUrl: './story-details-dialog.component.html',
  styleUrls: ['./story-details-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StoryDetailsDialogComponent {
  private dialogRef = inject(MatDialogRef<StoryDetailsDialogComponent>);
  protected initialData = input<Partial<Story>>(inject(MAT_DIALOG_DATA));

  storyData = signal<Story>({
    id: uuidv4() as UUID,
    roomId: uuidv4() as UUID,
    title: this.initialData()?.title || '',
    status: StoryStatus.ACTIVE,
    sessions: this.initialData()?.sessions || [],
    currentSessionId: this.initialData()?.currentSessionId,
    finalResult: this.initialData()?.finalResult,
    ...this.initialData()
  });

  protected readonly statusLabels = {
    [StoryStatus.ACTIVE]: 'Active',
    [StoryStatus.COMPLETED]: 'Completed',
    [StoryStatus.SKIPPED]: 'Skipped',
  };

  protected availableStatuses = signal<StoryStatus[]>(Object.values(StoryStatus));

  constructor() {}

  protected isValidForm(): boolean {
    const { title } = this.storyData();
    return title.trim().length >= 3;
  }

  get isEditMode(): boolean {
    return !!this.initialData()?.id;
  }

  updateTitle(newTitle: string): void {
    this.storyData.update(data => ({ ...data, title: newTitle }));
  }

  protected submit(): void {
    const story: Story = {
      ...this.storyData(),
    };

    this.dialogRef.close(story);
  }

  protected closeDialog(): void {
    this.dialogRef.close();
  }
}