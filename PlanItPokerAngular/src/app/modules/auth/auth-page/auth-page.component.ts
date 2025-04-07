import { Component, inject, signal } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JwtService } from '../../../core/services/jwt.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-auth-page',
  imports: [CommonModule, FormsModule,HttpClientModule],
  standalone: true,
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.scss'
})
export class AuthPageComponent {
  service = inject(JwtService);
  userService = inject(UserService);
  router = inject(Router);
  isLogin = signal(true);
  email = '';
  password = '';

  handleSubmit() {
    if (this.isLogin()) {
      const data = {
        email: this.email,
        password: this.password
      };
      this.service.login(data).subscribe(
        (response) => {
          console.log(response);
          if (response.jwt != null) {
            alert("Hello, Your token is " + response.jwt);
            const jwtToken = response.jwt;
            localStorage.setItem('jwt', jwtToken);
            this.router.navigateByUrl("/dashboard");
          }
        }
      )
    } else {
      const data = {
        email: this.email,
        password: this.password,
      };
      // console.log(this.registerForm.value);
    this.service.register(data).subscribe(
      (response) => {
        if (response.id != null) {
          alert("Hello " + response.name);
        }
      }
    )
      // this.userService.convertGuestToUser(this.email, this.password).subscribe({
      //   next: () => alert('Account created successfully!'),
      //   error: (err) => alert(err.message)
      // });
    }
  }
}
