import {ChangeDetectionStrategy, Component, inject, model, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { CardType } from '../../../shared/types/card-type';
import { Room } from '../../../shared/models/room.model';
import { MatDialogModule } from '@angular/material/dialog';


@Component({
    selector: 'app-create-room',
    standalone: true,
    imports: [
      CommonModule,
      MatFormFieldModule,
      MatInputModule,
      MatSelectModule,
      FormsModule,
      MatButtonModule,
      MatDialogTitle,
      MatDialogContent,
      MatDialogActions,
      MatDialogModule,
    ],
    templateUrl: './create-room.component.html',
    styleUrl: './create-room.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRoomComponent {
  protected readonly dialogRef = inject(MatDialogRef<CreateRoomComponent>);
  protected readonly initialData = inject<Room>(MAT_DIALOG_DATA);

  roomData = model<Room>(this.initialData);

  protected readonly cardTypes: readonly CardType[] = ['scrum', 'fibonacci', 'hours'] as const;
  protected readonly cardTypeLabels: Record<CardType, string> = {
    scrum: 'Scrum',
    fibonacci: 'Fibonacci Sequence',
    hours: 'Working Hours'
  };

  protected getCardLabel(type: CardType): string {
    return this.cardTypeLabels[type];
  }

  protected get isNameValid(): boolean {
    return this.roomData().name?.trim().length >= 3;
  }

  protected closeDialog(): void {
    this.dialogRef.close(null);
  }

  protected submit(): void {
    if (this.isFormValid) {
      this.dialogRef.close(this.roomData());
    }
  }

  protected get isFormValid(): boolean {
    return this.isNameValid && !!this.roomData().cardType;
  }
}
