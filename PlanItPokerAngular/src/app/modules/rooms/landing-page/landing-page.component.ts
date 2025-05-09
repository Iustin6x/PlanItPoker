import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreateRoomDialogComponent } from '../create-room-dialog/create-room-dialog.component';
import { RoomsListComponent } from '../rooms-list/rooms-list.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { filter, take } from 'rxjs/operators';
import { isUUID, UUID } from '../../../shared/types';
import { RoomService } from '../../../core/services/room.service';
import {  Room, RoomListDTO, RoomRequestDTO } from '../../../shared/models/room';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { interval } from 'rxjs';

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
    MatIconModule,
    HeaderComponent,
    MatSnackBarModule
  ],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
})
export class LandingPageComponent implements OnInit{
  private roomService = inject(RoomService);
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private route = inject(ActivatedRoute);

  ngOnInit(){
    this.roomService.getRooms().subscribe();
  }
  rooms = this.roomService.rooms;
  isLoading = this.roomService.loading;

  handleDeleteRoom(roomId: string): void {
    this.roomService.deleteRoom(roomId).subscribe({
      error: (err) => console.error('Delete error', err)
    });
  }

  handleSelectRoom(roomId: string): void {
    this.router.navigate(['/room', roomId]); 
  }

  


  handleEditRoom(room: RoomListDTO): void {
    if (!room.id) {
      console.error('Room ID is missing.');
      return;
    }
  
    this.roomService.getRoomById(room.id).pipe(
      take(1)
    ).subscribe({
      next: (fullRoomData: RoomRequestDTO) => {
        this.openRoomDialog(fullRoomData, (dto) => this.updateRoom(dto));
      },
      error: (err) => {
        console.error('Failed to fetch full room data:', err);
      }
    });
  }
  
  openCreateDialog(): void {
    this.openRoomDialog(
      undefined, // No initial data for creation
      (dto) => this.createRoom(dto)
    );
  }
  
  private openRoomDialog(initialData: Partial<RoomRequestDTO> | undefined, callback: (dto: RoomRequestDTO) => void): void {
    const dialogRef = this.dialog.open(CreateRoomDialogComponent, {
      width: '600px',
      disableClose: true,
      data: initialData
    });
  
    dialogRef.afterClosed()
      .pipe(
        filter(room => this.isValidRoomDTO(room)),
        take(1)
      )
      .subscribe({
        next: (dto: RoomRequestDTO) => callback(dto),
        error: (err) => this.handleDialogError(err)
      });
  }
  
  private isValidRoomDTO(dto: unknown): dto is RoomRequestDTO {
    return !!dto &&
           typeof dto === 'object' &&
           !Array.isArray(dto) &&
           'name' in dto &&
           'cardType' in dto &&
           'cards' in dto &&
           Array.isArray((dto as RoomRequestDTO).cards) &&
           typeof (dto as RoomRequestDTO).name === 'string';
  }
  
  private handleDialogError(err: any): void {
    console.error('Dialog operation failed:', err);
  }
  
  private createRoom(dto: RoomRequestDTO): void {
    this.roomService.createRoom(dto).subscribe({
      next: (createdRoom) => this.handleCreatedRoom(),
      error: (err) => this.handleRoomError('Creation', err)
    });
  }

  private handleCreatedRoom(): void {
    this.refreshRooms();
  }
  
  private updateRoom(dto: RoomRequestDTO): void {
    if (!dto.id) {
      console.error('Update failed: Missing room ID');
      return;
    }
  
    const { id, ...roomData } = dto;
  
    this.roomService.updateRoom(id, roomData).subscribe({
      next: () => {
        this.refreshRooms();
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