import { Component, DestroyRef, OnInit, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WebSocketService } from '../../../core/services/websocket.service';
import { ConnectionStateService } from '../../../core/services/connection-state.service';
import { VotingCardComponent } from '../../voting/voting-card/voting-card.component';
import { StoryListComponent } from '../../story/story-list/story-list.component';
import { PlayersPanelComponent } from '../../voting/players-panel/players-panel.component';
import { ModeratorPanelComponent } from '../../voting/moderator-panel/moderator-panel.component';
import { RoomMessageHandlerService } from '../../../core/services/room-message-handler.service';
import { RoomStateService } from '../../../core/services/room-state.service';
import { PlayerStateService } from '../../../core/services/player-state.service';
import { StoryStateService } from '../../../core/services/story-state.service';
import { VoteStateService } from '../../../core/services/vote-state.service';

@Component({
  selector: 'app-join-room',
  standalone: true,
  imports: [CommonModule, FormsModule, VotingCardComponent, StoryListComponent, PlayersPanelComponent, ModeratorPanelComponent],
  templateUrl: './join-room.component.html',
  styleUrls: ['./join-room.component.scss'],
  providers: [RoomMessageHandlerService]
})
export class JoinRoomComponent implements OnInit {
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private ws = inject(WebSocketService);
  private roomHandle = inject(RoomMessageHandlerService);
  private roomState = inject (RoomStateService)
  private playerState = inject (PlayerStateService)
  private storyState = inject (StoryStateService);
  private voteState = inject (VoteStateService);

  private connectionState = inject(ConnectionStateService);

  // protected loading = this.connectionState.loading;
  protected error = this.connectionState.error;
  protected roomId = signal<string | null>(null);

  protected loading = this.connectionState.loading;
  readonly roomNmae = this.roomState.roomName;
  readonly voteSession = this.voteState.voteSession;
  readonly players = this.playerState.players;
  readonly stories = this.storyState.stories;
  readonly isModerator = this.playerState.isModerator;

  // Inițializare effect în constructor
  private connectionEffect = effect(() => {
    const status = this.connectionState.status();
    
    if (status === 'connected') {
      console.log("doi");
      // this.connectionState.setLoading(false);
    }
    console.log("ce este state"+ this.loading)

    
    if (status === 'error') {
      this.connectionState.setError('Connection failed. Please try again.');
      console.log("trei");
      this.connectionState.setLoading(false);
    }
  });

  ngOnInit() {
    this.route.paramMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      const roomId = params.get('id');
      if (roomId) {
        this.roomId.set(roomId);
        this.connect();
      }
    });
  }

  private connect() {
    const roomId = this.roomId();
    if (!roomId) return;

    // this.connectionState.setLoading(true);
    this.connectionState.clearError();
    
    try {
      this.ws.connect(roomId);
    } catch (err) {
      this.connectionState.setError('Connection error');
      console.log("patru");
      this.connectionState.setLoading(false);
    }
  }

  retryConnection() {
    this.ws.disconnect();
    this.connect();
  }

  ngOnDestroy() {
    this.ws.disconnect();
  }
}