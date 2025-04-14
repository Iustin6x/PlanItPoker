import { UUID } from "crypto";
import { CardValue } from "../../types";


export enum PlayerRole {
    PLAYER = 'PLAYER',
    OBSERVER = 'OBSERVER',
    MODERATOR = 'MODERATOR'
  }
  
  export interface Player {
    id: UUID;
    roomId: string;
    userId: string;
    name: string;
    avatar?: string;
    role: PlayerRole;
    hasVoted: boolean;
    isConnected: boolean;
    vote?: CardValue;
  }