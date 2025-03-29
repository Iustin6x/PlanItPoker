
import { CardValue, UUID } from "../../types";


export interface VotingSession {
  id: UUID;
  startTime: Date;
  endTime?: Date;
  votes: Record<UUID, CardValue>;
  average?: number;
  revealed: boolean;
}