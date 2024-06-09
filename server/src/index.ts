import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import {
  PlayerTurnRequest,
  PlayerTurnResponse,
} from "@client/types/PlayerTurn";
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
      // TODO: need to leave old room if applicable
      if (users.size === 1) {
        // get user already in room before adding new user
        const [firstUser] = users;
        socket.join(data.roomCode);

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
      response = { message: `Joined room ${data.roomCode}` };
      callback(response);
      return;
    }
  });

  socket.on("player_turn", (data: PlayerTurnRequest): PlayerTurnResponse => {
    // we need to verify that the turn is a valid move
    // we could try and verify that the card is in the player's hand (prevent cheating) but idk how to do this

    // move card out of current players hand and into in play
    const cardIndex = data.currentPlayerHand.findIndex(
      (card) => data.card.key === card.key
    );

    const newCurrentPlayerHand = [
      ...data.currentPlayerHand.slice(0, cardIndex),
      ...data.currentPlayerHand.slice(
        cardIndex + 1,
        data.currentPlayerHand.length
      ),
    ];

    const newCardsInPlay = data.cardsInPlay.concat(data.card);

    return {
      isValidMove: true,
      deck: data.deck,
      trumpCard: data.trumpCard,
      cardsInPlay: newCardsInPlay,
      playerOneHand: newCurrentPlayerHand,
      playerTwoHand: data.opposingPlayerHand,
    };
  });
});

server.listen(3001, () => {
  console.log("hello from the server");
});
