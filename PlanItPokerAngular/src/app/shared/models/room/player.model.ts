import { UUID } from "crypto";
import { CardValue } from "../../types";
import { UserRole } from "../user";

export enum PlayerRole {
    PLAYER = 'player',
    OBSERVER = 'observer',
    MODERATOR = 'moderator'
  }
  
  export interface Player {
    roomId: string;
    userId: string;
    name: string;
    role: PlayerRole;
    hasVoted: boolean;
    isConnected: boolean;
  }