import { inject, Injectable } from '@angular/core';
import { WebSocketService } from './websocket.service';
import { ClientMessage } from '../../shared/models/wbs/websocket.model';
import { PlayerRole } from '../../shared/models/room/player.model';

@Injectable({
  providedIn: 'root'
})
export class WebSocketMessageService {
  private ws = inject(WebSocketService); 
  
  send(message: ClientMessage): void {
    this.ws.send(message);
  }

  joinRoom(roomId: string): void {
    this.ws.send({ type: 'join', roomId });
  }

  // Metode pentru gestionarea jucătorilor
  changePlayerName(playerId: string, newName: string): void {
    this.ws.send({ type: 'changeName', playerId, newName });
  }

  changePlayerRole(playerId: string, newRole: PlayerRole): void {
    this.ws.send({ type: 'changeRole', playerId, newRole });
  }

  // Metode pentru gestionarea story-urilor
  createStory(name: string): void {
    this.ws.send({ type: 'createStory', name });
  }

  getStoryWithSession(storyId: string): void {
    console.log("getStorywithSession");
    this.ws.send({ type: 'getStoryWithSession', storyId });
  }

  updateStory(storyId: string, name: string): void {
    this.ws.send({ type: 'updateStory', storyId, name });
  }


  deleteStory(storyId: string): void {
    this.ws.send({ type: 'deleteStory', storyId });
  }

  // Metode pentru sesiunile de vot
  startVoting(): void {
    this.ws.send({ type: 'startVote' });
  }

  addVote(sessionId: string, cardValue: string): void {
    this.ws.send({ type: 'addVote', sessionId, cardValue });
  }

  revealVotes(sessionId: string): void {
    this.ws.send({ type: 'revealVotes', sessionId });
  }

  clearVotes(sessionId: string): void {
    this.ws.send({ type: 'clearVotes', sessionId });
  }

  skipStory(sessionId: string, storyId: string): void {
    this.ws.send({ type: 'skipVote', sessionId, storyId });
  }

  endVoteSession(sessionId: string, finalValue: string): void {
    this.ws.send({ type: 'endVoteSession', sessionId, finalValue });
  }
}
