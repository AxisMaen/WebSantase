import React, { useState } from "react";
import "./App.css";
import { PlayingCard } from "./components/PlayingCard";

interface CardProperties {
  key: string;
  rank: string;
  suit: string;
  height: string;
}

const App = () => {
  const handStyles = {
    display: "flex",
    justifyContent: "center",
  };

  const ranks = ["9", "T", "J", "Q", "K", "A"];
  const suits = ["h", "d", "c", "s"];

  // create deck of card components for the game
  // TODO: we need to shuffle the deck
  let initialDeck: CardProperties[] = [];
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

  const [playerOneHand, setPlayerOneHand] = useState<CardProperties[]>(
    initialDeck.slice(0, 6)
  );
  const [playerTwoHand, setPlayerTwoHand] = useState<CardProperties[]>(
    initialDeck.slice(6, 12)
  );
  const [trumpCard, setTrumpCard] = useState<CardProperties>(initialDeck[12]);
  const [cardsInPlay, setCardsInPlay] = useState<CardProperties[]>([]);
  const [deck, setDeck] = useState<CardProperties[]>(
    initialDeck.slice(13, initialDeck.length)
  );

  const handleCardClick = (e: React.MouseEvent) => {
    const cardKey = e.currentTarget.getAttribute("data-key");

    // TODO: game logic will go here, we should probably put this in a component or something somehow

    // find the location of the clicked card
    if (cardKey) {
      if (playerOneHand.map((card) => card.key).includes(cardKey)) {
        const cardIndex = playerOneHand.findIndex(
          (card) => cardKey === card.key
        );
        const card = playerOneHand[cardIndex];

        // remove clicked card from hand
        const newHand = [
          ...playerOneHand.slice(0, cardIndex),
          ...playerOneHand.slice(cardIndex + 1, playerOneHand.length),
        ];

        setPlayerOneHand(newHand);
        setCardsInPlay(cardsInPlay.concat(card));
      } else if (playerTwoHand.map((card) => card.key).includes(cardKey)) {
        const cardIndex = playerTwoHand.findIndex(
          (card) => cardKey === card.key
        );
        const card = playerTwoHand[cardIndex];

        // remove clicked card from hand
        const newHand = [
          ...playerTwoHand.slice(0, cardIndex),
          ...playerTwoHand.slice(cardIndex + 1, playerTwoHand.length),
        ];

        setPlayerTwoHand(newHand);
        setCardsInPlay(cardsInPlay.concat(card));
      }
    }
  };

  return (
    <div className="App">
      Player 2
      <div style={handStyles}>
        {playerTwoHand.map((card) => (
          <PlayingCard
            key={card.key}
            handleClick={handleCardClick}
            suit={card.suit}
            rank={card.rank}
            height={card.height}
          />
        ))}
      </div>
      Trump Card
      <div style={handStyles}>
        <PlayingCard
          key={trumpCard.key}
          suit={trumpCard.suit}
          rank={trumpCard.rank}
          height={trumpCard.height}
        />
      </div>
      In Play
      <div style={handStyles}>
        {cardsInPlay.map((card) => (
          <PlayingCard
            key={card.key}
            suit={card.suit}
            rank={card.rank}
            height={card.height}
          />
        ))}
      </div>
      Player 1
      <div style={handStyles}>
        {playerOneHand.map((card) => (
          <PlayingCard
            key={card.key}
            handleClick={handleCardClick}
            suit={card.suit}
            rank={card.rank}
            height={card.height}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
