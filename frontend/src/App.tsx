import { useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";
import "./App.css";
interface GameState {
  board: string[][];
  currentPlayer: string;
}
const socket: Socket = io("http://localhost:3000");

function App() {
  const [roomId, setRoomId] = useState<string>("");
  const [gameState, setGameState] = useState<GameState>({
    board: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    currentPlayer: "X",
  });
  console.log("room_id", roomId);
  useEffect(() => {
    socket.on("connect", () => {
      console.log(socket.connected); // true
      setRoomId(Math.random().toString(36).substring(2, 9));
    });
    socket.emit("joinGame", { roomId });

    socket.on("startGame", ({ board }) => {
      setGameState((prevState) => ({ ...prevState, board }));
    });

    return () => {
      socket.off("startGame");
    };
  }, [roomId]);

  return (
    <div>
      <h1>Tic-tac-toe</h1>
    </div>
  );
}

export default App;