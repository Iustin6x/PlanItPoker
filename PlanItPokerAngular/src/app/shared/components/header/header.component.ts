// header.component.ts
import { Component, signal } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { fadeIn } from '../../animations/animations';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../models/user';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [fadeIn]
})
export class HeaderComponent {
  isMenuVisible = signal(false);
  
  constructor(
    public userService: UserService,
    private router: Router
  ) {}

  get user(): User | null {
    return this.userService.currentUser();
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe();
  }
  toggleContextMenu() {
    this.isMenuVisible.update(v => !v); 
  }

  signOut() {
    this.userService.signOut();
    this.router.navigate(['/login']);
    this.isMenuVisible.set(false);
  }
}