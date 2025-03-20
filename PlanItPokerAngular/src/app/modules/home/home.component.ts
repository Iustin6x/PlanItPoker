import {ChangeDetectionStrategy, Component, inject, model, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import { Router } from '@angular/router';
import { WebSocketService } from '../../core/services/websocket.service';
import { CreateRoomComponent } from '../create-room/create-room.component';
import { RoomComponent } from '../room/room.component';
import { RoomData } from '../../shared/models/room.model';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, CreateRoomComponent],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
  readonly roomData = model<RoomData>({
    name: '',
    cardType: 'scrum',
  })
  readonly dialog = inject(MatDialog);

  constructor(private router: Router, private wsService: WebSocketService) {}

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateRoomComponent, {
      data: this.roomData()
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      
      if (result !== undefined) {
        const jsonString = JSON.stringify(result);
console.log(jsonString);
        console.log(result);
        this.roomData.set(result);
        console.log(this.roomData());
      }
    });
  }
}
