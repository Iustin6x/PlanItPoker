import { UUID } from "crypto";
import { CardValue } from "../../types";
import { VoteSession, VotingSession } from "../room";

export enum StoryStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  SKIPPED = 'SKIPPED'
}

export interface Story {
  id: UUID;
  name: string;
  order?: number;
  roomId: UUID;
  status: StoryStatus;
  session?: VoteSession; 
  finalResult?: string;
}



// export interface Story {
//   id: UUID;
//   roomId: UUID;
//   title: string;
//   status: StoryStatus;
//   session: VotingSession; 
//   finalResult?: string;
// }
