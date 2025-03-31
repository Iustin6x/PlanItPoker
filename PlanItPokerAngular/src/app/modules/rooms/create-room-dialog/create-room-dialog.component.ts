import { ChangeDetectionStrategy, Component, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import { UUID } from 'crypto';

import { UserService } from '../../../core/services/user.service';
import { Room, RoomDialogDTO } from '../../../shared/models/room';
import { CardType, CardValue, PREDEFINED_CARD_SETS } from '../../../shared/types';

@Component({
  selector: 'app-create-room-dialog',
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
    MatExpansionModule,
  ],
  templateUrl: './create-room-dialog.component.html',
  styleUrls: ['./create-room-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRoomDialogComponent {
  protected dialogRef = inject(MatDialogRef<CreateRoomDialogComponent>);
  protected initialData = input<Partial<RoomDialogDTO>>(inject(MAT_DIALOG_DATA));

  roomData = model<RoomDialogDTO>({
    name: '',
    cardType: CardType.FIBONACCI, // Use enum value
    cards: PREDEFINED_CARD_SETS[CardType.FIBONACCI],
    ...this.initialData()
  });
  
  protected readonly cardTypeLabels = {
    [CardType.SEQUENTIAL]: 'Scrum',
    [CardType.FIBONACCI]: 'Fibonacci',
    [CardType.HOURS]: 'Working Hours',
    [CardType.CUSTOM]: 'Custom Cards'
  };

  protected editingCards = signal<CardValue[]>([]);
  protected availableConfigs = signal<CardType[]>(Object.keys(PREDEFINED_CARD_SETS) as CardType[]);
  protected showCustomizationPanel = signal(false);

  constructor() {
    this.initializeEditingState();
  }

  private initializeEditingState(): void {
    const currentType = this.roomData().cardType;
    if (currentType === 'custom') {
      this.editingCards.set([...this.roomData().cards]);
    } else {
      this.editingCards.set([...PREDEFINED_CARD_SETS[currentType]]);
    }
  }

  protected onCardTypeChange(newType: CardType): void {
    this.roomData.update(data => ({
      ...data,
      cardType: newType,
      cards: newType === 'custom' ? this.editingCards() : PREDEFINED_CARD_SETS[newType as Exclude<CardType, 'custom'>]
    }));
    
    if (newType !== 'custom') {
      this.editingCards.set([...PREDEFINED_CARD_SETS[newType as Exclude<CardType, 'custom'>]]);
      this.showCustomizationPanel.set(false);
    }
  }

  protected addCard(): void {
    this.editingCards.update(cards => [...cards, '?']);
  }

  protected removeCard(index: number): void {
    this.editingCards.update(cards => cards.filter((_, i) => i !== index));
  }

  protected updateCardValue(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    let cardValue: CardValue = value === '?' ? '?' : Number(value);
    
    if (value === '?' || !isNaN(Number(value))) {
      this.editingCards.update(cards => 
        cards.map((c, i) => i === index ? cardValue : c)
      );
    }
  }

  protected get isValidForm(): boolean {
    const { name, cardType } = this.roomData();
    const validName = name.trim().length >= 3;
    const validCards = cardType !== 'custom' || this.editingCards().length > 0;
    return validName && validCards;
  }

  get isEditMode(): boolean {
    return !!this.initialData()?.id;
  }

  protected submit(): void {
    const room: RoomDialogDTO = {
      ...this.roomData(),
      cards: this.roomData().cardType === 'custom' 
        ? this.editingCards() 
        : PREDEFINED_CARD_SETS[this.roomData().cardType as Exclude<CardType, 'custom'>]
    };

    this.dialogRef.close(room);
  }

  protected closeDialog(): void {
    this.dialogRef.close();
  }
}