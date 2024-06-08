import PlayingCard from "./PlayingCard";
import { socket } from "../context/socket";
import { GameData } from "../types/gameData";

interface GameBoardProps {
  roomCode: string;
  gameData: GameData;
  isGameInProgress: boolean;
}

const GameBoard = (props: GameBoardProps) => {
  const handStyles = {
    display: "flex",
    justifyContent: "center",
  };

  const handleCurrentPlayerCardClick = (e: React.MouseEvent) => {
    socket.emit("send_message", { message: "test", roomCode: "23" });
    const cardKey = e.currentTarget.getAttribute("data-key");

    if (cardKey) {
      console.log("Card clicked: ", cardKey);
    }
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
            height={card.height}
          />
        ))}
      </div>
      Trump Card
      <div style={handStyles}>
        <PlayingCard
          key={props.gameData.trumpCard.key}
          suit={props.gameData.trumpCard.suit}
          rank={props.gameData.trumpCard.rank}
          height={props.gameData.trumpCard.height}
        />
      </div>
      In Play
      <div style={handStyles}>
        {props.gameData.cardsInPlay.map((card) => (
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
        {props.gameData.currentPlayerHand.map((card) => (
          <PlayingCard
            key={card.key}
            handleClick={handleCurrentPlayerCardClick}
            suit={card.suit}
            rank={card.rank}
            height={card.height}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
