
import { UUID } from '../../types/uuid.type';
import { Room } from '../room/room.model';

export interface GuestSession {
  id: UUID;
  tempUserId: UUID;
  name: string;
  preferences: {
    theme: 'light' | 'dark';
    notifications: boolean;
  };
  history: {
    createdRooms: UUID[];
    participatedRooms: Room['id'][];
    votes: Record<UUID, string>;
  };
  convertedToUserId?: UUID;
  createdAt: Date;
}