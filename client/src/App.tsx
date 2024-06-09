import "./App.css";
import GameBoard from "./components/GameBoard/GameBoard";
import { useEffect, useState } from "react";
import { JoinRoomResponse } from "./types/JoinRoom";
import { GameData } from "./types/GameData";
import { SocketContext, socket } from "./context/socket";
import { PlayTurnResponse } from "./types/PlayTurn";

const App = () => {
  const [roomCode, setRoomCode] = useState("");
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");

  const [isGameInProgress, setIsGameInProgress] = useState<boolean>(false);
  const [gameData, setGameData] = useState<GameData>({
    currentPlayerHand: [],
    opponentPlayerHand: [],
    trumpCard: { key: "", rank: "", suit: "" },
    cardsInPlay: [],
    deck: [],
  });

  const sendMesssage = () => {
    socket.emit("send_message", { message: message, roomCode: roomCode });
  };

  const joinRoom = () => {
    if (roomCode) {
      socket.emit(
        "join_room",
        { roomCode: roomCode },
        (response: JoinRoomResponse) => {
          console.log("Join room response: ", response);
        }
      );
    }
  };

  // receive messages emitted by socket.io
  useEffect(() => {
    socket.on("receive_message", (data) => {
      setReceivedMessage(data.message);
    });

    socket.on("new_game", (data: GameData) => {
      console.log("New game starting: ", data);
      setGameData(data);
      setIsGameInProgress(true);
    });

    socket.on("receive_turn", (data: PlayTurnResponse) => {
      // check if there was an error on the turn
      // update the board with new game state
      console.log("Setting new board: ", data);
      if (data.error) {
        console.log("INVALID TURN");
        return;
      }

      console.log("Setting new board: ", data);
      setGameData(data);
    });
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      <div className="App">
        <input
          placeholder="Room Number..."
          onChange={(event) => {
            setRoomCode(event.target.value);
          }}
        ></input>
        <button onClick={joinRoom}>Join Room</button>
        <input
          placeholder="Message..."
          onChange={(event) => {
            setMessage(event.target.value);
          }}
        ></input>
        <button onClick={sendMesssage}>Send Message</button>
        <h1>Message:</h1>
        {receivedMessage}
        <GameBoard gameData={gameData} isGameInProgress={isGameInProgress} />
      </div>
    </SocketContext.Provider>
  );
};

export default App;
