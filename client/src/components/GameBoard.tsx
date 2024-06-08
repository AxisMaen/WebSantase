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
    // TODO: send event to server with data on card that is clicked to make a move
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
            isFaceUp={false}
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
          isFaceUp={true}
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
            isFaceUp={true}
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
            isFaceUp={true}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
