"use client";

import { Loader2 } from "lucide-react";

import type React from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  calculateOverallStatus,
  updatePuzzleStatus,
  validateGuess,
} from "@/lib/wordle-multi";
import type { DailyWordPool } from "@/types/AIWordPool";
import type { MultiWordleGame, WordlePuzzle } from "@/types/WordleMulti";
import { GameStatus } from "./GameStatus";
import { WordleKeyboard } from "./WordleKeyboard";
import { WordlePuzzleBoard } from "./WordlePuzzleBoard";

interface WordleMultiGameProps {
  gameMode: "daily" | "infinite";
  initialData?: DailyWordPool;
}

export const WordleMultiGame: React.FC<WordleMultiGameProps> = ({
  gameMode,
  initialData,
}) => {
  const [game, setGame] = useState<MultiWordleGame | null>(null);
  const [currentGuess, setCurrentGuess] = useState("");
  const [loading, setLoading] = useState(!initialData);

  useEffect(() => {
    initializeGame();
  }, [gameMode]);

  // Handle physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!game || game.overallStatus !== "playing") return;

      if (e.key === "Enter") {
        handleKeyPress("ENTER");
      } else if (e.key === "Backspace") {
        handleKeyPress("BACKSPACE");
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleKeyPress(e.key.toUpperCase());
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [game, currentGuess]);

  const initializeGame = async () => {
    if (initialData && gameMode === "daily") {
      try {
        const wordPool = initialData;
        const puzzles: WordlePuzzle[] = [
          createPuzzle(wordPool.words.easy[0], "easy"),
          createPuzzle(wordPool.words.medium[0], "medium"),
          createPuzzle(wordPool.words.hard[0], "hard"),
          createPuzzle(wordPool.words.hard[1], "hard"),
        ];

        setGame({
          id: `multi-${Date.now()}`,
          puzzles,
          currentGuess: "",
          gameMode,
          maxGuesses: 9,
          createdAt: new Date().toISOString(),
          overallStatus: "playing",
        });
        setLoading(false);
        return;
      } catch (error) {
        console.error("Error initializing from initialData:", error);
        // Fallback to fetch if something goes wrong with initial data
      }
    }
    setLoading(true);
    try {
      // Fetch daily words from API
      const response = await fetch("/api/wordle-daily");
      if (!response.ok) throw new Error("Failed to fetch words");
      const wordPool = await response.json();

      // Create 4 puzzles with different difficulties
      const puzzles: WordlePuzzle[] = [
        createPuzzle(wordPool.words.easy[0], "easy"),
        createPuzzle(wordPool.words.medium[0], "medium"),
        createPuzzle(wordPool.words.hard[0], "hard"),
        createPuzzle(wordPool.words.hard[1], "hard"),
      ];

      setGame({
        id: `multi-${Date.now()}`,
        puzzles,
        currentGuess: "",
        gameMode,
        maxGuesses: 9,
        createdAt: new Date().toISOString(),
        overallStatus: "playing",
      });
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to start game. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const createPuzzle = (
    answer: string,
    difficulty: "easy" | "medium" | "hard",
  ): WordlePuzzle => ({
    id: `puzzle-${Math.random().toString(36).substr(2, 9)}`,
    answer: answer.toUpperCase(),
    guesses: [],
    feedback: [],
    status: "playing",
    difficulty,
  });

  const submitGuess = () => {
    if (!game || currentGuess.length !== 5) return;

    // Validate guess
    const validationResults = validateGuess(currentGuess, game.puzzles);

    // Update each puzzle
    const updatedPuzzles = game.puzzles.map((puzzle, index) =>
      updatePuzzleStatus(puzzle, currentGuess, validationResults[index]),
    );

    // Calculate overall status
    const overallStatus = calculateOverallStatus(
      updatedPuzzles,
      game.maxGuesses,
    );

    setGame({
      ...game,
      puzzles: updatedPuzzles,
      currentGuess: "",
      overallStatus,
      completedAt:
        overallStatus !== "playing" ? new Date().toISOString() : undefined,
    });

    setCurrentGuess("");

    if (overallStatus !== "playing") {
      if (overallStatus === "won") {
        toast.success("Congratulations!", {
          description: "You solved all puzzles!",
        });
      } else {
        toast.info("Game Over", {
          description: "Better luck next time!",
        });
      }
    }
  };

  const handleKeyPress = (key: string) => {
    if (!game || game.overallStatus !== "playing") return;

    if (key === "ENTER") {
      if (currentGuess.length === 5) {
        submitGuess();
      } else {
        toast.error("Too short", {
          description: "Word must be 5 letters long",
        });
      }
    } else if (key === "BACKSPACE") {
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
      setCurrentGuess((prev) => prev + key);
    }
  };

  // Calculate keyboard letter statuses
  const getKeyboardStatuses = () => {
    if (!game) return {};
    const statuses: Record<string, "correct" | "present" | "absent"> = {};

    game.puzzles.forEach((puzzle) => {
      puzzle.feedback.forEach((fb) => {
        fb.result.forEach((status, index) => {
          const letter = fb.guess[index];
          const currentStatus = statuses[letter];

          if (status === "correct") {
            statuses[letter] = "correct";
          } else if (status === "present" && currentStatus !== "correct") {
            statuses[letter] = "present";
          } else if (status === "absent" && !currentStatus) {
            statuses[letter] = "absent";
          }
        });
      });
    });
    return statuses;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
        <Loader2 className="w-12 h-12 animate-spin mb-4" />
        <p>Generating Daily Puzzles...</p>
      </div>
    );
  }

  if (!game) return null;

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto p-1 sm:p-2 gap-1 sm:gap-2 overflow-hidden">
      <div className="shrink-0">
        <GameStatus game={game} />
      </div>

      {/* Puzzles Grid */}
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-1 sm:gap-2">
        {game.puzzles.map((puzzle, index) => (
          <Card
            key={puzzle.id}
            className={cn(
              "relative transition-opacity duration-300 border-none shadow-none bg-transparent w-full h-full flex items-center justify-center",
              puzzle.status !== "playing" && "opacity-80",
            )}
          >
            <CardContent className="p-0 flex flex-col items-center justify-center h-full w-full">
              <div className="flex items-center justify-between w-full mb-0.5 sm:mb-1 px-1">
                <h3 className="font-semibold text-[10px] sm:text-xs text-muted-foreground">
                  Puzzle {index + 1}
                  {process.env.NODE_ENV === "development" && (
                    <span className="ml-1 text-red-500">[{puzzle.answer}]</span>
                  )}
                </h3>
                <Badge
                  variant={
                    puzzle.difficulty === "easy"
                      ? "default"
                      : puzzle.difficulty === "medium"
                        ? "secondary"
                        : "destructive"
                  }
                  className="text-[8px] px-1 py-0 h-4"
                >
                  {puzzle.difficulty}
                </Badge>
              </div>
              <WordlePuzzleBoard puzzle={puzzle} currentGuess={currentGuess} />
              {puzzle.status !== "playing" && (
                <div className="mt-0.5 sm:mt-1 text-center font-bold text-[10px] sm:text-xs">
                  {puzzle.status === "won" ? (
                    <span className="text-green-600">Solved!</span>
                  ) : (
                    <span className="text-red-600">
                      Answer: {puzzle.answer}
                    </span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Keyboard */}
      <div className="shrink-0 pt-1 sm:pt-2">
        <WordleKeyboard
          onKeyPress={handleKeyPress}
          disabled={game.overallStatus !== "playing"}
          letterStatuses={getKeyboardStatuses()}
        />
      </div>
    </div>
  );
};
