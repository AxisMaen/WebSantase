import { ClientGameData } from "./GameData";

export interface PlayTurnRequest extends ClientGameData {
  playedCard: Card;
}

export interface PlayTurnResponse extends ClientGameData {
  error?: string;
}

interface Card {
  key: string;
  rank: string;
  suit: string;
}
