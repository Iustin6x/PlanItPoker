// src/app/shared/models/room.model.ts
import { CardType } from '../types/card-type';

export interface Room {
    id?: string;
    name: string;
    cardType: CardType;
    customCards: (number | string)[];
    createdAt: Date;
    
}