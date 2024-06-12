import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { PlayTurnRequest, PlayTurnResponse } from "@client/types/PlayTurn";
import { JoinRoomRequest, JoinRoomResponse } from "@client/types/JoinRoom";
import { GameManager } from "./GameManager";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("send_message", (data) => {
    socket.to(data.roomCode).emit("receive_message", data);
  });

  socket.on("join_room", (data: JoinRoomRequest, callback) => {
    let response: JoinRoomResponse;

    const users = io.sockets.adapter.rooms.get(data.roomCode);

    // only join the room if it has less than 2 players
    if (users) {
      if (users.size >= 2) {
        // room is full
        const response = {
          error: true,
          message: "Room is full",
        };

        callback(response);
        return;
      }

      // room is not full and we can join
      // TODO: need to leave old room if applicable (remember to change socket.data.roomCode)
      if (users.size === 1) {
        // get user already in room before adding new user
        const [firstUser] = users;

        // do not let the same user join a room twice
        if (firstUser === socket.id) {
          // TODO: we probably want some sort of callback here so the client can display a message
          return;
        }

        socket.join(data.roomCode);
        socket.data.roomCode = data.roomCode;

        const newGameData = GameManager.createNewGame();

        // send game data to players
        // switch hands for player 2 so each player has their own hand
        socket.to(data.roomCode).emit("new_game", newGameData);
        socket.emit("new_game", {
          ...newGameData,
          currentPlayerHand: newGameData.opponentPlayerHand,
          opponentPlayerHand: newGameData.currentPlayerHand,
        });
        return;
      }
    } else {
      // room has not been created yet
      // TODO: need to leave old room if applicable
      socket.join(data.roomCode);
      socket.data.roomCode = data.roomCode;

      response = { message: `Joined room ${data.roomCode}` };
      callback(response);
      return;
    }
  });

  socket.on("play_turn", (data: PlayTurnRequest) => {
    try {
      const newGameData = GameManager.doTurn(data);

      // send response to the correct players
      socket.emit("receive_turn", newGameData as PlayTurnResponse);
      socket.to(socket.data.roomCode).emit("receive_turn", {
        ...newGameData,
        currentPlayerHand: newGameData.opponentPlayerHand,
        opponentPlayerHand: newGameData.currentPlayerHand,
      } as PlayTurnResponse);
    } catch {
      // invalid turn, do not change game state
      const response = {
        error: "Invalid turn",
        ...data,
      };
      socket.emit("receive_turn", response as PlayTurnResponse);
      socket.to(socket.data.roomCode).emit("receive_turn", {
        ...response,
        currentPlayerHand: data.opponentPlayerHand,
        opponentPlayerHand: data.currentPlayerHand,
      } as PlayTurnResponse);
    }
  });
});

server.listen(3001, () => {
  console.log("hello from the server");
});
