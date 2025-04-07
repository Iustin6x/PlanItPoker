// signup.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { JwtService } from '../../../core/services/jwt.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-signup',
  imports: [CommonModule, FormsModule, HttpClientModule, RouterModule],
  standalone: true,
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignUpComponent {
  service = inject(JwtService);
  router = inject(Router);
  name = '';
  email = '';
  password = '';

  handleSubmit() {
    const data = {
      name: this.name,
      email: this.email,
      password: this.password,
    };

    this.service.register(data).subscribe((response) => {
      if (response.id) {
        alert("Registration successful!");
        this.router.navigateByUrl("/login");
      }
    });
  }
}