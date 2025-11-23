import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { MultiWordleGame } from "@/types/WordleMulti";

interface GameStatusProps {
  game: MultiWordleGame;
  restartCooldown?: number;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  game,
  restartCooldown = 0,
}) => {
  const [lastStatus, setLastStatus] = useState(game.overallStatus);
  const [showFlash, setShowFlash] = useState(false);

  const solvedCount = game.puzzles.filter((p) => p.status === "won").length;
  const totalPuzzles = game.puzzles.length;
  const progress = (solvedCount / totalPuzzles) * 100;

  useEffect(() => {
    if (game.overallStatus !== lastStatus && game.overallStatus !== "playing") {
      setShowFlash(true);
      setLastStatus(game.overallStatus);
      const timer = setTimeout(() => setShowFlash(false), 1000);
      return () => clearTimeout(timer);
    }
  }, [game.overallStatus, lastStatus]);

  return (
    <>
      {/* Flash overlay for success/failure */}
      {showFlash && (
        <div
          className={cn(
            "fixed inset-0 pointer-events-none z-40 animate-flash",
            game.overallStatus === "won"
              ? "animate-flash-success"
              : "animate-flash-error",
          )}
        />
      )}

      <div className="w-full max-w-4xl mx-auto mb-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold text-foreground">
              Quordle Challenge
            </h2>
            <Badge
              variant={
                game.overallStatus === "won"
                  ? "default"
                  : game.overallStatus === "lost"
                    ? "destructive"
                    : "secondary"
              }
              className={cn(
                "transition-all duration-300",
                game.overallStatus === "won" &&
                  "animate-pulse shadow-lg shadow-green-500/50",
                game.overallStatus === "lost" &&
                  "animate-pulse shadow-lg shadow-red-500/50",
              )}
            >
              {game.overallStatus === "playing"
                ? "Playing"
                : game.overallStatus === "won"
                  ? "Victory!"
                  : "Game Over"}
            </Badge>
          </div>
          <div
            className={cn(
              "text-muted-foreground font-mono transition-all duration-300",
              game.overallStatus === "won" && "text-green-500 font-bold",
              game.overallStatus === "lost" && "text-red-500 font-bold",
            )}
          >
            {solvedCount}/{totalPuzzles} Solved
          </div>
        </div>

        <Progress
          value={progress}
          className={cn(
            "h-3 transition-all duration-500",
            progress === 100 && "animate-pulse",
          )}
        />

        {game.overallStatus !== "playing" && (
          <div
            className={cn(
              "text-center p-4 bg-muted/50 backdrop-blur-md rounded-lg border text-foreground animate-in fade-in slide-in-from-bottom-4",
              game.overallStatus === "won"
                ? "border-green-500/50 shadow-lg shadow-green-500/20"
                : "border-red-500/50 shadow-lg shadow-red-500/20",
            )}
          >
            {game.overallStatus === "won" ? (
              <div>
                <p className="text-xl font-bold mb-2 animate-bounce">
                  🎉 Amazing Job!
                </p>
                <p>You solved all 4 puzzles!</p>
              </div>
            ) : (
              <div>
                <p className="text-xl font-bold mb-2">
                  😔 Better luck next time
                </p>
                <p className="mb-2">
                  Keep practicing to improve your strategy!
                </p>
                {restartCooldown > 0 ? (
                  <p className="text-sm text-muted-foreground animate-pulse">
                    Restarting available in {restartCooldown}...
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground animate-pulse">
                    Press any key to play again
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
