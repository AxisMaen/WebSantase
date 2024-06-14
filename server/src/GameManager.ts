import { Card, ClientGameData } from "@client/types/GameData";
import { PlayTurnRequest } from "@client/types/PlayTurn";

export module GameManager {
  // returns client game data
  export function createNewGame(): ClientGameData {
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
        });
      }
    }

    return {
      isCurrentPlayerTurn: true,
      currentPlayerHand: initialDeck.slice(0, 6),
      opponentPlayerHand: initialDeck.slice(6, 12),
      trumpCard: initialDeck[12],
      cardsInPlay: [],
      deck: initialDeck.slice(13, initialDeck.length),
    };
  }

  // takes in turn data and outputs the client game data for the player who made the turn
  // throws an error if the turn is not valid
  export function doTurn(data: PlayTurnRequest): ClientGameData {
    /*
    throw Error;
    // TODO: verify that the turn is valid, throw error if not
    */

    // DEMO: move card out of current player's hand and into in play
    const cardIndex = data.currentPlayerHand.findIndex(
      (card) => data.playedCard.key === card.key
    );

    const newCurrentPlayerHand = [
      ...data.currentPlayerHand.slice(0, cardIndex),
      ...data.currentPlayerHand.slice(
        cardIndex + 1,
        data.currentPlayerHand.length
      ),
    ];

    const newCardsInPlay = data.cardsInPlay.concat(data.playedCard);

    return {
      isCurrentPlayerTurn: false,
      currentPlayerHand: newCurrentPlayerHand,
      opponentPlayerHand: data.opponentPlayerHand,
      trumpCard: data.trumpCard,
      cardsInPlay: newCardsInPlay,
      deck: data.deck,
    };
  }
}
