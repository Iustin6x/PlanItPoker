
import { UUID } from '../../types';
import { GuestSession } from '../guest/guest.model';
import { UserRole } from './user-role.enum';

export interface User {
  id: UUID;
  email: string;
  roles: UserRole[];
  originalGuestId?: UUID;
  history: {
    guestActivities: GuestSession['history'];
    ownedRooms: UUID[];
    moderatedRooms: UUID[];
  };
  createdAt: Date;
}