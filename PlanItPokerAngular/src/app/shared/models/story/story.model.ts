import { UUID } from "crypto";
import { CardValue } from "../../types";
import { VotingSession } from "../room";

export enum StoryStatus {
  ACTIVE = 'active',
  COMPLETED = 'completed',
  SKIPPED = 'skipped'
}

export interface Story {
  id: UUID;
  roomId: UUID;
  title: string;
  status: StoryStatus;
  sessions: VotingSession[]; // Istoric sesiuni
  currentSessionId?: UUID; // Sesiunea activă
  finalResult?: string;
}
