import { ChangeDetectionStrategy, Component, inject, input, model, signal } from '@angular/core';
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
import { CardValue } from '../../../shared/types';

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


  storyData = model<Story>({
    id: this.initialData()?.id || uuidv4() as UUID,
    name: '',
    roomId: this.initialData()?.roomId || '' as UUID,
    status: this.initialData()?.status || StoryStatus.ACTIVE,
    session: this.initialData()?.session || {
      storyId: this.initialData()?.id || uuidv4() as UUID,
      roomId: this.initialData()?.roomId || '' as UUID,
      startTime: new Date(),
      status: 'PENDING',
      votes: {} as Record<UUID, CardValue>,
      revealed: false
    },
    ...this.initialData()
  });




  constructor() {}

  protected isValidForm(): boolean {
    const { name } = this.storyData();
    return name.trim().length >= 3;
  }

  get isEditMode(): boolean {
    return !!this.initialData()?.id;
  }

  protected submit(): void {
   
    const story: Story = {
      ...this.storyData(),
    };
    console.log("submit"+story.name);

    this.dialogRef.close(story);
  }

  protected closeDialog(): void {
    this.dialogRef.close();
  }
}