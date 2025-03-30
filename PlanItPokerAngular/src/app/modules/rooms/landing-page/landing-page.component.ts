import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreateRoomDialogComponent } from '../create-room-dialog/create-room-dialog.component';
import { RoomsListComponent } from '../rooms-list/rooms-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { filter } from 'rxjs/operators';
import { isUUID, UUID } from '../../../shared/types';
import { RoomService } from '../../../core/services/room.service';
import { CreateRoomDTO, Room } from '../../../shared/models/room';

@Component({
  selector: 'app-landing-page',
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
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingPageComponent {
  private roomService = inject(RoomService);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  rooms = this.roomService.rooms;
  isLoading = this.roomService.loading;

  handleDeleteRoom(roomId: UUID): void {
    this.roomService.deleteRoom(roomId).subscribe({
      error: (err) => console.error('Ștergerea a eșuat:', err)
    });
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateRoomDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed()
      .pipe(filter(room => this.isValidCreateDTO(room)))
      .subscribe((dto: CreateRoomDTO) => {
        this.createRoom(dto);
      });
  }

  private isValidCreateDTO(dto: unknown): dto is CreateRoomDTO {
    return !!dto && 
           typeof dto === 'object' &&
           'name' in dto &&
           'cardType' in dto &&
           'cards' in dto &&
           Array.isArray((dto as CreateRoomDTO).cards);
  }

  private createRoom(dto: CreateRoomDTO): void {
    this.roomService.createRoom(dto).subscribe({
      next: (createdRoom) => this.handleCreatedRoom(createdRoom),
      error: (err) => console.error('Crearea camerei a eșuat:', err)
    });
  }

  private handleCreatedRoom(room: Room): void {
    this.router.navigate(['/room', room.id]);
    this.refreshRooms();
  }

  refreshRooms(): void {
    this.roomService.getRooms().subscribe();
  }
}