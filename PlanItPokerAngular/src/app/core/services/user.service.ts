import { Injectable, inject, signal } from '@angular/core';
import { delay, finalize, Observable, of, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../shared/models/user';
import { UUID } from '../../shared/types';

@Injectable({ providedIn: 'root' })
export class UserService {
  private _currentUser = signal<User>(this.createGuestUser());
  private latency = 500;
  loading = signal(false);

  currentUser = this._currentUser.asReadonly();
  currentUserId = this._currentUser().id;

  private createGuestUser(): User {
    return {
      id: uuidv4() as UUID,
      name: 'Guest',
      isGuest: true,
      avatar: 'assets/default-avatar.png'
    };
  }

  getCurrentUser(): Observable<User> {
    this.loading.set(true);
    return of(this._currentUser()).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  updateUser(updates: { avatar?: string; username?: string }): Observable<{ message: string }> {
    this.loading.set(true);
    return new Observable<{ message: string }>(subscriber => {
      const currentUser = this._currentUser();
      
      this._currentUser.set({
        ...currentUser,
        name: updates.username || currentUser.name,
        avatar: updates.avatar || currentUser.avatar
      });

      subscriber.next({ message: 'Profile updated' });
      subscriber.complete();
    }).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  convertGuestToUser(email: string, password: string): Observable<{ message: string }> {
    return new Observable(subscriber => {
      if (!this._currentUser().isGuest) {
        subscriber.error(new Error('User already registered'));
        return;
      }

      // Simulate API call
      setTimeout(() => {
        this._currentUser.update(user => ({
          ...user,
          isGuest: false,
          email: email
        }));
        subscriber.next({ message: 'Account created successfully' });
        subscriber.complete();
      }, 1000);
    });
  }

  resetToGuest() {
    this._currentUser.set(this.createGuestUser());
  }

  signOut() {
    this._currentUser.set(this.createGuestUser());
  }
}