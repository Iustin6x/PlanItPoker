// rooms-list.component.ts
import { 
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Material Modules
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';

import { CardType, isUUID, UUID } from '../../../shared/types';
import { Room, RoomDialogDTO } from '../../../shared/models/room';



@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTableModule,
  ],
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomsListComponent {
  @Input() rooms: Room[] = [];
  @Input() isLoading = false;
  @Output() delete = new EventEmitter<UUID>();
  @Output() edit = new EventEmitter<RoomDialogDTO>();

  
  displayedColumns: string[] = 
    ['name', 'createdAt', 'players', 'cardType', 'actions'];
  
  readonly CardType = CardType;

  cardTypeLabels: Record<CardType, string> = {
    [CardType.SEQUENTIAL]: 'Secvențial',
    [CardType.FIBONACCI]: 'Fibonacci',
    [CardType.HOURS]: 'Ore', // Adaugă eticheta pentru HOURS
    [CardType.CUSTOM]: 'Personalizat'
  };

  getCardLabel(cardType: string): string {
    return this.cardTypeLabels[cardType as CardType] || 'Necunoscut';
  }

  trackByRoomId(index: number, room: Room): string {
    return room.id;
  }

  handleDelete(roomId: UUID): void {
    this.delete.emit(roomId);
  }

  handleEdit(room: Room): void {
    const dto: RoomDialogDTO = {
      id: room.id,
      name: room.name,
      cardType: room.cardType,
      cards: room.cards // Verifică dacă această proprietate există în Room
    };
    this.edit.emit(dto);
  }


  copyInviteLink(link: string): void {
    navigator.clipboard.writeText(link);
  }
}