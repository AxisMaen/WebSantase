export interface Card {
  key: string;
  rank: string;
  suit: string;
  height: string;
}

export interface GameDataResponse {
  playerOneHand: Card[];
  playerTwoHand: Card[];
  trumpCard: Card;
  cardsInPlay: Card[];
  deck: Card[];
}
