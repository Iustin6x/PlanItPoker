import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Room } from '../../../shared/models/room.model';
import { NgFor } from '@angular/common';
import { RoomItemComponent } from '../room-item/room-item.component';


@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [NgFor, RoomItemComponent],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.scss'
})
export class RoomsListComponent {
  @Input({ required: true }) rooms: Room[] = [];
  @Output() delete = new EventEmitter<string>();

  handleDelete(roomId: string) {
    this.delete.emit(roomId); // Retransmitere ID către părinte
  }

}
