import { Injectable, computed, inject, signal, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { catchError, delay, finalize, map, Observable, of, tap, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../shared/models/user';
import { UUID } from '../../shared/types';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private platformId = inject(PLATFORM_ID);

  loading = signal(false);

  private _currentUser = signal<User | null>(null);
  
  currentUser = this._currentUser.asReadonly();
  isGuest = computed(() => !!this._currentUser()?.isGuest);
  userId = computed(() => this._currentUser()?.id || '');
  userName = computed(() => this._currentUser()?.name || 'Guest');
  userEmail = computed(() => this._currentUser()?.email || '');

  getCurrentUser(): Observable<User> {
    if (isPlatformBrowser(this.platformId)) {
      const cachedUser = localStorage.getItem('currentUser');
      if (cachedUser) {
        this._currentUser.set(JSON.parse(cachedUser));
      }
    }

    this.loading.set(true);
    return this.http.get<User>('http://localhost:8080/api/user').pipe(
      map(response => ({
        ...response,
        isGuest: response.isGuest
      })),
      tap(user => {
        this._currentUser.set(user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
        }
      }),
      catchError(error => {
        console.error('Error fetching user:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  updateUser(updates: { name?: string; avatar?: string }): Observable<User> {
    this.loading.set(true);
    return this.http.put<User>('http://localhost:8080/api/user', updates).pipe(
      tap(updatedUser => {
        this._currentUser.set(updatedUser);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
      }),
      catchError(error => {
        console.error('Error updating user:', error);
        return throwError(() => error);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  convertGuestToUser(userData: { 
    name: string; 
    email: string; 
    password: string;
    guestUserId: string;
  }): Observable<User> {
    return this.http.post<User>('http://localhost:8080/signup', userData).pipe(
      tap(user => {
        this._currentUser.set(user);
        if (isPlatformBrowser(this.platformId)) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.removeItem('guestUserId');
        }
      }),
      catchError(error => {
        console.error('Conversion error:', error);
        return throwError(() => error);
      })
    );
  }

  signOut() {
    this.authService.logout();
    this._currentUser.set(null);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('auth_token');
    }
  }
}