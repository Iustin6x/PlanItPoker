import { CardType } from "../types/card-type";

export interface Room {
    id?: string;
    name: string;
    cardType: CardType;
    participants?: string[];
  }