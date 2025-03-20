import {ChangeDetectionStrategy, Component, EventEmitter, inject, model, Output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { NgFor, CommonModule } from '@angular/common'; 
import { CreateRoomComponent } from '../create-room/create-room.component';
import { RoomsService } from '../../../core/services/rooms.service';
import { Room } from '../../../shared/models/room.model';
import { RoomsListComponent } from '../rooms-list/rooms-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-rooms-page',
  standalone: true,
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, CommonModule, RoomsListComponent, MatProgressSpinnerModule],
  templateUrl: './rooms-page.component.html',
  styleUrl: './rooms-page.component.scss'
})
export class RoomsPageComponent {
  readonly roomData = model<Room>({
      name: '',
      cardType: 'scrum',
    })
  
    rooms = signal<Room[]>([]);
    isLoading = signal(true);
  
    readonly dialog = inject(MatDialog);
  
    constructor(private router: Router, private roomsService: RoomsService) {
      this.loadRooms();
    }
  
    private loadRooms() {
      this.roomsService.getRooms().subscribe({
        next: (rooms) => {
          this.rooms.set(rooms);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Error loading rooms:', err);
          this.isLoading.set(false);
        }
      });
    }

    deleteRoom(roomId: string) {
      this.roomsService.deleteRoom(roomId).subscribe({
        next: () => {
          this.rooms.update(rooms => rooms.filter(r => r.id !== roomId));
        },
        error: (err) => console.error('Delete failed:', err)
      });
    }
  
    openDialog(): void {
      const dialogRef = this.dialog.open(CreateRoomComponent, {
        data: this.roomData()
      });
  
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed');
        
        if (result !== undefined) {
          this.roomData.set(result);
        }
      });
    }
}
