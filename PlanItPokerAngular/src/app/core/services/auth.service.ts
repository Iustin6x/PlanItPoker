import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

const BASE_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private jwtToken = signal<string | null>(null);
  private router = inject(Router);

  private _returnUrl = signal<String> ('/');

  setReturnUrl(url: string) {
    this._returnUrl.set(url);
  }

  readonly returnUrl = this._returnUrl.asReadonly();

  isAuthenticated(): boolean {
    const token = localStorage.getItem('jwt');
    return (!!token && !this.isTokenExpired(token)); 
  }

  constructor() {
    const storedToken = localStorage.getItem('jwt');
  if (storedToken) {
    this.jwtToken.set(storedToken);
    this.autoLogout();
  }
  }

  register(signRequest: any): Observable<any> {
    return this.http.post(BASE_URL + 'signup', signRequest);
  }

  quickplay(name: string): Observable<{ jwt: string }> {
    return this.http.post<{ jwt: string }>(BASE_URL + 'quickplay', { name }).pipe(
      tap(response => this.setToken(response.jwt))
    );
  }

  login(loginRequest: any): Observable<{ jwt: string }> {
    return this.http.post<{ jwt: string }>(
      `${BASE_URL}login`,
      loginRequest,
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    ).pipe(
      tap(response => this.setToken(response.jwt))
    );
  }

  private setToken(token: string): void {
    localStorage.setItem('jwt', token);
    this.jwtToken.set(token);
    this.autoLogout();
  }

  getToken(): string | null {
    return this.jwtToken();
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.jwtToken.set(null);
  }

  isLoggedIn(): boolean {
    return !!this.jwtToken() && !this.isTokenExpired(this.jwtToken()!);
  }

  checkAuthentication(): boolean {
    const token = this.jwtToken();
    const isValid = !!token && !this.isTokenExpired(token);
    
    
    if (!isValid && this.router.url !== '/login') {
      this.logout();
      return false;
    }
    
    return isValid;
  }
  
  isTokenValid(): boolean {
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  getUserIdFromJWT(): any{
    const token = localStorage.getItem('jwt');
    if (!token) return null;
    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);
      return payload.userId || payload.sub || null;
    } catch (error) {
      console.error('JWT parsing error:', error);
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  }

  private decodeToken(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      console.error('Error dedcode token', e);
      return null;
    }
  }

  autoLogout(): void {
    const token = this.jwtToken();
    if (!token) return;

    const decoded = this.decodeToken(token);
    const expiresIn = decoded.exp * 1000 - Date.now();

    if (!decoded) {
      console.warn('Token decoding failed or token missing.');
      return;
    }
    
    setTimeout(() => {
      this.logout();
      this.router.navigate(['/login']);
    }, expiresIn);
  }
}