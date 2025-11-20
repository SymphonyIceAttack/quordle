import type React from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { MultiWordleGame } from "@/types/WordleMulti";

interface GameStatusProps {
  game: MultiWordleGame;
}

export const GameStatus: React.FC<GameStatusProps> = ({ game }) => {
  const solvedCount = game.puzzles.filter((p) => p.status === "won").length;
  const totalPuzzles = game.puzzles.length;
  const progress = (solvedCount / totalPuzzles) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto mb-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-2xl font-bold text-white">Quordle Challenge</h2>
          <Badge
            variant={
              game.overallStatus === "won"
                ? "default"
                : game.overallStatus === "lost"
                  ? "destructive"
                  : "secondary"
            }
          >
            {game.overallStatus === "playing"
              ? "Playing"
              : game.overallStatus === "won"
                ? "Victory!"
                : "Game Over"}
          </Badge>
        </div>
        <div className="text-white font-mono">
          {solvedCount}/{totalPuzzles} Solved
        </div>
      </div>

      <Progress value={progress} className="h-3" />

      {game.overallStatus !== "playing" && (
        <div className="text-center p-4 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 text-white animate-in fade-in slide-in-from-bottom-4">
          {game.overallStatus === "won" ? (
            <div>
              <p className="text-xl font-bold mb-2">🎉 Amazing Job!</p>
              <p>You solved all 4 puzzles!</p>
            </div>
          ) : (
            <div>
              <p className="text-xl font-bold mb-2">😔 Better luck next time</p>
              <p>Keep practicing to improve your strategy!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
