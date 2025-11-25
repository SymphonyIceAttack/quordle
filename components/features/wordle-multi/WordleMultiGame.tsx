"use client";

import { Loader2 } from "lucide-react";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { soundManager } from "@/lib/sound-manager";
import { updateStats } from "@/lib/stats";
import { cn } from "@/lib/utils";
import {
  calculateOverallStatus,
  updatePuzzleStatus,
  validateGuess,
} from "@/lib/wordle-multi";
import type { MultiWordleGame, WordlePuzzle } from "@/types/WordleMulti";
import type { DailyWordPool } from "@/types/WordPool";
import { Celebration } from "../celebration";
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
  const [showCelebration, setShowCelebration] = useState(false);
  const [restartCooldown, setRestartCooldown] = useState(0);

  const initializeGame = useCallback(async () => {
    if (initialData && gameMode === "daily") {
      try {
        const wordPool = initialData;

        // Ensure all arrays have at least one word, with fallback
        const easyWords = wordPool.words.easy || [];
        const mediumWords = wordPool.words.medium || [];
        const hardWords = wordPool.words.hard || [];

        if (
          easyWords.length === 0 &&
          mediumWords.length === 0 &&
          hardWords.length === 0
        ) {
          throw new Error("No words available in word pool");
        }

        const puzzles: WordlePuzzle[] = [
          createPuzzle(easyWords[0] || "APPLE", "easy"),
          createPuzzle(mediumWords[0] || "BEACH", "medium"),
          createPuzzle(hardWords[0] || "CHAIR", "hard"),
          createPuzzle(hardWords[1] || "DANCE", "hard"),
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
        setRestartCooldown(0);
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

      // Ensure all arrays have at least one word, with fallback
      const easyWords = wordPool.words?.easy || [];
      const mediumWords = wordPool.words?.medium || [];
      const hardWords = wordPool.words?.hard || [];

      if (
        easyWords.length === 0 &&
        mediumWords.length === 0 &&
        hardWords.length === 0
      ) {
        throw new Error("No words available from API");
      }

      // Create 4 puzzles with different difficulties
      const puzzles: WordlePuzzle[] = [
        createPuzzle(easyWords[0] || "APPLE", "easy"),
        createPuzzle(mediumWords[0] || "BEACH", "medium"),
        createPuzzle(hardWords[0] || "CHAIR", "hard"),
        createPuzzle(hardWords[1] || "DANCE", "hard"),
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
      setRestartCooldown(0);
    } catch (error) {
      console.error(error);
      toast.error("Error", {
        description: "Failed to start game. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [initialData, gameMode]);

  useEffect(() => {
    initializeGame();
  }, [gameMode, initializeGame]);

  // Handle restart cooldown when game ends
  useEffect(() => {
    if (game && game.overallStatus !== "playing") {
      setRestartCooldown(3);
      const timer = setInterval(() => {
        setRestartCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [game?.overallStatus]);

  // Handle physical keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!game) return;

      // If game is over, any key restarts the game (after cooldown)
      if (game.overallStatus !== "playing") {
        if (
          restartCooldown === 0 &&
          (e.key.length === 1 || e.key === "Enter" || e.key === "Backspace")
        ) {
          soundManager?.playLetterInput();
          // Restart with fresh puzzles
          initializeGame();
        }
        return;
      }

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
  }, [game, currentGuess, initializeGame]);

  const createPuzzle = (
    answer: string,
    difficulty: "easy" | "medium" | "hard",
  ): WordlePuzzle => ({
    id: `puzzle-${Math.random().toString(36).substring(2, 11)}`,
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

    // Update each puzzle and check for new wins
    const updatedPuzzles = game.puzzles.map((puzzle, index) => {
      const wasPlaying = puzzle.status === "playing";
      const updated = updatePuzzleStatus(
        puzzle,
        currentGuess,
        validationResults[index],
      );
      // If puzzle was playing and is now won, play success sound
      if (wasPlaying && updated.status === "won") {
        soundManager?.playPuzzleSolved();
      }
      return updated;
    });

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
      const isWin = overallStatus === "won";
      const guessCount = updatedPuzzles[0].guesses.length;
      updateStats(isWin, guessCount);

      if (overallStatus === "won") {
        soundManager?.playGameVictory();
        setShowCelebration(true);
        toast.success("Congratulations!", {
          description: "You solved all puzzles!",
        });
      } else {
        soundManager?.playGameOver();
        toast.info("Game Over", {
          description: "Better luck next time!",
        });
      }
    }
  };

  const handleKeyPress = (key: string) => {
    if (!game || game.overallStatus !== "playing") return;

    // Ensure audio context is initialized on first user interaction
    soundManager?.initAudio();

    if (key === "ENTER") {
      if (currentGuess.length === 5) {
        soundManager?.playSubmit();
        submitGuess();
      } else {
        soundManager?.playError();
        toast.error("Too short", {
          description: "Word must be 5 letters long",
        });
      }
    } else if (key === "BACKSPACE") {
      soundManager?.playKeyPress();
      setCurrentGuess((prev) => prev.slice(0, -1));
    } else if (currentGuess.length < 5 && /^[A-Z]$/.test(key)) {
      soundManager?.playKeyPress();
      soundManager?.playLetterInput();
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
    <div className="h-full w-full max-w-5xl mx-auto flex flex-col">
      {/* Top Section - Game Status */}
      <div className="shrink-0 px-2 sm:px-4 pt-2">
        <GameStatus game={game} restartCooldown={restartCooldown} />
      </div>

      {/* Middle Section - Puzzles Grid (constrained height to leave room for keyboard) */}
      <div className="px-1 sm:px-2 md:px-4 py-2 overflow-y-auto max-h-[calc(100vh-300px)]">
        <div className="grid grid-cols-2 gap-1 sm:gap-2 md:gap-3 max-w-4xl mx-auto">
          {game.puzzles.map((puzzle, index) => (
            <Card
              key={puzzle.id}
              className={cn(
                "relative transition-opacity duration-300 border-none shadow-none bg-transparent w-full",
                puzzle.status !== "playing" && "opacity-80",
              )}
            >
              <CardContent className="p-1 sm:p-2 flex flex-col items-center">
                <div className="flex items-center justify-between w-full mb-0.5 sm:mb-1 px-1 sm:px-2">
                  <h3 className="font-semibold text-[10px] sm:text-xs text-muted-foreground">
                    Puzzle {index + 1}
                    {process.env.NEXT_PUBLIC_DEV_MODE === "development" && (
                      <span className="ml-1 text-red-500">
                        [{puzzle.answer}]
                      </span>
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
                <WordlePuzzleBoard
                  puzzle={puzzle}
                  currentGuess={currentGuess}
                />
                {puzzle.status !== "playing" && (
                  <div className="mt-0.5 sm:mt-1 text-center font-bold text-[10px] sm:text-xs">
                    {puzzle.status === "won" ? (
                      <span className="text-green-600">Solved!</span>
                    ) : process.env.NEXT_PUBLIC_DEV_MODE === "development" ? (
                      <span className="text-red-600">
                        Answer: {puzzle.answer}
                      </span>
                    ) : (
                      <span className="text-red-600">Try again!</span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Section - Keyboard (Fixed at bottom, separate section) */}
      <div className="shrink-0 px-1 sm:px-2 md:px-4 py-1 sm:py-2">
        <WordleKeyboard
          onKeyPress={handleKeyPress}
          disabled={game.overallStatus !== "playing"}
          letterStatuses={getKeyboardStatuses()}
        />
      </div>

      <Celebration show={showCelebration} />
    </div>
  );
};
