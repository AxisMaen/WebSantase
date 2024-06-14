import PlayingCard from "../PlayingCard/PlayingCard";
import { socket } from "../../context/socket";
import { Card, ClientGameData } from "../../types/GameData";
import { useState } from "react";
import { PlayTurnRequest } from "../../types/PlayTurn";

interface GameBoardProps {
  gameData: ClientGameData;
  isGameInProgress: boolean;
}

// may need to make this configurable if we want cards to be different sizes
const CARDHEIGHT = "150px";

const GameBoard = (props: GameBoardProps) => {
  const [selectedCard, setSelectedCard] = useState<Card>({
    key: "",
    suit: "",
    rank: "",
  });

  const handStyles = {
    display: "flex",
    justifyContent: "center",
  };

  const handleCurrentPlayerCardClick = (e: React.MouseEvent) => {
    const cardKey = e.currentTarget.getAttribute("data-key");

    // verify the card is in the player's hand and set the selectedCard state
    // TODO: if the clicked card is already selected, we should deselect it
    if (
      cardKey &&
      props.gameData.currentPlayerHand.map((card) => card.key).includes(cardKey)
    ) {
      const cardIndex = props.gameData.currentPlayerHand.findIndex(
        (card) => cardKey === card.key
      );

      setSelectedCard(props.gameData.currentPlayerHand[cardIndex]);
    }
  };

  const handlePlayCard = (e: React.MouseEvent) => {
    const turnData: PlayTurnRequest = {
      playedCard: selectedCard,
      ...props.gameData,
    };
    socket.emit("play_turn", turnData);
  };

  if (!props.isGameInProgress) {
    return null;
  }
  return (
    <div>
      Player 2
      <div style={handStyles}>
        {props.gameData.opponentPlayerHand.map((card) => (
          <PlayingCard
            key={card.key}
            suit={card.suit}
            rank={card.rank}
            height={CARDHEIGHT}
            isFaceUp={false}
            selected={false}
          />
        ))}
      </div>
      Trump Card
      <div style={handStyles}>
        <PlayingCard
          key={props.gameData.trumpCard.key}
          suit={props.gameData.trumpCard.suit}
          rank={props.gameData.trumpCard.rank}
          height={CARDHEIGHT}
          isFaceUp={true}
          selected={false} // TODO: eventualy we might need to make this selectable for the game rules
        />
      </div>
      In Play
      <div style={handStyles}>
        {props.gameData.cardsInPlay.map((card) => (
          <PlayingCard
            key={card.key}
            suit={card.suit}
            rank={card.rank}
            height={CARDHEIGHT}
            isFaceUp={true}
            selected={false}
          />
        ))}
      </div>
      Player 1
      <div style={handStyles}>
        {props.gameData.currentPlayerHand.map((card) => {
          const isSelectedCard = card.key === selectedCard.key;
          return (
            <PlayingCard
              key={card.key}
              handleClick={handleCurrentPlayerCardClick}
              suit={card.suit}
              rank={card.rank}
              height={CARDHEIGHT}
              isFaceUp={true}
              selected={isSelectedCard}
            />
          );
        })}
      </div>
      <button onClick={handlePlayCard}>Play Card</button>
    </div>
  );
};

export default GameBoard;
