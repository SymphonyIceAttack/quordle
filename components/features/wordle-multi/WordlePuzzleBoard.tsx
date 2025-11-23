import { useEffect, useState } from "react";
import { soundManager } from "@/lib/sound-manager";
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
  const [flippingRow, setFlippingRow] = useState<number | null>(null);

  useEffect(() => {
    // Trigger flip animation when a new guess is submitted
    if (puzzle.feedback.length > 0) {
      const lastRowIndex = puzzle.feedback.length - 1;
      setFlippingRow(lastRowIndex);

      // Play flip sound
      soundManager?.playFlip();

      // Clear flip animation after all letters have flipped
      const timer = setTimeout(() => {
        setFlippingRow(null);
      }, 1000); // 5 letters × 200ms delay + buffer

      return () => clearTimeout(timer);
    }
  }, [puzzle.feedback.length]);

  const renderCell = (
    letter: string,
    status: "correct" | "present" | "absent" | "empty" | "typing",
    rowIndex: number,
    colIndex: number,
    isFlipping: boolean = false,
  ) => {
    const flipDelay = colIndex * 200; // Stagger each letter by 200ms
    const isCurrentlyFlipping = isFlipping;

    return (
      <div
        key={`${rowIndex}-${colIndex}`}
        className={cn(
          "w-full border rounded-md flex items-center justify-center text-xs sm:text-sm md:text-base lg:text-lg font-bold transition-all duration-300 select-none leading-none relative overflow-hidden min-h-[28px] sm:min-h-[36px] md:min-h-[44px] lg:min-h-[52px]",
          status === "correct" &&
            (isCurrentlyFlipping
              ? "bg-blue-600 text-white border-blue-600 animate-pulse"
              : "bg-green-500 text-white border-green-500"),
          status === "present" &&
            (isCurrentlyFlipping
              ? "bg-blue-600 text-white border-blue-600 animate-pulse"
              : "bg-yellow-500 text-white border-yellow-500"),
          status === "absent" &&
            (isCurrentlyFlipping
              ? "bg-blue-600 text-white border-blue-600 animate-pulse"
              : "bg-gray-500 text-white border-gray-500"),
          status === "empty" && "border-border bg-card text-foreground",
          status === "typing" && "border-foreground/50 bg-card text-foreground",
          isCurrentlyFlipping && "animate-flip-3d",
        )}
        style={{
          animationDelay: `${flipDelay}ms`,
        }}
      >
        <span
          className={cn(
            "transition-all duration-200",
            isCurrentlyFlipping && "animate-bounce-subtle",
          )}
        >
          {letter}
        </span>
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
    const isFlipping = flippingRow === row;

    for (let col = 0; col < 5; col++) {
      grid.push(
        renderCell(guess[col], feedback.result[col], row, col, isFlipping),
      );
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
    <div className="grid grid-cols-5 grid-rows-[repeat(9,1fr)] gap-1 sm:gap-1.5 md:gap-2 p-1.5 sm:p-2 bg-muted rounded-lg flex-1 min-h-0 w-full mx-auto justify-center content-center">
      {grid}
    </div>
  );
};
