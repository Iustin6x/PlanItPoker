
import { CardValue, UUID } from "../../types";


export interface VotingSession {
    id: UUID;
    roomId: UUID;
    storyId: UUID;
    startTime: Date;
    endTime?: Date;
    status: 'pending' | 'active' | 'completed';
    votes: Record<UUID, CardValue>; // { [userId]: cardValue }
    revealed: boolean;
  }

export enum SessionStatus {
    Pending = 'pending',
    InProgress = 'inProgress',
    Completed = 'completed'
  }

  export interface VoteSession {
    storyId: UUID;
    roomId: UUID;
    startTime: Date;
    endTime?: Date;
    status: 'pending' | 'active' | 'completed' ;
    votes: Record<UUID, CardValue>; // { [userId]: cardValue }
    revealed: boolean;
  }