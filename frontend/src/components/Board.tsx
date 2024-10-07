interface IGame {
  board: string[][];
  handleCellClick: (row: number, col: number) => void;
}

export const Board = ({ board, handleCellClick }: IGame) => {
  return (
    <div className="grid grid-cols-3 gap-4 border-red-500 w-96">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <button
            key={`${rowIndex}-${colIndex}`}
            className=" h-20 border border-blue-500 p-4"
            onClick={() => handleCellClick(rowIndex, colIndex)}
          >
            {cell}
          </button>
        ))
      )}
    </div>
  );
};