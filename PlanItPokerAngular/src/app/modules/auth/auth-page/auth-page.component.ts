import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-auth-page',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss'
})
export class AuthPageComponent {
  userService = inject(UserService);
  isLogin = signal(true);
  email = '';
  password = '';

  handleSubmit() {
    if (this.isLogin()) {
      // Implement login logic
    } else {
      this.userService.convertGuestToUser(this.email, this.password).subscribe({
        next: () => alert('Account created successfully!'),
        error: (err) => alert(err.message)
      });
    }
  }
}
