// rooms-list.component.ts
import { 
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy, 
  OnInit,
  inject
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

import { interval, Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { RoomListDTO } from '../../../shared/models/room';


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
  providers:[DatePipe],
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomsListComponent{
  @Input() rooms: RoomListDTO[] = [];
  @Input() isLoading = false;
  @Output() delete = new EventEmitter<string>();
  @Output() select = new EventEmitter<string>();
  @Output() edit = new EventEmitter<RoomListDTO>();
  @Output() leave = new EventEmitter<string>(); // New leave event

  private datePipe = inject(DatePipe);

  displayedColumns: string[] = 
    ['name', 'lastVotedStory', 'totalPoints', 'lastAction', 'actions'];
  
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

  trackByRoomId(index: number, room: RoomListDTO): string {
    return room.id!; // Assuming id is present for tracked rooms
  }

  handleDelete(roomId: string): void {
    this.delete.emit(roomId);
  }

  handleSelect(room: RoomListDTO): void {
    if (room.id) {
      this.select.emit(room.id);
    } else {
      console.error('Invalid room ID:', room.id);
    }
  }

  handleEdit(room: RoomListDTO): void {
    this.edit.emit(room); // Emit the RoomListDTO directly
  }

  handleLeave(roomId: string): void {
    this.leave.emit(roomId); // Emit leave event
  }

  copyInviteLink(link: string): void {
    navigator.clipboard.writeText(link);
  }
}