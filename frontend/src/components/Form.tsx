import React, { useState } from "react";
import io, { Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3000");

const Form: React.FC = () => {
  const [mode, setMode] = useState<"new" | "join" | null>(null);
  const [playerName, setPlayerName] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [createdRoomId, setCreatedRoomId] = useState<string | null>(null);
  console.log("create-room-id", createdRoomId);
  // Handle form submissions
  const handleNewGame = () => {
    if (playerName) {
      const newRoomId = Math.random().toString(36).substring(2, 9); // Generate unique room ID
      setCreatedRoomId(newRoomId);
      socket.emit("joinGame", { roomId: newRoomId, playerName });
    }
  };

  const handleJoinGame = () => {
    if (playerName && roomId) {
      socket.emit("joinGame", { roomId, playerName });
    }
    console.log("roomId", roomId);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-3xl font-bold mb-4">Tic Tac Toe</h1>
      {!mode ? (
        <div>
          <button
            onClick={() => setMode("new")}
            className="bg-blue-500 text-white py-2 px-4 rounded mb-2"
          >
            New Game
          </button>
          <button
            onClick={() => setMode("join")}
            className="bg-green-500 text-white py-2 px-4 rounded"
          >
            Join Game
          </button>
        </div>
      ) : (
        <div className="mt-4">
          {mode === "new" && (
            <div>
              <h2 className="text-xl font-bold mb-2">Create a New Game</h2>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="border border-gray-400 px-2 py-1 mb-2 rounded w-full"
              />
              <button
                onClick={handleNewGame}
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                Start Game
              </button>
              {createdRoomId && (
                <div className="mt-4">
                  <p>
                    Your Room ID: <strong>{createdRoomId}</strong>
                  </p>
                  <button
                    className="border border-gray-600 p-1"
                    onClick={() => navigator.clipboard.writeText(createdRoomId)}
                  >
                    copy
                  </button>
                  <p>Share this ID with your friend to join!</p>
                </div>
              )}
            </div>
          )}
          {mode === "join" && (
            <div>
              <h2 className="text-xl font-bold mb-2">Join an Existing Game</h2>
              <input
                type="text"
                placeholder="Enter your name"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                className="border border-gray-400 px-2 py-1 mb-2 rounded w-full"
              />
              <input
                type="text"
                placeholder="Enter Room ID"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="border border-gray-400 px-2 py-1 mb-2 rounded w-full"
              />
              <button
                onClick={handleJoinGame}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Join Game
              </button>
            </div>
          )}
          <button
            onClick={() => setMode(null)}
            className="bg-gray-500 text-white py-1 px-2 rounded mt-4"
          >
            Back
          </button>
        </div>
      )}
    </div>
  );
};

export default Form;