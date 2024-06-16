import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { PlayTurnRequest, PlayTurnResponse } from "@client/types/PlayTurn";
import { JoinRoomRequest, RoomEventResponse } from "@client/types/JoinRoom";
import { GameManager } from "./GameManager";
import { ClientGameData, GameState } from "@client/types/GameData";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// key = room code
// Holds the game state for every active game.
// If a player in a game disconnects, remove the game from the map.
// Eventually, the goal is that when a client reconnects, it can recreate the game state from this.
const activeGames = new Map<string, GameState>();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnecting", (reason) => {
    // TODO: using the room code and clientId, set the player to disconnected in the map.
    // If both players in the active game have disconnected, remove key from map
    // This will allow players to reconnect and resume the game if possible.

    // remove active game and emit event to players if needed
    const gameState = activeGames.get(socket.data.roomCode);
    if (gameState) {
      const otherPlayer =
        gameState?.player1Id === socket.id
          ? gameState.player2Id
          : gameState.player1Id;

      activeGames.delete(socket.data.roomCode);
      socket.emit("user_disconnected", {});
      socket.to(otherPlayer).emit("opponent_disconnected", {});
    }
  });

  socket.on("leave_room", (data, callback) => {
    const roomCode = socket.data.roomCode;
    socket.leave(roomCode);
    delete socket.data.roomCode;
    const response: RoomEventResponse = { message: `Left room ${roomCode}}` };
    callback(response);
  });

  socket.on("join_room", (data: JoinRoomRequest, callback) => {
    let response: RoomEventResponse;

    const users = io.sockets.adapter.rooms.get(data.roomCode);

    // only join the room if it has less than 2 players
    if (users) {
      if (users.size >= 2) {
        // room is full
        response = {
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

        // join room and set the room code to socket data so we can use it in other functions
        socket.join(data.roomCode);
        socket.data.roomCode = data.roomCode;

        const newGameData = GameManager.createNewGame();

        // make the first user in the room have the first turn
        activeGames.set(data.roomCode, {
          player1Id: firstUser,
          player2Id: socket.id,
          currentTurnId: firstUser,
        });

        // send game data to players, swap client data as needed for other player's view
        socket
          .to(data.roomCode)
          .emit("new_game", newGameData as ClientGameData);
        socket.emit("new_game", {
          ...newGameData,
          currentPlayerHand: newGameData.opponentPlayerHand,
          opponentPlayerHand: newGameData.currentPlayerHand,
          isCurrentPlayerTurn: !newGameData.isCurrentPlayerTurn,
        } as ClientGameData);
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
      const gameState = activeGames.get(socket.data.roomCode);

      if (!gameState) {
        // game no longer exists, end the game on the client
        // TODO: emit message to client that game has ended
        return;
      }

      if (socket.id != gameState.currentTurnId) {
        // not this player's turn, do not make a move
        const response = {
          error: "Out of turn",
          ...data,
        };
        socket.emit("receive_turn", response as PlayTurnResponse);
        return;
      }

      // it is the current player's turn, so perform their move
      const newGameData = GameManager.doTurn(data);

      // swap player turns since move has been made
      activeGames.set(socket.data.roomCode, {
        ...gameState,
        currentTurnId:
          socket.id === gameState.player1Id
            ? gameState.player2Id
            : gameState.player1Id,
      });

      // send game data to players, swap client data as needed for other player's view
      socket.to(socket.data.roomCode).emit("receive_turn", {
        ...newGameData,
        currentPlayerHand: newGameData.opponentPlayerHand,
        opponentPlayerHand: newGameData.currentPlayerHand,
        isCurrentPlayerTurn: !newGameData.isCurrentPlayerTurn,
      } as ClientGameData);
      socket.emit("receive_turn", newGameData);
      return;
    } catch {
      // invalid turn, do not change game state
      const response = {
        error: "Invalid turn",
        ...data,
      };
      socket.emit("receive_turn", response as PlayTurnResponse);
    }
  });
});

server.listen(3001, () => {
  console.log("hello from the server");
});
