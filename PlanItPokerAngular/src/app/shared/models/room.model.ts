import { CardType } from "../types/card-type";

export interface Room {
    id?: string;
    name: string;
    cardType: CardType;
    customCards: string[];
    createdAt: Date;
  }