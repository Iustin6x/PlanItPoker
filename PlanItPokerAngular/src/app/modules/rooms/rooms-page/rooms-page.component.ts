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
import { Room } from '../../../shared/models/room.model';
import { RoomsListComponent } from '../rooms-list/rooms-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { toSignal } from '@angular/core/rxjs-interop';

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
  styleUrl: './rooms-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RoomsPageComponent {
  private roomsService = inject(RoomsService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  // Folosim direct signals din serviciu
  rooms = this.roomsService.rooms;
  isLoading = this.roomsService.loading;

  async deleteRoom(roomId: string) {
    try {
      await this.roomsService.deleteRoom(roomId).toPromise();
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateRoomComponent);

    dialogRef.afterClosed().subscribe((newRoom?: Room) => {
      if (newRoom) {
        this.roomsService.createRoom(newRoom).subscribe({
          next: () => this.router.navigate(['/room', newRoom.id]),
          error: (err) => console.error('Create failed:', err)
        });
      }
    });
  }
}