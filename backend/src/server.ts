import express, { Express, Request, Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
const cors = require("cors");

const app: Express = express();
const server = createServer(app);

interface GameState {
  players: string[];
  board: string[][];
  currentPlayer: string;
  winner: string | null;
}

const games: Record<string, GameState> = {};

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("hello");
});

io.on("connection", (socket) => {
  console.log("socket connected");

  socket.on("createGame", ({ roomId, playerName }) => {
    // Create the room and initialize the game state
    socket.join(roomId);
    games[roomId] = {
      players: [playerName],
      board: [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
      ],
      currentPlayer: "X",
      winner: null,
    };
    console.log(`Game created with room ID: ${roomId}`);
  });

  socket.on("joinGame", ({ roomId, playerName }, callback) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    if (room) {
      // If the room exists and has less than 2 players, join the room
      if (games[roomId].players.length < 2) {
        socket.join(roomId);
        games[roomId].players.push(playerName);
        callback({ success: true });
        console.log(`Player ${playerName} joined room ID: ${roomId}`);

        // Start the game when both players have joined
        if (games[roomId].players.length === 2) {
          io.to(roomId).emit("startGame", { board: games[roomId].board });
        }
      } else {
        callback({ success: false, message: "Room is full" });
      }
    } else {
      // If the room doesn't exist, return an error
      callback({ success: false, message: "Room ID does not exist" });
    }
  });

  socket.on(
    "makeMove",
    ({ roomId, row, col }: { roomId: string; row: number; col: number }) => {
      const game = games[roomId];
      if (!game || game.board[row][col] !== "" || game.winner) return;

      // Update the board if it's the current player's turn
      if (socket.id === game.players[game.currentPlayer === "X" ? 0 : 1]) {
        game.board[row][col] = game.currentPlayer;
        game.currentPlayer = game.currentPlayer === "X" ? "O" : "X";

        // Check for win or draw
        if (checkWin(game.board)) {
          game.winner = game.currentPlayer === "X" ? "O" : "X";
          io.to(roomId).emit("gameOver", {
            winner: game.winner,
            board: game.board,
          });
        } else if (isDraw(game.board)) {
          io.to(roomId).emit("gameOver", { winner: null, board: game.board }); // Game is a draw
        } else {
          io.to(roomId).emit("updateBoard", {
            board: game.board,
            currentPlayer: game.currentPlayer,
          });
        }
      }
    }
  );
});

// Check if there's a winner
const checkWin = (board: string[][]): boolean => {
  const winPatterns = [
    [
      [0, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [2, 0],
      [2, 1],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 2],
      [1, 2],
      [2, 2],
    ],
    [
      [0, 0],
      [1, 1],
      [2, 2],
    ],
    [
      [0, 2],
      [1, 1],
      [2, 0],
    ],
  ];

  return winPatterns.some((pattern) => {
    const [a, b, c] = pattern;
    return (
      board[a[0]][a[1]] &&
      board[a[0]][a[1]] === board[b[0]][b[1]] &&
      board[a[0]][a[1]] === board[c[0]][c[1]]
    );
  });
};

// Check if the game is a draw
const isDraw = (board: string[][]): boolean => {
  return board.flat().every((cell) => cell !== "");
};

// Start the server
server.listen(3000, () => console.log("Server started at port: 3000"));