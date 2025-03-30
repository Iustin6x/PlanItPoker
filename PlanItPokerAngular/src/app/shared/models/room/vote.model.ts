import { CardValue, UUID } from "../../types";

export enum VoteStatus {
    Pending = 'pending',
    Active = 'active',
    Complete = 'complete',
    Skipped = 'skipped'
  }
  
  export interface Vote {
    id: string;
    userId: string;
    storyId: string;
    sessionId: string;
    cardValue: string;
    createdAt: Date;
    isRevealed: boolean;
    status: VoteStatus;
  }

