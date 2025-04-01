import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
  userService = inject(UserService);

  avatars = [
    'assets/avatars/1.png',
    'assets/avatars/2.png',
    'assets/avatars/3.png',
  ];
  selectedAvatar = this.userService.currentUser().avatar;

  username = this.userService.currentUser().name;
  email = '';
  password = '';

  updateProfile() {
    this.userService.updateUser({
      avatar: this.selectedAvatar,
      username: this.username
    }).subscribe();
  }

  convertAccount() {
    this.userService.convertGuestToUser(this.email, this.password).subscribe({
      next: () => alert('Account created successfully!'),
      error: (err) => alert(err.message)
    });
  }
}
