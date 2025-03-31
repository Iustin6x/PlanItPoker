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
import { filter, take } from 'rxjs/operators';
import { isUUID, UUID } from '../../../shared/types';
import { RoomService } from '../../../core/services/room.service';
import {  Room, RoomDialogDTO } from '../../../shared/models/room';

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

  constructor(){
    this.roomService.getRoomsByUserId();
  }
  rooms = this.roomService.rooms;
  isLoading = this.roomService.loading;

  handleDeleteRoom(roomId: UUID): void {
    this.roomService.deleteRoom(roomId).subscribe({
      error: (err) => console.error('Ștergerea a eșuat:', err)
    });
  }

  handleEditRoom(room: RoomDialogDTO): void {
    this.openRoomDialog(
      { 
        id: room.id,
        name: room.name,
        cardType: room.cardType,
        cards: room.cards
      },
      (dto) => this.updateRoom(dto) 
    );
  }
  
  openCreateDialog(): void {
    this.openRoomDialog(
      undefined, // No initial data for creation
      (dto) => this.createRoom(dto)
    );
  }
  
  private openRoomDialog(initialData: Partial<RoomDialogDTO> | undefined, callback: (dto: RoomDialogDTO) => void): void {
    const dialogRef = this.dialog.open(CreateRoomDialogComponent, {
      width: '600px',
      disableClose: true,
      data: initialData
    });
  
    dialogRef.afterClosed()
      .pipe(
        filter(room => this.isValidRoomDTO(room)), // Consolidated validation
        take(1) // Ensure automatic cleanup
      )
      .subscribe({
        next: (dto: RoomDialogDTO) => callback(dto),
        error: (err) => this.handleDialogError(err)
      });
  }
  
  private isValidRoomDTO(dto: unknown): dto is RoomDialogDTO {
    return !!dto && 
           typeof dto === 'object' &&
           !Array.isArray(dto) &&
           'name' in dto &&
           'cardType' in dto &&
           'cards' in dto &&
           Array.isArray((dto as RoomDialogDTO).cards) &&
           typeof (dto as RoomDialogDTO).name === 'string';
  }
  
  private handleDialogError(err: any): void {
    console.error('Dialog operation failed:', err);
  }
  
  private createRoom(dto: RoomDialogDTO): void {
    this.roomService.createRoom(dto).subscribe({
      next: (createdRoom) => this.handleCreatedRoom(createdRoom),
      error: (err) => this.handleRoomError('Creation', err)
    });
  }

  private handleCreatedRoom(createdRoom: Room): void {
    this.refreshRooms();
  }
  
  private updateRoom(dto: RoomDialogDTO): void {
    if (!dto.id) {
      console.error('Update failed: Missing room ID');
      return;
    }
  
    this.roomService.updateRoom(dto.id, dto).subscribe({
      next: () => {
        this.refreshRooms();
        // Consider adding success feedback here
      },
      error: (err) => this.handleRoomError('Update', err)
    });
  }
  
  private handleRoomError(operation: string, err: any): void {
    console.error(`${operation} failed:`, err);
    // Consider adding user feedback here (e.g., snackbar/toast)
    // Consider implementing retry logic for specific error cases
  }

  refreshRooms(): void {
    this.roomService.getRooms().subscribe();
  }
}