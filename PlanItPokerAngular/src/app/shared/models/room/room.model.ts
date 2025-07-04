
import { CardType, CardValue } from "../../types";
import { Story } from "../story";
import { Player } from "./player.model";

export interface Room {
    id: string;
    name: string;
    startTime?: Date;
    cardType: CardType;
    cards: CardValue[];
    players: Player[];
    stories?: Story[];
    inviteLink: string;
  }
