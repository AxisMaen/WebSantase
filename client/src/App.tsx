import "./App.css";
import { io } from "socket.io-client";
import GameBoard from "./components/GameBoard";
import { useEffect, useState } from "react";
import { JoinRoomResponse } from "./types/joinRoom";
import { GameDataResponse } from "./types/gameData";

const socket = io("http://localhost:3001");

const App = () => {
  const [message, setMessage] = useState("");
  const [roomCode, setRoomCode] = useState("");

  const [receivedMessage, setReceivedMessage] = useState("");

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

    socket.on("new_game", (data: GameDataResponse) => {
      console.log("New game starting: ", data);
    });
  }, []);

  return (
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
      <GameBoard />
    </div>
  );
};

export default App;
