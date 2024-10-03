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
  socket.on("joinGame", ({ roomId }: { roomId: string }) => {
    console.log("roomid", roomId);
    // Join the room or create a new one
    if (!games[roomId]) {
      games[roomId] = {
        players: [socket?.id],
        board: [
          ["", "", ""],
          ["", "", ""],
          ["", "", ""],
        ],
        currentPlayer: "X",
        winner: null,
      };
    } else if (games[roomId].players.length < 2) {
      // Add a second player if the room exists
      games[roomId].players.push(socket.id);
      io.to(roomId).emit("startGame", { board: games[roomId].board });
    }
    socket.join(roomId);
    // Notify when room is full
    if (games[roomId].players.length === 2) {
      io.to(roomId).emit("startGame", { board: games[roomId].board });
    }
  });
});
server.listen(3000, () => console.log("server started.."));