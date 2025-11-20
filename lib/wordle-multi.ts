import type { LetterStatus, WordlePuzzle } from "@/types/WordleMulti";

export function validateGuess(
  guess: string,
  puzzles: WordlePuzzle[],
): { [puzzleIndex: number]: LetterStatus[] } {
  const results: { [puzzleIndex: number]: LetterStatus[] } = {};

  puzzles.forEach((puzzle, index) => {
    const answer = puzzle.answer;
    const guessArr = guess.split("");
    const answerArr = answer.split("");
    const status: LetterStatus[] = Array(5).fill("absent");

    // Track letter counts in answer to handle duplicates correctly
    const letterCounts: Record<string, number> = {};
    answerArr.forEach((char) => {
      letterCounts[char] = (letterCounts[char] || 0) + 1;
    });

    // First pass: Find correct matches (Green)
    guessArr.forEach((char, i) => {
      if (char === answerArr[i]) {
        status[i] = "correct";
        letterCounts[char]--;
      }
    });

    // Second pass: Find present matches (Yellow)
    guessArr.forEach((char, i) => {
      if (status[i] !== "correct") {
        if (letterCounts[char] && letterCounts[char] > 0) {
          status[i] = "present";
          letterCounts[char]--;
        }
      }
    });

    results[index] = status;
  });

  return results;
}

export function updatePuzzleStatus(
  puzzle: WordlePuzzle,
  guess: string,
  feedback: LetterStatus[],
): WordlePuzzle {
  const newPuzzle = { ...puzzle };

  // Only update if the puzzle is still playing
  if (newPuzzle.status === "playing") {
    newPuzzle.guesses = [...newPuzzle.guesses, guess];
    newPuzzle.feedback = [
      ...newPuzzle.feedback,
      {
        guess,
        result: feedback,
        puzzleIndex: 0, // This index is relative to the puzzle itself in this context
      },
    ];

    // Check for win
    if (feedback.every((status) => status === "correct")) {
      newPuzzle.status = "won";
    } else if (newPuzzle.guesses.length >= 9) {
      // Quordle typically allows 9 guesses
      newPuzzle.status = "lost";
    }
  }

  return newPuzzle;
}

export function calculateOverallStatus(
  puzzles: WordlePuzzle[],
  maxGuesses = 9,
): "playing" | "won" | "lost" {
  const wonCount = puzzles.filter((p) => p.status === "won").length;

  // If all puzzles are won, the game is won
  if (wonCount === puzzles.length) return "won";

  // If any puzzle is lost (reached max guesses without winning), the game is lost
  const currentGuessCount = Math.max(...puzzles.map((p) => p.guesses.length));

  if (currentGuessCount >= maxGuesses && wonCount < puzzles.length) {
    return "lost";
  }

  return "playing";
}
