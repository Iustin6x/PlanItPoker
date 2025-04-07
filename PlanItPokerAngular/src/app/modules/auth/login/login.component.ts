// login.component.ts
import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { JwtService } from '../../../core/services/jwt.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  service = inject(JwtService);
  router = inject(Router);
  
  email = '';
  password = '';

  errorMessage = signal<string | null>(null);

  handleSubmit() {
    this.errorMessage.set(null); // Resetare mesaj de eroare
    
    const data = {
      email: this.email,
      password: this.password
    };
    
    this.service.login(data).subscribe({
      next: (response) => {
        if (response.jwt) {
          localStorage.setItem('jwt', response.jwt);
          this.router.navigateByUrl("/");
        }
      },
      error: (err) => {
        if (err.status === 401) {
          this.errorMessage.set('Email sau parolă incorectă');
        } else {
          this.errorMessage.set('Eroare la autentificare');
        }
      }
    });
  }
}