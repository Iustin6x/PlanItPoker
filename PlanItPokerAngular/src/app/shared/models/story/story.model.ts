
import { VoteSession, VotingSession } from "../room";

export enum StoryStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED'
}

export interface Story {
  id: string;
  name: string;
  order?: number;
  roomId: string;
  status: StoryStatus;
  session?: VoteSession; 
  finalResult?: string;
}

