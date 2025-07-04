
import { CardValue, UUID } from "../../types";


export interface VotingSession {
    id: UUID;
    roomId: UUID;
    storyId: UUID;
    startTime: Date;
    endTime?: Date;
    status: 'pending' | 'active' | 'completed';
    votes: Record<UUID, CardValue>;
    revealed: boolean;
  }

export enum SessionStatus {
    PENDING = 'PENDING',
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED'
  }

  export interface VoteSession {
    storyId: UUID;
    roomId: UUID;
    startTime: Date;
    endTime?: Date;
    status: 'PENDING' | 'ACTIVE' | 'COMPLETED' ;
    votes: Record<UUID, CardValue>;
    revealed: boolean;
  }