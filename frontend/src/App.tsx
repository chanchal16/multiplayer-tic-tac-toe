import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import "./App.css";
import { Board } from "./components/Board";
import { Form } from "./components/Form";
export interface GameState {
  board: string[][];
  currentPlayer: string;
}
const socket: Socket = io("http://localhost:3000");

function App() {
  const [gameState, setGameState] = useState<GameState>({
    board: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    currentPlayer: "X",
  });
  const [winner, setWinner] = useState<string | null>(null);
  const [mode, setMode] = useState<"new" | "join" | null>(null);
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);

  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log(socket.connected); // true
  //     setRoomId(Math.random().toString(36).substring(2, 9));
  //   });
  //   socket.emit("joinGame", { roomId });

  //   socket.on("startGame", ({ board }) => {
  //     setGameState((prevState) => ({ ...prevState, board }));
  //   });

  //   socket.on('updateBoard', ({ board, currentPlayer }) => {
  //     setGameState({ board, currentPlayer });
  //   });

  //   socket.on('gameOver', ({ winner, board }) => {
  //     setGameState((prevState) => ({ ...prevState, board }));
  //     setWinner(winner);
  //   });

  //   return () => {
  //     socket.off("startGame");
  //     socket.off('updateBoard');
  //     socket.off('gameOver');
  //   };
  // }, [roomId]);

  // const handleCellClick = (row: number, col: number) => {
  //   if (gameState.board[row][col] === "" && !winner) {
  //     socket.emit("makeMove", { roomId, row, col });
  //   }
  // };

  return (
    <div className="p-6">
      <h1 className="text-red-700">Tic-tac-toe</h1>
      <Routes>
        <Route
          path="/"
          element={
            <Form
              setCreatedRoomId={setCreatedRoomId}
              mode={mode}
              setMode={setMode}
            />
          }
        />
        <Route
          path="/game"
          element={
            <Board
              board={gameState.board}
              mode={mode}
              createdRoomId={createdRoomId}
            />
          }
        />
      </Routes>
      {winner !== null && <h2>{winner ? `Winner: ${winner}` : "Draw!"}</h2>}
    </div>
  );
}

export default App;