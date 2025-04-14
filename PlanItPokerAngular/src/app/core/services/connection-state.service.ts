import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionStateService {
  private _status = signal<'connected' | 'disconnected' | 'error'>('disconnected');
  private _error = signal<string | null>(null);
  private _loading = signal(true);

  readonly status = this._status.asReadonly();
  readonly error = this._error.asReadonly();
  readonly loading = this._loading.asReadonly();

  setStatus(status: 'connected' | 'disconnected' | 'error') {
    this._status.set(status);
  }

  setError(message: string | null) {
    this._error.set(message);
  }

  setLoading(loading: boolean) {
    this._loading.set(loading);
  }

  clearError() {
    this._error.set(null);
  }
}

