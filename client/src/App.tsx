import "./App.css";
import GameBoard from "./components/GameBoard";
import { useEffect, useState } from "react";
import { JoinRoomResponse } from "./types/joinRoom";
import { GameData } from "./types/gameData";
import { SocketContext, socket } from "./context/socket";

const App = () => {
  const [roomCode, setRoomCode] = useState("");
  const [message, setMessage] = useState("");
  const [receivedMessage, setReceivedMessage] = useState("");

  const [isGameInProgress, setIsGameInProgress] = useState<boolean>(false);
  const [gameData, setGameData] = useState<GameData>({
    currentPlayerHand: [],
    opponentPlayerHand: [],
    trumpCard: { key: "", rank: "", suit: "", height: "" },
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
        <GameBoard
          roomCode={roomCode}
          gameData={gameData}
          isGameInProgress={isGameInProgress}
        />
      </div>
    </SocketContext.Provider>
  );
};

export default App;
