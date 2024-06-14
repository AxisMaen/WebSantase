import "./App.css";
import GameBoard from "./components/GameBoard/GameBoard";
import { useEffect, useState } from "react";
import { JoinRoomResponse } from "./types/JoinRoom";
import { ClientGameData } from "./types/GameData";
import { SocketContext, socket } from "./context/socket";
import { PlayTurnResponse } from "./types/PlayTurn";

const App = () => {
  const [roomCode, setRoomCode] = useState("");
  const [isGameInProgress, setIsGameInProgress] = useState<boolean>(false);
  const [gameData, setGameData] = useState<ClientGameData>({
    isCurrentPlayerTurn: false,
    currentPlayerHand: [],
    opponentPlayerHand: [],
    trumpCard: { key: "", rank: "", suit: "" },
    cardsInPlay: [],
    deck: [],
  });

  const joinRoom = () => {
    // TODO: we should make it impossible to join a new room once a game has started
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
    socket.on("new_game", (data: ClientGameData) => {
      console.log("New game starting: ", data);
      setGameData(data);
      setIsGameInProgress(true);
    });

    socket.on("receive_turn", (data: PlayTurnResponse) => {
      // check if there was an error on the turn
      // update the board with new game state
      if (data.error) {
        console.error("Turn error: ", data.error);
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
        <h1>Is My Turn?</h1>
        {gameData.isCurrentPlayerTurn ? "Yes" : "No"}
        <GameBoard gameData={gameData} isGameInProgress={isGameInProgress} />
      </div>
    </SocketContext.Provider>
  );
};

export default App;
