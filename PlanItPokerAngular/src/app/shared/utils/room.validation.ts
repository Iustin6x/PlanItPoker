
import { Room } from '../models/room';
import { CardType } from '../types/card-type';

export function validateRoom(room: Partial<Room>): string[] {
  const errors: string[] = [];
  
  if (!room.name?.trim()) {
    errors.push('Room name is required');
  }

  if (room.cardType === 'custom' && (!room.customCards || room.customCards.length === 0)) {
    errors.push('Custom cards are required for custom card type');
  }

  if (room.adminIds?.length === 0) {
    errors.push('At least one admin is required');
  }

  return errors;
}

export function generateRoomId(): string {
  return crypto.randomUUID();
}