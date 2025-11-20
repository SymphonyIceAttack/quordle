import { z } from "zod";

export type LetterStatus = "correct" | "present" | "absent";

export interface WordlePuzzle {
  id: string;
  answer: string;
  guesses: string[];
  feedback: PuzzleFeedback[];
  status: "playing" | "won" | "lost";
  difficulty: "easy" | "medium" | "hard";
}

export interface PuzzleFeedback {
  guess: string;
  result: LetterStatus[];
  puzzleIndex: number;
}

export interface MultiWordleGame {
  id: string;
  puzzles: WordlePuzzle[];
  currentGuess: string;
  gameMode: "daily" | "infinite";
  maxGuesses: number;
  createdAt: string;
  completedAt?: string;
  overallStatus: "playing" | "won" | "lost";
}

export const WordleMultiSchema = z.object({
  id: z.string().min(1),
  puzzles: z
    .array(
      z.object({
        id: z.string().min(1),
        answer: z.string().length(5),
        guesses: z.array(z.string().length(5)),
        feedback: z.array(
          z.object({
            guess: z.string().length(5),
            result: z.array(z.enum(["correct", "present", "absent"])),
            puzzleIndex: z.number().min(0).max(3),
          }),
        ),
        status: z.enum(["playing", "won", "lost"]),
        difficulty: z.enum(["easy", "medium", "hard"]),
      }),
    )
    .length(4),
  currentGuess: z.string().length(5),
  gameMode: z.enum(["daily", "infinite"]),
  maxGuesses: z.number().min(3).max(10),
  createdAt: z.string(),
  completedAt: z.string().optional(),
  overallStatus: z.enum(["playing", "won", "lost"]),
});
