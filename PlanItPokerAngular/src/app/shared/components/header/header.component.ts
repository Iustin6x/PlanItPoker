// header.component.ts
import { Component, signal } from '@angular/core';

import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { fadeIn } from '../../animations/animations';
import { UserService } from '../../../core/services/user.service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  animations: [fadeIn]
})
export class HeaderComponent {
  isMenuOpen = signal(false);
  
  constructor(
    public userService: UserService,
    private router: Router
  ) {}

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  signOut() {
    this.userService.signOut();
    this.router.navigate(['/login']);
    this.isMenuOpen.set(false);
  }

  getInitials(name: string): string {
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}