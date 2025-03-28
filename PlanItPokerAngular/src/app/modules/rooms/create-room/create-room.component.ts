import { ChangeDetectionStrategy, Component, inject, model, OnInit, signal } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';

import { Room } from '../../../shared/models/room.model';
import { CardType, RoomCardConfig } from '../../../shared/types/card-type';
import { CardSetService } from '../../../core/services/card-set.service';
import { SaveConfigDialogComponent } from './save-config-dialog.components';
import { MatExpansionModule } from '@angular/material/expansion';

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
export class CreateRoomComponent implements OnInit {
  private dialog = inject(MatDialog);
  private cardSetService = inject(CardSetService);
  protected dialogRef = inject(MatDialogRef<CreateRoomComponent>);
  protected initialData = inject<Partial<Room>>(MAT_DIALOG_DATA);

  roomData = model<Room>({
    id: undefined,
    name: '',
    cardType: 'fibonacci',
    customCards: [],
    createdAt: new Date(),
    ...this.initialData
  });

  protected readonly cardTypeLabels = {
    scrum: 'Scrum',
    fibonacci: 'Fibonacci',
    hours: 'Working Hours',
    custom: 'Custom Cards'
  };

  protected editingCards = signal<(number | string)[]>([]);
  protected availableConfigs = signal<RoomCardConfig[]>([]);
  protected selectedConfig = signal<RoomCardConfig | null>(null);
  protected isCustomMode = signal(false);
  protected showCustomization = signal(false);
  protected customizationExpanded = signal(false);
  protected showCustomizationPanel = signal(false);


  protected getCardLabel(type: CardType): string {
    return this.cardTypeLabels[type];
  }

  ngOnInit(): void {
    this.initializeConfigs();
    this.initializeEditingState();
  }

  private initializeConfigs(): void {
    this.availableConfigs.set([
      ...this.cardSetService.getPredefinedConfigs(),
      ...this.cardSetService.getCustomConfigs(),
      { type: 'custom', cards: [] }
    ]);
  }

  private initializeEditingState(): void {
    const currentType = this.roomData().cardType;
    const config = this.cardSetService.getConfigByType(currentType);
    
    if (currentType === 'custom') {
      this.isCustomMode.set(true);
      this.editingCards.set([...this.roomData().customCards]);
    } else if (config) {
      this.selectedConfig.set(config);
      this.editingCards.set([...config.cards]);
    }
  }

  protected onConfigChange(config: RoomCardConfig): void {
    this.selectedConfig.set(config);
    this.isCustomMode.set(config.type === 'custom');
    this.showCustomizationPanel.set(config.type !== 'custom');
    this.customizationExpanded.set(false);
    this.editingCards.set([...config.cards]);
  }
  

  protected toggleCustomization(): void {
    this.showCustomization.update(v => !v);
    if (!this.showCustomization()) {
      this.resetToOriginal();
    }
  }

  private resetToOriginal(): void {
    const original = this.cardSetService.getConfigByType(
      this.selectedConfig()?.type || 'fibonacci'
    );
    this.editingCards.set(original?.cards || []);
  }

  protected addCard(): void {
    this.editingCards.update(cards => [...cards, '']);
  }

  protected removeCard(index: number): void {
    this.editingCards.update(cards => cards.filter((_, i) => i !== index));
  }

  protected parseCardValue(value: string): number | string {
    const num = Number(value);
    return isNaN(num) ? value : num;
  }

  protected saveAsNewConfig(): void {
    const dialogRef = this.dialog.open(SaveConfigDialogComponent);
    dialogRef.afterClosed().subscribe(name => {
      if (name) {
        const newConfig: RoomCardConfig = {
          type: uuidv4() as CardType,
          cards: this.editingCards().map(c => 
            typeof c === 'string' ? this.parseCardValue(c) : c
          )
        };
        this.cardSetService.addCustomConfig(newConfig);
        this.initializeConfigs();
        this.selectedConfig.set(newConfig);
        this.showCustomization.set(false);
      }
    });
  }

  protected get isFormValid(): boolean {
    const baseValid = this.roomData().name.trim().length >= 3;
    
    if (this.customizationExpanded()) {
      return baseValid && this.editingCards().length > 0;
    }
    
    return baseValid;
  }

  protected submit(): void {
    const result: Room = {
      ...this.roomData(),
      id: this.roomData().id || uuidv4(),
      createdAt: new Date(),
      cardType: this.showCustomization() ? 'custom' : this.selectedConfig()?.type || 'fibonacci',
      customCards: this.showCustomization() || this.isCustomMode()
        ? this.editingCards().map(c => typeof c === 'string' ? this.parseCardValue(c) : c)
        : []
    };

    this.dialogRef.close(result);
  }

  protected closeDialog(): void {
    this.showCustomization.set(false);
    this.dialogRef.close();
  }
}