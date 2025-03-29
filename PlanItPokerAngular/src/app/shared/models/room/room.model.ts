import { CardType, CardValue } from '../../types/card-type';
import { UUID } from '../../types/uuid.type';
import { RoomSettings } from './room-settings.model';
import { RoomStatus } from './room-status.enum';
import { VotingSession } from './voting-session.model';

export interface Room {
  id: UUID;
  name: string;
  cardType: CardType;
  customCards?: CardValue[];
  adminIds: UUID[];
  participants: UUID[];
  currentStoryId?: UUID;
  votingSessions: VotingSession[];
  status: RoomStatus;
  settings: RoomSettings;
  createdAt: Date;
  updatedAt: Date;
}