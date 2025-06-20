import { effect, inject, Injectable } from '@angular/core';
import { ServerMessage, WSMessage } from '../../shared/models/wbs';
import { ConnectionStateService } from './connection-state.service';
import { PlayerStateService } from './player-state.service';
import { RoomStateService } from './room-state.service';
import { StoryStateService } from './story-state.service';
import { VoteStateService } from './vote-state.service';
import { WebSocketService } from './websocket.service';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class RoomMessageHandlerService {
  private playerState = inject(PlayerStateService);
  private storyState = inject(StoryStateService);
  private voteState = inject(VoteStateService);
  private roomState = inject(RoomStateService);
  private connectionState = inject(ConnectionStateService);
  private ws = inject(WebSocketService);
  private notify = inject(NotificationService);

  constructor() {
    this.ws.messages$.subscribe((msg) => {
      this.handleMessage(msg);
    });
  }

  handleMessage(message: WSMessage) {

    switch (message.type) {
      case 'roomInfo':
        this.roomState.setRoomInfo(message.room);
        break;

      case 'playerList':

        this.playerState.setPlayers(message.players || []);
        break;

      case 'noPlayers':

        this.playerState.setPlayers([]);
        break;

      case 'playerJoined':
        this.playerState.updatePlayer(message.player);
        break;

      case 'voteAdded':
        this.voteState.voteAdded(message.vote, message.cardValue);
        break;

      case 'playerDisconnected':

        this.playerState.disconnectPlayer(message.player.id);
        break;

      case 'playerNameChanged':
        this.playerState.changeName(message.playerId, message.newName);
        break;

      case 'playerRoleChanged':
        this.playerState.changeRole(message.playerId, message.newRole);
        break;

      case 'storyList':
        this.storyState.setStories(message.stories);
        break;

      case 'noStories':
        this.storyState.setStories([]);
        break;


      case 'storyCreated':
        this.storyState.addStory(message.story);
        break;

      case 'storyUpdated':
        this.storyState.updateStory(message.story);
        break;

      case 'storyDeleted':
        this.storyState.deleteStory(message.storyId);
        break;

      case 'voteSession':
        this.voteState.setSession(message.session || null);

        if (message.hasVoted) {
          this.voteState.setCurrentVote(message.hasVoted);
        }
        this.connectionState.setLoading(false);
        break;

      case 'noActiveVoteSession':

        this.voteState.setSession(null);
        this.connectionState.setLoading(false);
        break;

      case 'voteStarted':
        this.voteState.setSession(message.session);
        break;

      case 'votesCleared':
        this.voteState.clearVotes();
        break;

      case 'votesRevealed':
        this.voteState.revealVotes(message.votes, message.result);
        break;

      case 'storySkipped':
        this.storyState.updateStory(message.story);
        if (message.session) {
          this.voteState.setSession(message.session);
        }
        break;

      case 'storyWithSession':
        this.storyState.setViewedStory(message.story);
        this.storyState.setViewedSession(message.session);
        this.connectionState.setLoading(false);
        break;

      case 'voteEnded':
        this.voteState.endSession(message.finalValue);
        this.storyState.updateStory(message.story);
        break;

      case 'roomSettingsUpdated':
        this.roomState.setRoomSettings(message.settings);
        break;

      case 'error':
        const baseMsg = message.message || 'An unexpected error occurred.';
        const details = message.details || '';
        const fullMessage = details ? `${baseMsg} Details: ${details}` : baseMsg;

        if (details.includes('Vote modification is not allowed')) {
            this.notify.showError(message.message + details);
        }

        // this.connectionState.setError(fullMessage);
        // console.error('[WebSocket Error]', { message: baseMsg, details });
        break;

      default:
        console.warn('Unhandled message type:', message);
    }
  }
}
