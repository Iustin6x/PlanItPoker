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
  // private ws = inject(WebSocketService);
  // private authService = inject(AuthService);

  // // State signals
  // private _room = signal<RoomDetailsDTO | null>(null);
  // private _voteSession = signal<VoteSessionDTO | null>(null);
  // private _roomName = signal<String | null>(null);
  // private _cardType = signal<CardType | null>(null);
  // private _cards = signal<CardType[]>([]);
  // private _players = signal<PlayerDTO[]>([]);
  // private _stories = signal<StoryDTO[]>([]);
  // private _error = signal<string | null>(null);
  // private _loading = signal(true);

  // // Readonly state
  // readonly room = this._room.asReadonly();
  // readonly voteSession = this._voteSession.asReadonly();
  // readonly roomName = this._roomName.asReadonly();
  // readonly cardType = this._cardType.asReadonly();
  // readonly cards = this._cards.asReadonly();
  // readonly players = this._players.asReadonly();
  // readonly stories = this._stories.asReadonly();
  // readonly error = this._error.asReadonly();
  // readonly loading = this._loading.asReadonly();
  // readonly isModerator = computed(() => {
  //   const userId = this.authService.getUserIdFromJWT();
  //   return this.players().some(p =>
  //     p.userId === userId && p.role === PlayerRole.MODERATOR
  //   );
  // });

  // checkModerator() {
  //   const userId = this.authService.getUserIdFromJWT();
  //   return this.players().some(p =>
  //     p.userId === userId && p.role === PlayerRole.MODERATOR
  //   );
  // }
  // // Computed values
  // // e defapt current session
  // // readonly currentStory = computed(() => this.room()?.currentStory || null);
  // readonly activeStories = computed(() => this.stories().filter(s => s.status === 'ACTIVE'));
  // readonly completedStories = computed(() => this.stories().filter(s => s.status === 'COMPLETED'));
  // readonly revealedVotes = computed(() => this.voteSession()?.revealed ? this.voteSession()!.votes : null);

  // constructor() {
  //   effect(() => {
  //     const msg = this.ws.messages();
  //     if (msg) this.handleMessage(msg);
  //   });
  // }


  // private handleConnected() {
  //   // Logica pentru reconectare/reinitializare
  // }

  // // private handleConnectionError() {
  // //   this.error.set('Connection error');
  // // }

  // private handleMessage(msg: any): void {
  //   try {
  //     if (!msg.type) {
  //       this.updateRoomState(msg);
  //     } else {
  //       console.log("HandleMessage " + msg.type);
  //       switch (msg.type) {
  //         case 'error':
  //           this._error.set(msg.message);
  //           break;
  //         case 'roomDetails':
  //           this.handleRoomDetails(msg);
  //           break;
  //         case 'roomInfo':
  //           this.handleRoomInfo(msg.room);
  //           break;

  //         case 'playerList':
  //           this._players.set(msg.players);
  //           break;

  //         case 'storyList':
  //           this._stories.set(msg.stories);
  //           break;
  //         case 'voteSession':
  //           this._voteSession.set(msg.session);
  //           break;

  //         case 'playerJoined':
  //           this.handlePlayerJoined(msg.player);
  //           break;
  //         case 'playerDisconnected':
  //           this.handlePlayerDisconnected(msg.playerId);
  //           break;
  //         case 'playerNameChanged':
  //           this.handlePlayerNameChange(msg.playerId, msg.newName);
  //           break;
  //         case 'playerRoleChanged':
  //           this.handlePlayerRoleChange(msg.playerId, msg.newRole);
  //           break;
  //         case 'storyCreated':
  //           this.handleStoryCreated(msg.story);
  //           break;
  //         case 'storyUpdated':
  //           this.handleStoryUpdated(msg.story);
  //           break;
  //         case 'storyDeleted':
  //           this.handleStoryDeleted(msg.storyId);
  //           break;
  //         case 'voteStarted':
  //           this.handleVoteStarted(msg.session, msg.story);
  //           break;
  //         case 'votesCleared':
  //           this.handleVotesCleared(msg.sessionId);
  //           break;
  //         case 'showVotes':
  //           this.handleShowVotes(msg.votes);
  //           break;
  //         case 'voteEnded':
  //           this.handleVoteEnded(msg.finalValue);
  //           break;
  //         default:
  //           console.warn('Unknown message type:', msg.type);
  //       }
  //     }
  //   } catch (error) {
  //     this._error.set('Eroare la procesarea mesajului');
  //   }
  // }

  // // Region: Message handlers
  // private handleRoomDetails(details: RoomDetailsDTO): void {
  //   this._room.set(details);
  //   this._players.set(details.players);
  //   this._stories.set(details.stories);
  //   this._voteSession.set(details.voteSession || null);
  //   this._error.set(null);
  //   this._loading.set(false);
  // }

  // private handleRoomInfo(room: RoomDetailsDTO): void {
  //   this._room.set(room);
  //   this._roomName.set(room.name);
  //   this._cardType.set(room.cardType);
  //   this._cards.set(room.cards);
  // }

  // private updateRoomState(data: any) {
  //   this._room.set({
  //     name: data.name || "Unnamed Room",
  //     cardType: data.cardType,
  //     cards: data.customCard,
  //     players: data.players || [],
  //     stories: data.stories || [],
  //     voteSession: data.voteSession || null,
  //   });
  //   this._roomName.set(data.name || "Unnamed Room");
  //   this._cardType.set(data.cardType || null);
  //   this._cards.set(data.cards || []);
  //   this._players.set(data.players || []);
  //   this._stories.set(data.stories || []);
  //   this._voteSession.set(data.voteSession || null);
  // }

  // private handlePlayerJoined(player: PlayerDTO): void {
  //   this._players.update(players =>
  //     players.some(p => p.id === player.id)
  //       ? players.map(p => p.id === player.id ? player : p) // actualizează
  //       : [...players, player] // adaugă
  //   );
  // }

  // private handlePlayerDisconnected(playerId: string): void {
  //   console.log("PLAYER Disconnected");
  //   this._players.update(players =>
  //     players.map(p =>
  //       p.id === playerId
  //         ? { ...p, connected: false }
  //         : p
  //     )
  //   );
  // }

  // private handlePlayerNameChange(playerId: string, newName: string): void {
  //   this._players.update(players =>
  //     players.map(p => p.id === playerId ? { ...p, name: newName } : p)
  //   );
  // }

  // private handlePlayerRoleChange(playerId: string, newRole: PlayerRole): void {
  //   this._players.update(players =>
  //     players.map(p => p.id === playerId ? { ...p, role: newRole } : p)
  //   );
  // }

  // private handleStoryCreated(story: StoryDTO): void {
  //   console.log("UpdateSttory handle");
  //   this._stories.update(stories => [...stories, story]);
  // }

  // private handleStoryUpdated(updatedStory: StoryDTO): void {
  //   console.log("Story Update");
  //   this._stories.update(stories =>
  //     stories.map(s => s.id === updatedStory.id ? updatedStory : s)
  //   );
  // }

  // private handleStoryDeleted(storyId: string): void {
  //   this._stories.update(stories =>
  //     stories.filter(s => s.id !== storyId)
  //   );
  // }

  // private handleVoteStarted(session: VoteSessionDTO, story: StoryDTO): void {
  //   this._voteSession.set(session);
  //   this._room.update(room => room ? { ...room, currentStory: story } : null);
  // }

  // private handleVotesCleared(sessionId: string): void {
  //   this._voteSession.update(session =>
  //     session?.id === sessionId ? { ...session, votes: [] } : session
  //   );
  // }

  // private handleShowVotes(votes: VoteDTO[]): void {
  //   this._voteSession.update(session =>
  //     session ? { ...session, votes, revealed: true } : null
  //   );
  // }

  // private handleVoteEnded(finalValue: string): void {
  //   this._voteSession.update(session =>
  //     session ? { ...session, status: SessionStatus.COMPLETED, finalValue } : null
  //   );

  //   // this._stories.update(stories => 
  //   //   stories.map(s => 
  //   //     s.id === this.currentStory()?.id 
  //   //       ? {...s, finalResult: finalValue, status: StoryStatus.COMPLETED} 
  //   //       : s
  //   //   )
  //   // );
  // }

  // // Region: Helper methods
  // getPlayer(playerId: string): PlayerDTO | undefined {
  //   return this.players().find(p => p.id === playerId);
  // }

  // getStory(storyId: string): StoryDTO | undefined {
  //   return this.stories().find(s => s.id === storyId);
  // }

  // getCurrentVotes(): VoteDTO[] {
  //   return this.voteSession()?.votes || [];
  // }

  // hasVoted(playerId: string): boolean {
  //   return this.getCurrentVotes().some(v => v.userId === playerId);
  // }


  // joinRoom(roomId: string): void {
  //   this.ws.connect(roomId);
  // }

  // //TODO
  // // updatePlayerName(playerId: string, name: string): void{
  // //   this.ws.send({
  // //     type: 'changeName',
  // //     playerId: playerId,
  // //     newName: name
  // //   });
  // // }

  // createStory(name: string): void {
  //   this.ws.send({
  //     type: 'createStory',
  //     name: name
  //   });
  // }

  // updateStory(storyId: string, name: string): void {
  //   this.ws.send({
  //     type: 'updateStory',
  //     storyId: storyId,
  //     name: name
  //   });
  // }

  // deleteStory(storyId: string): void {
  //   this.ws.send({
  //     type: 'deleteStory',
  //     storyId: storyId
  //   });
  // }

  // startVoting(): void {
  //   this.ws.send({
  //     type: 'startVote'
  //   });
  // }

  // submitVote(cardValue: string): void {
  //   const sessionId = this.voteSession()?.id;
  //   if (sessionId) {
  //     this.ws.send({
  //       type: 'addVote',
  //       sessionId: sessionId,
  //       cardValue: cardValue
  //     });
  //   }
  // }

  // revealVotes(): void {
  //   const sessionId = this.voteSession()?.id;
  //   if (sessionId) {
  //     this.ws.send({
  //       type: 'showVotes',
  //       sessionId: sessionId
  //     });
  //   }
  // }

  // clearVotes(): void {
  //   const sessionId = this.voteSession()?.id;
  //   if (sessionId) {
  //     this.ws.send({
  //       type: 'clearVotes',
  //       sessionId: sessionId,
  //     });
  //   }
  // }

  // skipStory(): void {
  //   const sessionId = this.voteSession()?.id;
  //   const storyId = this.voteSession()?.storyId;
  //   if (sessionId && storyId) {
  //     this.ws.send({
  //       type: 'skipVote',
  //       sessionId: sessionId,
  //       storyId: storyId
  //     });
  //   }
  // }

  // endVoteSession(finalValue: string): void {
  //   const sessionId = this.voteSession()?.id;
  //   if (sessionId) {
  //     this.ws.send({
  //       type: 'endVoteSession',
  //       sessionId: sessionId,
  //       finalValue: finalValue
  //     });
  //   }
  // }

  
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