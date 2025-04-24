import { CardType, CardValue } from "../../types";
import { SessionStatus } from "../room";
import { Player, PlayerRole } from "../room/player.model";
import { StoryStatus } from "../story";



  export type WSMessage = ClientMessage | ServerMessage;

  export type ClientMessage =
    | { type: 'join', roomId: string }
    | { type: 'changeName', playerId: string, newName: string }
    | { type: 'changeRole', playerId: string, newRole: PlayerRole }
    | { type: 'deleteStory', storyId: string }
    | { type: 'createStory', name: string }
    | { type: 'getStoryWithSession', storyId: string }
    | { type: 'updateStory', storyId: string, name: string }
    | { type: 'updateStoryOrder', storyId: string, newOrder: string }
    | { type: 'startVote' }
    | { type: 'addVote', sessionId: string, cardValue: CardValue }
    | { type: 'revealVotes', sessionId: string }
    | { type: 'clearVotes', sessionId: string }
    | { type: 'skipVote', sessionId: string, storyId: string }
    | { type: 'endVoteSession', sessionId: string, finalValue: string };
  
  export type ServerMessage =
    | { type: 'error', message: string }
    | { type: 'playerJoined', player: PlayerDTO }
    | { type: 'playerDisconnected', player: PlayerDTO }
    | { type: 'playerNameChanged', playerId: string, newName: string }
    | { type: 'playerRoleChanged', playerId: string, newRole: PlayerRole }
    | { type: 'playerList', players: PlayerDTO[] }
    | { type: 'storyCreated', story: StoryDTO }
    | { type: 'storyUpdated', story: StoryDTO }
    | { type: 'storyWithSession', story: StoryDTO, session: VoteSessionDTO}
    | { type: 'storyDeleted', storyId: string }
    | { type: 'storyList', stories: StoryDTO[] }
    | { type: 'voteSession', session: VoteSessionDTO }
    | { type: 'voteStarted', session: VoteSessionDTO }
    | { type: 'voteAdded', vote: VoteDTO }
    | { type: 'votesRevealed', votes: VoteDTO[], result: string | null }
    | { type: 'votesCleared', sessionId: string }
    | { type: 'voteEnded', sessionId: string, finalValue: string, story: StoryDTO}
    | { type: 'roomInfo', room: RoomInfoDTO }
    | { type: 'storySkipped', story: StoryDTO, session?: VoteSessionDTO }
    | { type: 'noPlayers'}
    | { type: 'noStories'}
    | { type: 'noActiveVoteSession' }
  


  export interface PlayerDTO {
    id: string; // UUID
    userId: string;
    name: string;
    hasVoted: boolean;
    vote: string | null;
    connected: boolean;
    role: PlayerRole;
  }

  export interface StoryDTO {
    id: string;
    name: string;
    finalResult: string | null;
    status: StoryStatus;
  }

  export interface VoteDTO {
    id: string;
    userId: string;
    sessionId: string;
    cardValue: string;
  }



export interface VoteSessionDTO {
  id: string;
  startTime: string; 
  endTime: string;
  status: SessionStatus; 
  revealed: boolean;
  storyId: string;
  roomId: string;
  votes: VoteDTO[];
  result: string | null;
}

export interface RoomInfoDTO{
  name: string;
  cardType: CardType;
  customCards: CardValue[];
}
  