import { UUID } from "crypto";
import { CardType, CardValue } from "../../types";

export interface RoomDialogDTO {
    id?: UUID;
    name: string;
    ownerID?: UUID;
    cardType: CardType;
    cards: CardValue[];
  }