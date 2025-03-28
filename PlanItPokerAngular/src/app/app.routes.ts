import { Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { RoomComponent } from './modules/rooms/room/room.component';
import { RoomsPageComponent } from './modules/rooms/rooms-page/rooms-page.component';

export const routes: Routes = [
    { path: '', component: RoomsPageComponent },
  ];
