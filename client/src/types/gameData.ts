export interface Card {
  key: string;
  rank: string;
  suit: string;
  height: string;
}

export interface GameData {
  currentPlayerHand: Card[];
  opponentPlayerHand: Card[];
  trumpCard: Card;
  cardsInPlay: Card[];
  deck: Card[];
}
