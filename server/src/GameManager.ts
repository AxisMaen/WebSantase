import { Card, GameData } from "@client/types/gameData";

export namespace GameManager {
  export function createNewGame(): GameData {
    const ranks = ["9", "T", "J", "Q", "K", "A"];
    const suits = ["h", "d", "c", "s"];

    // create deck of card components for the game
    // TODO: we need to shuffle the deck
    let initialDeck: Card[] = [];
    for (const rank of ranks) {
      for (const suit of suits) {
        initialDeck.push({
          key: rank + suit,
          suit: suit,
          rank: rank,
          height: "150px",
        });
      }
    }

    return {
      currentPlayerHand: initialDeck.slice(0, 6),
      opponentPlayerHand: initialDeck.slice(6, 12),
      trumpCard: initialDeck[12],
      cardsInPlay: [],
      deck: initialDeck.slice(13, initialDeck.length),
    };
  }
}
