
import { CardType, CardValue } from "../../types";
import { PlayerRole } from "./player.model";

export interface RoomListDTO {
    id: string;
    name: string;
    cardType: CardType;
    cards: CardValue[];
    lastVotedStory?: string;
    totalPoints?: number;
    inviteLink?: string;
    userRole?: PlayerRole;
    lastActionTime?: Date;
  }

  export interface RoomSettingsDTO {
    allowQuestionMark: boolean;
    allowVoteModification: boolean;
  }
  
  export interface RoomRequestDTO {
    id?: string;
    name: string;
    cardType: CardType;
    cards: CardValue[];
    roomSettings: RoomSettingsDTO;
  }



