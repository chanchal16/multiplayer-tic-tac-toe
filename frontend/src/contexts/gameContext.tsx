import React, { createContext, useState } from "react";

export interface GameState {
  board: string[][];
  currentPlayer: string;
  winner: string | null;
}

export const GameStateContext = createContext<{
  gameState: GameState;
  updateGameState: (newGameState: GameState) => void;
}>({
  gameState: {
    board: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    currentPlayer: "X",
    winner: null,
  },
  updateGameState: () => {},
});

export const GameStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [gameState, setGameState] = useState<GameState>({
    board: [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ],
    currentPlayer: "X",
    winner: null,
  });

  const updateGameState = (newGameState: GameState) => {
    setGameState(newGameState);
  };

  return (
    <GameStateContext.Provider value={{ gameState, updateGameState }}>
      {children}
    </GameStateContext.Provider>
  );
};