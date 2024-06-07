export interface PlayerTurnRequest {
  card: Card;
  deck: Card[];
  trumpCard: Card;
  cardsInPlay: Card[];
  currentPlayerHand: Card[];
  opposingPlayerHand: Card[];
  playerId: string;
}

export interface PlayerTurnResponse {
  isValidMove: boolean;
  deck: Card[];
  trumpCard: Card;
  cardsInPlay: Card[];
  playerOneHand: Card[];
  playerTwoHand: Card[];
}

interface Card {
  key: string;
  rank: string;
  suit: string;
}
