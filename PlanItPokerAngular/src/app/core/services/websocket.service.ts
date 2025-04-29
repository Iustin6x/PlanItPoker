import { effect, inject, Injectable, signal } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../../environments/environment';
import { ClientMessage, ServerMessage, WSMessage } from '../../shared/models/wbs';
import { delay, retryWhen, Subject, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { RoomMessageHandlerService } from './room-message-handler.service';
import { ConnectionStateService } from './connection-state.service';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private socket$!: WebSocketSubject<WSMessage>;
  
  // public messages$ = new Subject<ServerMessage>(); // Expunem mesajele ca Observable
  private _messages = signal<WSMessage | null>(null);

  public messages$ = new Subject<WSMessage>();

  private earlyMessages: WSMessage[] = [];
  private isHandlerReady = false;

  constructor(private connectionState: ConnectionStateService) { }

  connect(roomId: string): void {
    if (this.socket$) {
      this.disconnect(); 
    }
    const token = localStorage.getItem('jwt') || '';
    const url = `${environment.wsUrl}/ws?token=${encodeURIComponent(token)}`;
    this.connectionState.setLoading(true);

    this.socket$ = webSocket<WSMessage>({
      url,
      openObserver: {
        next: () => {
          this.connectionState.setLoading(true);
          this.connectionState.setStatus('connected');
          this.send({ type: 'join', roomId });
        }
      },
      closeObserver: {
        next: () => this.connectionState.setStatus('disconnected')
      }
    });

    this.socket$.subscribe({
      next: (msg) => {
        this._messages.set(msg);
        this.messages$.next(msg);
      },
      error: (err) => this.connectionState.setError(err.message),
      complete: () => this.connectionState.setStatus('disconnected')
    });
  }



  send(message: ClientMessage): void {
    if (this.socket$) {
      this.socket$.next(message);
    }
  }

  disconnect(): void {
    if (this.socket$) {
      this.socket$.complete();
    }
  }
}