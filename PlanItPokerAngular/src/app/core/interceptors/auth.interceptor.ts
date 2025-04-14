import { inject, Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const excludedRoutes = ['/login', '/signup', '/quickplay'];
    
    if (excludedRoutes.some(route => req.url.includes(route))) {
      return next.handle(req);
    }

    const token = this.authService.getToken();
    
    if (token && !this.authService.isTokenExpired(token)) {
      const authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
      return next.handle(authReq).pipe(
        catchError((err) => {
          if (err instanceof Error) {
            console.error('Interceptor error:', err.message);
          } else {
            console.error('Unknown interceptor error:', JSON.stringify(err));
          }
          this.handleAuthError();
          return throwError(() => err);
        })
      );
    }

    this.handleAuthError();
    return throwError(() => new Error('Not authenticated'));
  }

  private handleAuthError(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}