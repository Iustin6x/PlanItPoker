// room-state.service.ts
import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { PlayerDTO, VoteSessionDTO, VoteDTO, RoomInfoDTO } from '../../shared/models/wbs';
import { StoryDTO } from '../../shared/models/wbs';
import { PlayerRole } from '../../shared/models/room/player.model';
import { StoryStatus } from '../../shared/models/story';
import { SessionStatus } from '../../shared/models/room';
import { AuthService } from './auth.service';
import { CardType, CardValue } from '../../shared/types';

@Injectable({
  providedIn: 'root'
})
export class RoomStateService {
  private _roomName = signal('');
  private _cardType = signal<CardType>(CardType.FIBONACCI);
  private _cards = signal<CardValue[]>([]);

  readonly roomName = this._roomName.asReadonly();
  readonly cardType = this._cardType.asReadonly();
  readonly cards = this._cards.asReadonly();


  setRoomInfo(roomInfo: RoomInfoDTO) {
    this._roomName.set(roomInfo.name);
    this._cardType.set(roomInfo.cardType);
    this._cards.set(roomInfo.customCards);
  }
}