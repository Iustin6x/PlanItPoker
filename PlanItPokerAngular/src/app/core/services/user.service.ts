// src/app/core/services/user.service.ts
import { Injectable, inject, signal } from '@angular/core';
import { delay, finalize, Observable, of, throwError } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';


import { GuestSession } from '../../shared/models/guest/guest.model';
import { User, UserRole } from '../../shared/models/user';
import { generateUUID, UUID } from '../../shared/types';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _users = signal<User[]>(this.initializeMockUsers());
  private _currentUserId = signal<UUID | null>(null);
  private latency = 500;

  users = this._users.asReadonly();
  loading = signal(false);

  

  private initializeMockUsers(): User[] {
    return [
      this.createUserEntity({
        email: 'admin@planningpoker.com',
        roles: [UserRole.ADMIN]
      }),
      this.createUserEntity({
        email: 'moderator@planningpoker.com',
        roles: [UserRole.MODERATOR]
      }),
      this.createUserEntity({
        email: 'user@planningpoker.com',
        roles: [UserRole.USER]
      })
    ];
  }

  private createUserEntity(data: Partial<User>): User {
    return {
      id: generateUUID(), // Folosim funcția comună
      email: data.email || '',
      roles: data.roles || [UserRole.USER],
      originalGuestId: data.originalGuestId,
      history: {
        guestActivities: data.history?.guestActivities || {
          createdRooms: [],
          participatedRooms: [],
          votes: {}
        },
        ownedRooms: [],
        moderatedRooms: []
      },
      createdAt: new Date(),
      ...data
    };
  }

  get currentUserId(): UUID {
    return this._currentUserId() ?? generateUUID();
  }

  get currentUser(): User | undefined {
    return this._users().find(u => u.id === this._currentUserId());
  }

  getUsers(): Observable<User[]> {
    this.loading.set(true);
    return of(this._users()).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  getUserById(id: UUID): Observable<User> {
    this.loading.set(true);
    const user = this._users().find(u => u.id === id);
    return (user ? of({...user}) : throwError(() => new Error(`User ${id} not found`))).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  findUserByEmail(email: string): Observable<User | undefined> {
    this.loading.set(true);
    const user = this._users().find(u => u.email === email);
    return of(user).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  // core/services/user.service.ts
createUser(userData: Omit<User, 'id'>, guestSession?: GuestSession): Observable<User> {
    const newUser: User = {
      ...userData,
      id: generateUUID(),
      createdAt: new Date(),
      history: {
        guestActivities: guestSession?.history || {
          createdRooms: [],
          participatedRooms: [],
          votes: {}
        },
        ownedRooms: [],
        moderatedRooms: []
      }
    };
    
    return of(newUser).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  updateUser(id: UUID, updates: Partial<User>): Observable<User> {
    this.loading.set(true);
    return new Observable<User>(subscriber => {
      const users = this._users();
      const index = users.findIndex(u => u.id === id);
      
      if (index === -1) {
        subscriber.error(new Error(`User ${id} not found`));
        return;
      }

      const updatedUser = {
        ...users[index],
        ...updates,
        id // Prevent ID change
      };

      this._users.update(currentUsers => 
        currentUsers.map(user => 
          user.id === id ? updatedUser : user
        )
      );

      subscriber.next(updatedUser);
      subscriber.complete();
    }).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  deleteUser(id: UUID): Observable<void> {
    this.loading.set(true);
    return new Observable<void>(subscriber => {
      const exists = this._users().some(u => u.id === id);
      if (!exists) {
        subscriber.error(new Error(`User ${id} not found`));
        return;
      }

      this._users.update(users => users.filter(u => u.id !== id));
      subscriber.next();
      subscriber.complete();
    }).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  login(email: string, password: string): Observable<User> {
    this.loading.set(true);
    return new Observable<User>(subscriber => {
      const user = this._users().find(u => u.email === email);
      
      if (!user) {
        subscriber.error(new Error('Invalid credentials'));
        return;
      }

      // Simulare autentificare (fără verificare parolă reală)
      this._currentUserId.set(user.id);
      subscriber.next(user);
      subscriber.complete();
    }).pipe(
      delay(this.latency),
      finalize(() => this.loading.set(false))
    );
  }

  logout(): void {
    this._currentUserId.set(null);
  }

  convertGuestToUser(guest: GuestSession, userData: Omit<User, 'id' | 'createdAt'>): Observable<User> {
    return this.createUser({
      ...userData,
      createdAt: new Date(), // Adăugăm createdAt
      originalGuestId: guest.id,
      history: {
        guestActivities: guest.history,
        ownedRooms: [],
        moderatedRooms: []
      }
    });
  }
}