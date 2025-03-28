import { ChangeDetectionStrategy, Component, inject, model } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CardType, CARD_SETS } from '../../../shared/types/card-type';
import { Room } from '../../../shared/models/room.model';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-create-room',
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

  ],
  templateUrl: './create-room.component.html',
  styleUrl: './create-room.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRoomComponent {
  protected dialogRef = inject(MatDialogRef<CreateRoomComponent>);
  protected initialData = inject<Partial<Room>>(MAT_DIALOG_DATA);

  roomData = model<Room>({
    id: undefined,
    name: '',
    cardType: 'fibonacci' as CardType,
    customCards: [],
    createdAt: new Date(),
    ...this.initialData
  });

  protected readonly cardTypes: CardType[] = ['fibonacci', 'scrum', 'hours', 'custom'];
  protected readonly cardTypeLabels: Record<CardType, string> = {
    fibonacci: 'Fibonacci',
    scrum: 'Scrum',
    hours: 'Working Hours',
    custom: 'Custom Cards'
  };


  protected addCustomCard(): void {
    this.roomData.update(current => ({
      ...current,
      customCards: [...current.customCards, '']
    }));
  }

  protected removeCustomCard(index: number): void {
    this.roomData.update(current => ({
      ...current,
      customCards: current.customCards.filter((_, i) => i !== index)
    }));
  }

  protected onCardTypeChange(): void {
    this.roomData.update(current => ({
      ...current,
      customCards: current.cardType === 'custom' ? current.customCards : []
    }));
  }

  protected get isFormValid(): boolean {
    const data = this.roomData();
    return this.isNameValid(data) && this.isCardTypeValid(data);
  }

  private isNameValid(data: Room): boolean {
    return data.name.trim().length >= 3;
  }

  private isCardTypeValid(data: Room): boolean {
    if (data.cardType !== 'custom') return true;
    return data.customCards.length > 0 && 
           data.customCards.every(c => c.trim() !== '');
  }

  protected submit(): void {
    if (!this.isFormValid) return;

    const result: Room = {
      ...this.roomData(),
      id: this.roomData().id || this.generateId(),
      createdAt: new Date(),
      customCards: this.processCustomCards()
    };

    this.dialogRef.close(result);
  }

  private processCustomCards(): string[] {
    return this.roomData().cardType === 'custom'
      ? this.roomData().customCards.map(c => c.trim()).filter(c => c !== '')
      : [];
  }

  private generateId(): string {
    return Date.now().toString();
  }

  protected closeDialog(): void {
    this.dialogRef.close();
  }

  protected getCardLabel(type: CardType): string {
    return this.cardTypeLabels[type];
  }
}