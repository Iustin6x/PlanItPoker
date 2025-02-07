import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from '../../core/services/websocket.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  roomId = '';
  username = '';

  constructor(private router: Router, private wsService: WebSocketService) {}

  createRoom() {
    const newRoomId = Math.random().toString(36).substr(2, 6); // Generare cod unic
    this.router.navigate(['/room', newRoomId]);
  }

  joinRoom() {
    if (this.roomId && this.username) {
      this.router.navigate(['/room', this.roomId], { queryParams: { user: this.username } });
    }
  }
}
