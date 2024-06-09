import PlayingCard from "../PlayingCard/PlayingCard";
import { socket } from "../../context/socket";
import { GameData } from "../../types/GameData";
import { useState } from "react";

interface GameBoardProps {
  roomCode: string;
  gameData: GameData;
  isGameInProgress: boolean;
}

// may need to make this configurable if we want cards to be different sizes
const CARDHEIGHT = "150px";

const GameBoard = (props: GameBoardProps) => {
  const [selectedCardKey, setSelectedCardKey] = useState<string>("");

  const handStyles = {
    display: "flex",
    justifyContent: "center",
  };

  const handleCurrentPlayerCardClick = (e: React.MouseEvent) => {
    const cardKey = e.currentTarget.getAttribute("data-key");

    if (cardKey) {
      setSelectedCardKey(cardKey);
    }
  };

  const handlePlayCard = (e: React.MouseEvent) => {
    // TODO: send event to server with data on card that is clicked to make a move
    socket.emit("send_message", { message: "test", roomCode: props.roomCode });
    console.log("selected card: ", selectedCardKey);
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
          const isSelectedCard = card.key === selectedCardKey;
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
