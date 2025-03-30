import { CardValue } from "../../types";

export interface RoomSettings {
    maxPlayers: number;
    allowObservers: boolean;
    cardSet: CardValue[];
  }