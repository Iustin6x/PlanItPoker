
import { Room } from '../models/room';
import { CardType } from '../types/card-type';

export function validateRoom(room: Partial<Room>): string[] {
  const errors: string[] = [];
  
  if (!room.name?.trim()) {
    errors.push('Room name is required');
  }

  return errors;
}

export function generateRoomId(): string {
  return crypto.randomUUID();
}