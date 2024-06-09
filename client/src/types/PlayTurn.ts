import { GameData } from "./GameData";

export interface PlayTurnRequest extends GameData {
  playedCard: Card;
}

export interface PlayTurnResponse extends GameData {
  error?: string;
}

interface Card {
  key: string;
  rank: string;
  suit: string;
}
