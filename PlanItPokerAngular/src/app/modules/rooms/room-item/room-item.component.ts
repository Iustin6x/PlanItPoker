import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Room } from '../../../shared/models/room.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-room-item',
  standalone: true,
  imports: [MatIconModule, DatePipe],
  templateUrl: './room-item.component.html',
  styleUrl: './room-item.component.scss'
})
export class RoomItemComponent {
  @Input({ required: true }) room!: Room;
  @Output() delete = new EventEmitter<string>();

  onDelete() {
    this.delete.emit(this.room.id);
  }
}
