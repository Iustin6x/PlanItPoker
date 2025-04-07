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
import { RoomDialogDTO } from '../../../shared/models/room';


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
  @Input() rooms: RoomDialogDTO[] = [];
  @Input() isLoading = false;
  @Output() delete = new EventEmitter<UUID>();
  @Output() select = new EventEmitter<UUID>();
  @Output() edit = new EventEmitter<RoomDialogDTO>();
  @Output() leave = new EventEmitter<UUID>(); // New leave event

  displayedColumns: string[] = 
    ['name', 'lastVotedStory', 'totalPoints', 'actions'];
  
  readonly CardType = CardType;

  cardTypeLabels: Record<CardType, string> = {
    [CardType.SEQUENTIAL]: 'Secvențial',
    [CardType.FIBONACCI]: 'Fibonacci',
    [CardType.HOURS]: 'Ore',
    [CardType.CUSTOM]: 'Personalizat'
  };

  getCardLabel(cardType: string): string {
    return this.cardTypeLabels[cardType as CardType] || 'Necunoscut';
  }

  trackByRoomId(index: number, room: RoomDialogDTO): string {
    return room.id!; // Assuming id is present for tracked rooms
  }

  handleDelete(roomId: UUID): void {
    this.delete.emit(roomId);
  }

  handleSelect(room: RoomDialogDTO): void {
    this.select.emit(room.id!);
  }

  handleEdit(room: RoomDialogDTO): void {
    this.edit.emit(room); // Emit the RoomDialogDTO directly
  }

  handleLeave(roomId: UUID): void {
    this.leave.emit(roomId); // Emit leave event
  }

  copyInviteLink(link: string): void {
    navigator.clipboard.writeText(link);
  }
}