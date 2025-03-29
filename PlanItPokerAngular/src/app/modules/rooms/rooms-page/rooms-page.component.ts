import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreateRoomComponent } from '../create-room/create-room.component';
import { RoomsService } from '../../../core/services/rooms.service';
import { Room } from '../../../shared/models/room/room.model';
import { RoomsListComponent } from '../rooms-list/rooms-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { filter } from 'rxjs/operators';
import { UUID } from '../../../shared/types';

@Component({
  selector: 'app-rooms-page',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    CommonModule,
    RoomsListComponent,
    MatProgressSpinnerModule,
    MatIconModule
  ],
  templateUrl: './rooms-page.component.html',
  styleUrls: ['./rooms-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomsPageComponent {
  private roomsService = inject(RoomsService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  // Expozare directă a signal-urilor din serviciu
  rooms = this.roomsService.rooms;
  isLoading = this.roomsService.loading;

  // rooms-page.component.ts
  protected handleDeleteRoom(roomId: UUID): void {
    this.roomsService.deleteRoom(roomId).subscribe();
  }


  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateRoomComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(filter(Boolean)) // Ignoră rezultatele nule
      .subscribe((newRoomData: Omit<Room, 'id' | 'createdAt' | 'updatedAt'>) => {
        this.roomsService.createRoom(newRoomData).subscribe({
          next: (createdRoom) => this.navigateToRoom(createdRoom.id),
          error: (err) => console.error('Create room failed:', err)
        });
      });
  }

  navigateToRoom(roomId: UUID): void {
    this.router.navigate(['/room', roomId]);
  }

  refreshRooms(): void {
    this.roomsService.getRooms().subscribe();
  }
}