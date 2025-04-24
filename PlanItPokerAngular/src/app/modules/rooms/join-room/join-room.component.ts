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
import { AuthService } from '../../../core/services/auth.service';
import { PlayerRole } from '../../../shared/models/room/player.model';
import { HeaderComponent } from '../../../shared/components/header/header.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { VotingResultsComponent } from '../../voting/voting-results/voting-results.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-join-room',
  standalone: true,
  imports: [CommonModule,MatIconModule, FormsModule, VotingResultsComponent ,VotingCardComponent, StoryListComponent,HeaderComponent, PlayersPanelComponent, ModeratorPanelComponent, MatGridListModule],
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


  protected error = this.connectionState.error;
  showError: boolean = true;
  protected roomId = signal<string | null>(null);

  protected loading = this.connectionState.loading;
  readonly roomNmae = this.roomState.roomName;
  readonly voteSession = this.voteState.voteSession;
  readonly players = this.playerState.players;
  readonly stories = this.storyState.stories;
  protected result = this.voteState.result;
  readonly isRevealed = this.voteState.isRevealed;
      
  private connectionEffect = effect(() => {
    const status = this.connectionState.status();
    
    if (status === 'connected') {

      // this.connectionState.setLoading(false);
    }

    
    if (status === 'error') {
      this.connectionState.setError('Connection failed. Please try again.');
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
      this.connectionState.setLoading(false);
    }
  }

  closeErrorMessage() {
    this.showError = false;
  }

  retryConnection() {
    this.ws.disconnect();
    this.connect();
  }

  ngOnDestroy() {
    this.ws.disconnect();
  }
}