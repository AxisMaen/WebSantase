import "./App.css";
import { io } from "socket.io-client";
import GameBoard from "./components/GameBoard";
import { useEffect, useState } from "react";

const socket = io("http://localhost:3001");

const App = () => {
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");

  const [receivedMessage, setReceivedMessage] = useState("");

  const sendMesssage = () => {
    socket.emit("send_message", { message: message, room: room });
  };

  const joinRoom = () => {
    if (room) {
      socket.emit("join_room", { roomCode: room });
    }
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setReceivedMessage(data.message);
    });
  }, []);

  return (
    <div className="App">
      <input
        placeholder="Room Number..."
        onChange={(event) => {
          setRoom(event.target.value);
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
