import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Room } from '../../../shared/models/room.model';
import { MatTableModule} from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule} from '@angular/common';


@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [
    MatTableModule, 
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
  ],
  templateUrl: './rooms-list.component.html',
  styleUrl: './rooms-list.component.scss'
})
export class RoomsListComponent {
  @Input() rooms: Room[] = []
  @Output() delete = new EventEmitter<string>();

  displayedColumns: string[] = ['name', 'cardType', 'actions'];
  isLoading = false;

  onDelete(roomId: string) {
    this.delete.emit(roomId);
  }

}
