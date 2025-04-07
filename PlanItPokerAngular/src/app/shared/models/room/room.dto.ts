import { UUID } from "crypto";
import { CardType, CardValue } from "../../types";
import { PlayerRole } from "./player.model";

export interface RoomDialogDTO {
    id?: UUID;
    name: string;
    cardType: CardType;
    cards: CardValue[];
    lastVotedStory?: string;
    totalPoints?: number;
    inviteLink?: string;
    userRole?: PlayerRole;
  }


