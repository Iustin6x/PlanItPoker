import { ChangeDetectionStrategy, Component, inject, model, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-room-settings-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatExpansionModule,
    MatCheckboxModule
  ],
  templateUrl: './room-settings-dialog.component.html',
  styleUrls: ['./room-settings-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomSettingsDialogComponent {
  protected dialogRef = inject(MatDialogRef<RoomSettingsDialogComponent>);
  protected initialData = inject(MAT_DIALOG_DATA) as { allowQuestionMark?: boolean; allowVoteModification?: boolean };

  allowQuestionMark = false;
  allowVoteModification = false;

  constructor() {
    this.allowQuestionMark = this.initialData?.allowQuestionMark ?? false;
    this.allowVoteModification = this.initialData?.allowVoteModification ?? false;
  }

  onSave(): void {
    this.dialogRef.close({
      allowQuestionMark: this.allowQuestionMark,
      allowVoteModification: this.allowVoteModification
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
