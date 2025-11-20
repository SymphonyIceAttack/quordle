import type React from "react";
import { cn } from "@/lib/utils";
import type { WordlePuzzle } from "@/types/WordleMulti";

interface WordlePuzzleBoardProps {
  puzzle: WordlePuzzle;
  currentGuess?: string;
}

export const WordlePuzzleBoard: React.FC<WordlePuzzleBoardProps> = ({
  puzzle,
  currentGuess = "",
}) => {
  const renderCell = (
    letter: string,
    status: "correct" | "present" | "absent" | "empty" | "typing",
    rowIndex: number,
    colIndex: number,
  ) => {
    return (
      <div
        key={`${rowIndex}-${colIndex}`}
        className={cn(
          "w-full border rounded-[2px] sm:rounded flex items-center justify-center text-[10px] sm:text-xs md:text-sm font-bold transition-colors duration-300 select-none leading-none",
          status === "correct" && "bg-green-500 text-white border-green-500",
          status === "present" && "bg-yellow-500 text-white border-yellow-500",
          status === "absent" && "bg-gray-500 text-white border-gray-500",
          status === "empty" && "border-border bg-card text-foreground",
          status === "typing" && "border-foreground/50 bg-card text-foreground",
        )}
      >
        {letter}
      </div>
    );
  };

  const grid = [];
  const totalRows = 9;
  const filledRows = puzzle.guesses.length;

  // Completed guesses
  for (let row = 0; row < filledRows; row++) {
    const guess = puzzle.guesses[row];
    const feedback = puzzle.feedback[row];

    for (let col = 0; col < 5; col++) {
      grid.push(renderCell(guess[col], feedback.result[col], row, col));
    }
  }

  // Current guess (only if puzzle is still playing)
  if (filledRows < totalRows) {
    if (puzzle.status === "playing") {
      for (let col = 0; col < 5; col++) {
        const letter = currentGuess[col] || "";
        grid.push(
          renderCell(letter, letter ? "typing" : "empty", filledRows, col),
        );
      }
    } else {
      // If puzzle is solved/failed, just show empty cells for this row
      for (let col = 0; col < 5; col++) {
        grid.push(renderCell("", "empty", filledRows, col));
      }
    }
  }

  // Remaining empty rows
  for (let row = filledRows + 1; row < totalRows; row++) {
    for (let col = 0; col < 5; col++) {
      grid.push(renderCell("", "empty", row, col));
    }
  }

  return (
    <div className="grid grid-cols-5 grid-rows-[repeat(9,1fr)] gap-[2px] sm:gap-1 p-1 bg-muted rounded-lg flex-1 min-h-0 w-full mx-auto justify-center content-center">
      {grid}
    </div>
  );
};
