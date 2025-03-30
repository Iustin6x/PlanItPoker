
import { UUID } from '../../types';
import { GuestSession } from '../guest/guest.model';
import { UserRole } from './user-role.enum';

export interface User {
    id: UUID;
    name: string;
    email?: string;
    isGuest: boolean;
    avatar?: string;
  }