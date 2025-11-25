"use client";

import {
  BarChart2,
  Github,
  Grid3X3,
  Hash,
  Info,
  LayoutGrid,
  Menu,
  Moon,
  RotateCcw,
  Settings,
  Sun,
  X,
} from "lucide-react";
import Link from "next/link"; // Added Link import
import { useTheme } from "next-themes";
import type React from "react";
import { useEffect, useState } from "react";
import { EntranceAnimation } from "@/components/animated-entrance";
import { GamePlaceholder } from "@/components/features/placeholder/GamePlaceholder";
import { WordleMultiGame } from "@/components/features/wordle-multi/WordleMultiGame";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { type GameStats, loadStats } from "@/lib/stats";
import { cn } from "@/lib/utils";
import type { DailyWordPool } from "@/types/WordPool";

// --- Components ---

function Modal({
  isOpen,
  onClose,
  title,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md rounded-xl bg-background border border-border shadow-lg overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between border-b border-border p-4 bg-muted/30">
          <h2 className="text-lg font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}

// --- Main Client Component ---

interface QuordlePageClientProps {
  initialData?: DailyWordPool;
}

export function QuordlePageClient({ initialData }: QuordlePageClientProps) {
  const [mounted, setMounted] = useState(false);
  const [activeGame, setActiveGame] = useState<
    "quordle" | "combinations" | "strands"
  >("quordle");

  // Modals state
  const [showStats, setShowStats] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [stats, setStats] = useState<GameStats | null>(null);

  // Settings state
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);

    // Initialize audio context on first user interaction (keyboard or click)
    const initAudio = () => {
      const { soundManager } = require("@/lib/sound-manager");
      soundManager?.initAudio();
    };

    // Add listeners for audio initialization
    window.addEventListener("click", initAudio, { once: true, passive: true });
    window.addEventListener("touchstart", initAudio, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", initAudio, { once: true });

    // Also try to initialize immediately in case the user is already interacting
    setTimeout(() => {
      const { soundManager } = require("@/lib/sound-manager");
      if (soundManager?.isEnabled()) {
        soundManager?.initAudio();
      }
    }, 100);

    return () => {
      window.removeEventListener("click", initAudio);
      window.removeEventListener("touchstart", initAudio);
      window.removeEventListener("keydown", initAudio);
    };
  }, []);

  useEffect(() => {
    if (showStats) {
      setStats(loadStats());
    }
  }, [showStats]);

  const toggleDarkMode = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  if (!mounted) return null;

  const isDarkMode = resolvedTheme === "dark";

  return (
    <main className="flex h-screen flex-col items-center bg-background text-foreground font-sans overflow-hidden">
      {/* Header */}
      <header className="flex w-full items-center justify-between border-b border-border px-4 py-2 sm:px-6 bg-background shadow-sm sticky top-0 z-10 shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="-ml-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem asChild>
                  <Link
                    href="/squares"
                    className="flex items-center gap-2 w-full cursor-pointer"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    <span>Squares</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActiveGame("combinations")}
                  className="flex items-center gap-2 w-full cursor-pointer"
                >
                  <Grid3X3 className="h-4 w-4" />
                  <span>Combinations</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActiveGame("strands")}
                  className="flex items-center gap-2 w-full cursor-pointer"
                >
                  <Hash className="h-4 w-4" />
                  <span>Strands</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded bg-green-500 text-white font-bold text-xl shadow-sm">
              Q
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight hidden sm:block">
              QUORDLE
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 ml-4">
            <Link href="/squares">
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <LayoutGrid className="h-4 w-4" />
                Squares
              </Button>
            </Link>
            <Button
              variant={activeGame === "combinations" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "gap-2",
                activeGame !== "combinations" &&
                  "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setActiveGame("combinations")}
            >
              <Grid3X3 className="h-4 w-4" />
              Combinations
            </Button>
            <Button
              variant={activeGame === "strands" ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "gap-2",
                activeGame !== "strands" &&
                  "text-muted-foreground hover:text-foreground",
              )}
              onClick={() => setActiveGame("strands")}
            >
              <Hash className="h-4 w-4" />
              Strands
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setShowStats(true)}
          >
            <BarChart2 className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setShowSettings(true)}
          >
            <Settings className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowAbout(true)}
          >
            <Info className="h-5 w-5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => window.location.reload()}
            title="New Game"
            className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Modals */}
      <Modal
        isOpen={showStats}
        onClose={() => setShowStats(false)}
        title="Statistics"
      >
        {stats ? (
          <div className="flex flex-col gap-6 p-2">
            <div className="grid grid-cols-4 gap-4 text-center">
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold">{stats.gamesPlayed}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                  Played
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold">
                  {stats.winPercentage}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                  Win %
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold">
                  {stats.currentStreak}
                </span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                  Current Streak
                </span>
              </div>
              <div className="flex flex-col items-center">
                <span className="text-3xl font-bold">{stats.maxStreak}</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                  Max Streak
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted-foreground">
                Guess Distribution
              </h3>
              <div className="flex flex-col gap-2">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((guess) => {
                  const count = stats.guessDistribution[guess] || 0;
                  const maxCount = Math.max(
                    ...Object.values(stats.guessDistribution),
                    1,
                  );
                  const percentage = Math.max((count / maxCount) * 100, 5); // Min 5% width for visibility

                  return (
                    <div
                      key={guess}
                      className="flex items-center gap-2 text-sm"
                    >
                      <span className="w-4 text-right font-mono text-muted-foreground">
                        {guess}
                      </span>
                      <div className="flex-1 h-6 bg-muted/30 rounded-sm overflow-hidden flex items-center">
                        <div
                          className={cn(
                            "h-full flex items-center justify-end px-2 text-xs font-bold transition-all duration-500 ease-out",
                            count > 0
                              ? "bg-green-500 text-white"
                              : "bg-transparent text-muted-foreground",
                          )}
                          style={{
                            width: count > 0 ? `${percentage}%` : "auto",
                          }}
                        >
                          {count}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center p-8 text-muted-foreground">
            Loading statistics...
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        title="Settings"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center gap-2">
              {isDarkMode ? (
                <Moon className="h-5 w-5" />
              ) : (
                <Sun className="h-5 w-5" />
              )}
              <div className="flex flex-col">
                <span className="font-medium">Dark Mode</span>
                <span className="text-xs text-muted-foreground">
                  Toggle dark theme
                </span>
              </div>
            </div>
            <div
              className={cn(
                "w-12 h-6 rounded-full p-1 cursor-pointer transition-colors duration-200 ease-in-out",
                isDarkMode ? "bg-green-500" : "bg-muted-foreground/30",
              )}
              onClick={toggleDarkMode}
            >
              <div
                className={cn(
                  "w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform duration-200 ease-in-out",
                  isDarkMode ? "translate-x-6" : "translate-x-0",
                )}
              />
            </div>
          </div>

          <div className="border-t border-border my-2"></div>

          <div className="flex flex-col gap-2">
            <h3 className="font-semibold text-sm text-muted-foreground">
              Feedback
            </h3>
            <a
              href="#"
              className="flex items-center gap-2 text-sm hover:underline"
            >
              <Github className="h-4 w-4" />
              Report a bug
            </a>
            <a
              href="#"
              className="flex items-center gap-2 text-sm hover:underline"
            >
              <Settings className="h-4 w-4" />
              Email us
            </a>
          </div>

          <div className="text-xs text-muted-foreground mt-4 text-center">
            v1.0.0 • Quordle Clone
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showAbout}
        onClose={() => setShowAbout(false)}
        title="How to Play"
      >
        <div className="flex flex-col gap-4 text-sm">
          <p>
            Guess <strong>4 hidden words</strong> in 9 tries.
          </p>
          <p>
            Each guess must be a valid 5-letter word. Hit the enter button to
            submit.
          </p>
          <p>
            After each guess, the color of the tiles will change to show how
            close your guess was to the word.
          </p>

          <div className="space-y-2 my-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-500 text-white flex items-center justify-center font-bold rounded">
                W
              </div>
              <span>
                <strong>Green</strong> means the letter is in the word and in
                the correct spot.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-yellow-500 text-white flex items-center justify-center font-bold rounded">
                I
              </div>
              <span>
                <strong>Yellow</strong> means the letter is in the word but in
                the wrong spot.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gray-400 text-white flex items-center justify-center font-bold rounded">
                N
              </div>
              <span>
                <strong>Gray</strong> means the letter is not in the word in any
                spot.
              </span>
            </div>
          </div>

          <p className="text-muted-foreground text-xs">
            This is a clone of the popular Quordle game.
          </p>
        </div>
      </Modal>

      {/* Game Area */}
      <div className="flex flex-1 flex-col items-center w-full overflow-hidden">
        {activeGame === "quordle" ? (
          <EntranceAnimation type="quordle">
            <WordleMultiGame gameMode="daily" initialData={initialData} />
          </EntranceAnimation>
        ) : activeGame === "combinations" ? (
          <EntranceAnimation type="quordle">
            <GamePlaceholder
              title="Combinations"
              icon={Grid3X3}
              description="Combine letters to find all the hidden words."
              onBack={() => setActiveGame("quordle")}
            />
          </EntranceAnimation>
        ) : (
          <EntranceAnimation type="quordle">
            <GamePlaceholder
              title="Strands"
              icon={Hash}
              description="Find the theme words hidden in the letter grid."
              onBack={() => setActiveGame("quordle")}
            />
          </EntranceAnimation>
        )}
      </div>
    </main>
  );
}
