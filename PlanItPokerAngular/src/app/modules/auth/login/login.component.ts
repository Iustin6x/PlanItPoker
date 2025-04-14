// login.component.ts
import { Component, inject, OnInit, signal } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { JwtService } from '../../../core/services/jwt.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  standalone: true,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent{
  authService = inject(AuthService);
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
    
    this.authService.login(data).subscribe({
      next: () => this.router.navigateByUrl("/"),
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