import { CardType } from "../../types";


export interface RoomCardConfig {
  allowCustomValues: boolean;
  defaultSet: CardType;
  hiddenUntilReveal: boolean;
}

export interface RoomSettings {
    requireAuth: boolean;
    allowSpectators: boolean;
    maxParticipants: number;
    votingTimeLimit: number;
    allowRevotes: boolean;
    hideResultsUntilEnd: boolean;
  }