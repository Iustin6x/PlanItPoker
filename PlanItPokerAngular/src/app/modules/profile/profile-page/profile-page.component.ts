import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../../shared/components/header/header.component';

@Component({
  selector: 'app-profile-page',
  imports: [CommonModule, FormsModule, HeaderComponent],
  standalone: true,
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss'
})
export class ProfilePageComponent {
  userService = inject(UserService);
  loading = signal(false);
  successMessage = signal<string | null>(null);
  errorMessage = signal<string | null>(null);

  username = this.userService.userName();
  userId = this.userService.userId();
  email = this.userService.userEmail();
  password = '';

  get isGuest() {
    return this.userService.isGuest();
  }


  updateProfile() {
    this.loading.set(true);
    this.errorMessage.set(null);
    
    this.userService.updateUser({ name: this.username }).subscribe({
      next: () => {
        this.successMessage.set('Profile updated successfully');
        setTimeout(() => this.successMessage.set(null), 3000);
      },
      error: (err) => {
        this.errorMessage.set(err.message || 'Error updating profile');
        console.error(err);
      },
      complete: () => this.loading.set(false)
    });
  }

  convertAccount() {
    this.loading.set(true);
    this.errorMessage.set(null);
  
    const guestUserId = this.userService.currentUser()?.id;
    
    if (!guestUserId) {
      this.errorMessage.set('Unable to identify guest account');
      this.loading.set(false);
      return;
    }
  
    this.userService.convertGuestToUser({ 
      name: this.username,
      email: this.email,
      password: this.password,
      guestUserId: guestUserId
    }).subscribe({
      next: () => {
        // Reîmprospătare date utilizator
        this.userService.getCurrentUser().subscribe({
          next: (updatedUser) => {
            this.successMessage.set('Account upgraded successfully');
            setTimeout(() => this.successMessage.set(null), 3000);
            
            // Actualizare câmpuri locale cu noile valori
            this.username = updatedUser.name;
            this.email = updatedUser.email || '';
          },
          error: (err) => {
            console.error('Error refreshing user data:', err);
            this.successMessage.set('Account upgraded - please refresh page');
          }
        });
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error upgrading account');
        console.error(err);
      },
      complete: () => this.loading.set(false)
    });
  }
}
