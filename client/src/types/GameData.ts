export interface Card {
  key: string;
  rank: string;
  suit: string;
}

// passed to and from client so it can render the game state for the respective player
export interface ClientGameData {
  isCurrentPlayerTurn: boolean;
  currentPlayerHand: Card[];
  opponentPlayerHand: Card[];
  trumpCard: Card;
  cardsInPlay: Card[];
  deck: Card[];
}

// stored by the server to verify game state
export interface GameState {
  player1Id: string;
  player2Id: string;
  currentTurnId: string;
}
