import { UUID } from '../types/uuid.type';
import { v4 as uuidv4 } from 'uuid';

export function generateUUID(): UUID {
  return uuidv4() as UUID;
}

export function isUUID(value: string): value is UUID {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}