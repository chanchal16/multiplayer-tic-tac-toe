import { Dispatch, SetStateAction, useState } from "react";
import io, { Socket } from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket: Socket = io("http://localhost:3000");
interface Iform {
  setCreatedRoomId: Dispatch<SetStateAction<string | null>>;
  mode: "new" | "join" | null;
  setMode: Dispatch<SetStateAction<"new" | "join" | null>>;
}

export const Form = ({ setCreatedRoomId, mode, setMode }: Iform) => {
  const [playerName, setPlayerName] = useState<string>("");
  const [roomId, setRoomId] = useState<string>("");
  const [formError, setFormError] = useState<string>("");
  const navigate = useNavigate();

  // Handle form submissions
  const handleNewGame = () => {
    if (playerName) {
      const newRoomId = Math.random().toString(36).substring(2, 9); // Generate unique room ID
      setCreatedRoomId(newRoomId);
      socket.emit("createGame", { roomId: newRoomId, playerName });
      navigate("/game");
    }
  };

  const handleJoinGame = () => {
    console.log("click", playerName, roomId);
    setFormError("");
    if (playerName && roomId) {
      socket.emit(
        "joinGame",
        { roomId, playerName },
        (response: { success: boolean; message?: string }) => {
          console.log("res", response);
          if (response.success) {
            navigate("/game");
          } else {
            setFormError(response.message ?? "Invalid room ID");
          }
        }
      );
    }
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
              {formError && <p className="text-red-500">{formError}</p>}
              <button
                onClick={handleJoinGame}
                className="bg-green-500 text-white py-2 px-4 rounded"
              >
                Join
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