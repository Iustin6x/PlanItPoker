import { ChangeDetectionStrategy, Component, computed, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { CardType, CardValue, PREDEFINED_CARD_SETS } from '../../../shared/types';
import { RoomListDTO, RoomRequestDTO } from '../../../shared/models/room';
import { MatCheckboxModule } from '@angular/material/checkbox';

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
    MatCheckboxModule
  ],
  templateUrl: './create-room-dialog.component.html',
  styleUrls: ['./create-room-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRoomDialogComponent {
  protected dialogRef = inject(MatDialogRef<CreateRoomDialogComponent>);
  protected initialData = input<Partial<RoomRequestDTO>>(inject(MAT_DIALOG_DATA));

  roomData = model<RoomRequestDTO>({
    name: '',
    cardType: CardType.FIBONACCI,
    cards: PREDEFINED_CARD_SETS[CardType.FIBONACCI],
    roomSettings: { allowQuestionMark: true, allowVoteModification: true },
    ...this.initialData()
  });
  
  protected readonly cardTypeLabels = {
    [CardType.SEQUENTIAL]: 'Scrum',
    [CardType.FIBONACCI]: 'Fibonacci',
    [CardType.HOURS]: 'Working Hours',
    [CardType.CUSTOM]: 'Custom Cards'
  };

  isEditMode = computed(()=>!!this.roomData().id);

  protected editingCards = signal<CardValue[]>([]);
  protected availableConfigs = signal<CardType[]>([
    ...Object.keys(PREDEFINED_CARD_SETS) as CardType[],
    CardType.CUSTOM 
  ]);
  protected showCustomizationPanel = signal(false);

  constructor() {
    this.initializeEditingState();
  }

  private initializeEditingState(): void {
    const currentType = this.roomData().cardType;
    if (this.isEditMode()) {
      this.editingCards.set([...this.roomData().cards]); 
    } else {
      if (currentType === 'CUSTOM') {
        this.editingCards.set([...this.roomData().cards]);
      } else {
        this.editingCards.set([...PREDEFINED_CARD_SETS[currentType]]);
      }
    }
  }

  protected onCardTypeChange(newType: CardType): void {
    this.roomData.update(data => ({
      ...data,
      cardType: newType,
      cards: newType === CardType.CUSTOM 
        ? this.editingCards()  
        : PREDEFINED_CARD_SETS[newType as Exclude<CardType, 'CUSTOM'>] 
    }));
  
    if (newType !== CardType.CUSTOM) {
      this.editingCards.set([...PREDEFINED_CARD_SETS[newType as Exclude<CardType, 'CUSTOM'>]]);
      this.showCustomizationPanel.set(false);
    }
  }

  protected addCard(): void {
    const newCards = [...this.editingCards(), '?']; 
    this.editingCards.set(newCards); 
    this.roomData.update(data => ({
      ...data,
      cards: newCards 
    }));
  }

  protected trackByCard(index: number, card: CardValue): number {
    return index;
  }

  protected removeCard(index: number): void {
    this.editingCards.update(cards => cards.filter((_, i) => i !== index));
  }

  protected updateCardValue(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    let cardValue: CardValue = value === '?' ? '?' : Number(value);
  
    if (value === '?' || !isNaN(Number(value))) {
      const newCards = [...this.editingCards()];  
      newCards[index] = cardValue;  
  
      this.editingCards.set(newCards);  
      this.roomData.update(data => ({
        ...data,
        cardType: CardType.CUSTOM,
        cards: newCards
      }));
    }
  }

  protected get isValidForm(): boolean {
    const { name, cardType } = this.roomData();
    const validName = name.trim().length >= 3;
    const validCards = cardType !== 'CUSTOM' || this.editingCards().length > 0;
    return validName && validCards;
  }


  protected submit(): void {
    const room: RoomRequestDTO = {
      ...this.roomData(),
      cards: this.roomData().cardType === CardType.CUSTOM
        ? this.editingCards()  
        : PREDEFINED_CARD_SETS[this.roomData().cardType as Exclude<CardType, 'CUSTOM'>]
    };
  
    this.dialogRef.close(room); // Închide dialogul și trimite datele
  }

  protected closeDialog(): void {
    this.dialogRef.close();
  }
}