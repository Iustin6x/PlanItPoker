import { effect, inject, Injectable } from '@angular/core';
import { ServerMessage, WSMessage } from '../../shared/models/wbs';
import { ConnectionStateService } from './connection-state.service';
import { PlayerStateService } from './player-state.service';
import { RoomStateService } from './room-state.service';
import { StoryStateService } from './story-state.service';
import { VoteStateService } from './vote-state.service';
import { WebSocketService } from './websocket.service';

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

  constructor() {
    this.ws.messages$.subscribe((msg) => {
      console.log('Received via Subject:', msg);
      this.handleMessage(msg);
    });


  }

  handleMessage(message: WSMessage) {
    console.log("Handle " + message.type);
    switch (message.type) {
      case 'roomInfo':
        this.roomState.setRoomInfo(message.room);
        break;

      case 'playerList':
        console.log('Received playerList:', message.players);
        this.playerState.setPlayers(message.players || []);
        break;

      case 'noPlayers':
        console.log('No players in the room yet');
        this.playerState.setPlayers([]);
        break;

      case 'playerJoined':
        this.playerState.updatePlayer(message.player);
        break;

      case 'playerVoted':
        this.playerState.markPlayerVoted(message.playerId);
        break;

      case 'playerDisconnected':
        console.log("player disconet" + message.player.id)
        this.playerState.disconnectPlayer(message.player.id);
        break;

      case 'playerNameChanged':
        this.playerState.changeName(message.playerId, message.newName);
        break;

      case 'playerRoleChanged':
        this.playerState.changeRole(message.playerId, message.newRole);
        break;

      case 'storyList':
        console.log('Handle storyList');
        this.storyState.setStories(message.stories);
        break;

      case 'noStories':
        console.log('No stories in the room yet');
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

        console.log("votesession handle");
        this.voteState.setSession(message.session || null);
        this.connectionState.setLoading(false);
        break;

      case 'noActiveVoteSession':
        console.log("No active Vote session");
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
        this.voteState.updateVotes(message.votes, message.result);
        this.voteState.revealVotes();
        break;

      case 'storySkipped':
        this.storyState.updateStory(message.story);
        if (message.session) {
          this.voteState.setSession(message.session);
        }
        break;

      case 'voteEnded':
        this.voteState.endSession(message.finalValue);
        break;

      case 'error':
        this.connectionState.setError(message.message);
        break;

      default:
        console.warn('Unhandled message type:', message);
    }
  }
}
