import {ChangeDetectionStrategy, Component, inject, model, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {
  MatDialog,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';

import { Router } from '@angular/router';
import { CreateRoomComponent } from '../rooms/create-room/create-room.component';
import { Room } from '../../shared/models/room/room.model';
import { RoomsService } from '../../core/services/rooms.service';
import { lastValueFrom } from 'rxjs';
import { NgFor, CommonModule } from '@angular/common'; 

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss'
})
export class HomeComponent {
  
}
