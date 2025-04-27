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
  isMenuOpen = signal(false);
  
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

  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }

  signOut() {
    this.userService.signOut();
    this.router.navigate(['/login']);
    this.isMenuOpen.set(false);
  }

  getInitials(name?: string): string {
    if (!name) return '??';
    return name.split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}