import { CardType } from "../types/card-type";

export interface RoomData {
    name: string;
    cardType: CardType;
    participants?: string[];
  }