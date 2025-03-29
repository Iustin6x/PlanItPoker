import { ChangeDetectionStrategy, Component, inject, input, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';

import { CardSetService } from '../../../core/services/card-set.service';
import { UserService } from '../../../core/services/user.service';
import { Room, RoomStatus } from '../../../shared/models/room';
import { CARD_SETS, CardType, generateUUID } from '../../../shared/types';
import { SaveConfigDialogComponent } from './save-config-dialog.components';


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
    MatExpansionModule,
  ],
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateRoomComponent {
  private dialog = inject(MatDialog);
  private cardSetService = inject(CardSetService);
  private userService = inject(UserService);
  protected dialogRef = inject(MatDialogRef<CreateRoomComponent>);
  protected initialData = input<Partial<Room>>(inject(MAT_DIALOG_DATA));

  roomData = model<Room>({
    id: generateUUID(),
    name: '',
    cardType: 'fibonacci' as CardType,
    customCards: [],
    adminIds: [this.userService.currentUserId],
    participants: [this.userService.currentUserId],
    votingSessions: [],
    status: RoomStatus.ACTIVE,
    settings: {
      requireAuth: false,
      allowSpectators: true,
      maxParticipants: 20,
      votingTimeLimit: 300,
      allowRevotes: true,
      hideResultsUntilEnd: false
    },
    createdAt: new Date(),
    updatedAt: new Date(),
    ...this.initialData
  });

  protected readonly cardTypeLabels: Record<CardType, string> = {
    sequential: 'Scrum',
    fibonacci: 'Fibonacci',
    hours: 'Working Hours',
    custom: 'Custom Cards'
  };

  protected editingCards = signal<(number | '?')[]>([]);
  protected availableConfigs = signal<CardType[]>([]);
  protected showCustomizationPanel = signal(false);

  constructor() {
    this.initializeConfigs();
    this.initializeEditingState();
  }

  private initializeConfigs(): void {
    this.availableConfigs.set(Object.keys(CARD_SETS) as CardType[]);
  }

  private initializeEditingState(): void {
    const currentType = this.roomData().cardType;
    if (currentType === 'custom') {
      this.editingCards.set([...(this.roomData().customCards ?? [])]);
    } else {
      this.editingCards.set([...CARD_SETS[currentType]]);
    }
  }

  protected onCardTypeChange(newType: CardType): void {
    this.roomData.update(data => ({
      ...data,
      cardType: newType,
      customCards: newType === 'custom' ? this.editingCards() : []
    }));
    
    if (newType !== 'custom') {
      this.editingCards.set([...CARD_SETS[newType]]);
      this.showCustomizationPanel.set(false);
    }
  }

  protected toggleCustomization(): void {
    this.showCustomizationPanel.update(v => !v);
  }

  protected addCard(): void {
    this.editingCards.update(cards => [...cards, '?']);
  }

  protected removeCard(index: number): void {
    this.editingCards.update(cards => cards.filter((_, i) => i !== index));
  }

  protected updateCardValue(index: number, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    const numericValue = value === '?' ? '?' : Number(value);
    this.editingCards.update(cards => 
      cards.map((c, i) => i === index ? numericValue : c)
    );
  }

  protected saveCustomConfig(): void {
    const dialogRef = this.dialog.open(SaveConfigDialogComponent);
    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        this.cardSetService.addCustomConfig({
          name,
          cards: this.editingCards()
        });
      }
    });
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
    const room: Room = {
      ...this.roomData(),
      updatedAt: new Date(),
      customCards: this.roomData().cardType === 'custom' 
        ? this.editingCards() ?? []
        : []
    };

    this.dialogRef.close(room);
  }

  protected closeDialog(): void {
    this.dialogRef.close();
  }
}