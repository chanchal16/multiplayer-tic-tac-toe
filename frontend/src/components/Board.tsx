interface IGame {
  board: string[][];
  handleCellClick?: (row: number, col: number) => void;
  mode: "new" | "join" | null;
  createdRoomId: string | null;
}

export const Board = ({ board, mode, createdRoomId }: IGame) => {
  console.log("create-room-id", createdRoomId);
  return (
    <>
      <div className="grid grid-cols-3 gap-4 border-red-500 w-96">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className=" h-20 border border-blue-500 p-4"
              // onClick={() => handleCellClick(rowIndex, colIndex)}
            >
              {cell}
            </button>
          ))
        )}
      </div>
      {createdRoomId && mode === "new" && (
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
    </>
  );
};