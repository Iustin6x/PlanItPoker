
import { UUID } from '../../types/uuid.type';
import { Room } from '../room/room.model';

export interface GuestSession {
  id: UUID;
  name: string;
  convertedToUserId?: UUID;
}