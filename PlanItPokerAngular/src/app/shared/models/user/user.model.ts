
import { UUID } from '../../types';
import { GuestSession } from '../guest/guest.model';

export interface User {
    id: UUID;
    name: string;
    email?: string;
    isGuest: boolean;
    avatar?: string;
  }