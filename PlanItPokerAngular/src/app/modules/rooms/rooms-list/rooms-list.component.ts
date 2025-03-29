import { 
  Component, Input, Output, EventEmitter, ChangeDetectionStrategy 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Room } from '../../../shared/models/room/room.model';
import { RoomStatus } from '../../../shared/models/room/room-status.enum';
import { UUID } from '../../../shared/types';
import { MatTableModule } from '@angular/material/table';
import { MatHeaderCellDef, MatCellDef, MatRowDef, MatHeaderRowDef, MatRow } from '@angular/material/table';
import { CardType } from '../../../shared/types';


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



  displayedColumns: string[] = ['name', 'status', 'created', 'participants', 'type', 'actions'];

  

  readonly RoomStatus = RoomStatus;
  readonly cardTypeLabels: Record<Room['cardType'], string> = {
    sequential: 'Scrum',
    fibonacci: 'Fibonacci',
    hours: 'Working Hours',
    custom: 'Custom Cards'
  };

  getStatusColor(status: RoomStatus): string {
    const statusColors = {
      [RoomStatus.ACTIVE]: '#4CAF50',
      [RoomStatus.PAUSED]: '#FFC107',
      [RoomStatus.CLOSED]: '#F44336'
    };
    return statusColors[status];
  }

  trackByRoomId(index: number, room: Room): UUID {
    return room.id;
  }
}