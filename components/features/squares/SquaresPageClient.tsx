"use client";

import {
  ArrowLeft,
  BarChart2,
  Calendar,
  Github,
  HelpCircle,
  Moon,
  Settings,
  Sun,
  X,
} from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import type React from "react";
import { useEffect, useState } from "react";
import { SquaresGame } from "@/components/features/squares/SquaresGame";
import { Button } from "@/components/ui/button";
import type { DailySquares } from "@/lib/squares-wordpool";
import { cn } from "@/lib/utils";

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

interface SquaresPageClientProps {
  initialData: DailySquares;
}

export function SquaresPageClient({ initialData }: SquaresPageClientProps) {
  const [mounted, setMounted] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Modals state
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Settings state
  const { setTheme, resolvedTheme } = useTheme();

  // 计算每日编号（从 2022-01-01 开始）
  const getDailyNumber = (date: string) => {
    const startDate = new Date("2022-01-01T00:00:00");
    const currentDate = new Date(`${date}T00:00:00`);
    const diffTime = currentDate.getTime() - startDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // +1 因为第一天是 1 不是 0
  };

  const dailyNumber = getDailyNumber(initialData.date);

  // Defensive check for grid
  if (!initialData?.grid || initialData.grid.length !== 25) {
    console.error("Initial data missing or invalid grid:", initialData);
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center gap-2 mb-8">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold">Squares</h1>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading daily puzzle...</p>
        </div>
      </div>
    );
  }

  // Validate grid integrity in development mode
  if (process.env.NODE_ENV === "development") {
    const invalidLetters = initialData.grid.filter(
      (letter) => !letter || typeof letter !== "string" || letter.length !== 1,
    );
    if (invalidLetters.length > 0) {
      console.error(
        "Grid contains invalid letters:",
        invalidLetters,
        initialData.grid,
      );
    }
    if (!initialData.words || initialData.words.length === 0) {
      console.error("No words found in puzzle:", initialData);
    }
  }

  useEffect(() => {
    setMounted(true);
  }, []);

  const startGame = () => {
    const { soundManager } = require("@/lib/sound-manager");
    soundManager?.initAudio();
    setGameStarted(true);
  };

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
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>

          <div className="flex items-center gap-2">
            <div className="bg-green-500 p-1 rounded text-white">
              <div className="grid grid-cols-2 gap-0.5 w-5 h-5">
                <div className="bg-white/90 rounded-[1px]" />
                <div className="bg-white/90 rounded-[1px]" />
                <div className="bg-white/90 rounded-[1px]" />
                <div className="bg-white/90 rounded-[1px]" />
              </div>
            </div>
            <h1 className="text-xl font-bold">Squares</h1>
            <span className="text-sm text-muted-foreground font-mono">
              #{dailyNumber}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Calendar className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
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
            <HelpCircle className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Modals */}
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
            v1.0.0 • Squares
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
            Find words in the <strong>5x5 grid</strong>.
          </p>
          <p>
            Connect adjacent letters (horizontally, vertically, or diagonally)
            to form words.
          </p>
          <p>Words must be at least 4 letters long.</p>
        </div>
      </Modal>

      {/* Game Area */}
      <div className="flex flex-1 flex-col items-center w-full overflow-y-auto">
        {!gameStarted ? (
          <div className="flex-1 flex flex-col items-center justify-center w-full gap-8 p-8">
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="bg-green-500 p-4 rounded-full inline-block">
                <div className="grid grid-cols-2 gap-0.5 w-12 h-12">
                  <div className="bg-white/90 rounded-[2px]" />
                  <div className="bg-white/90 rounded-[2px]" />
                  <div className="bg-white/90 rounded-[2px]" />
                  <div className="bg-white/90 rounded-[2px]" />
                </div>
              </div>
              <h2 className="text-2xl font-bold">Ready to Play?</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-mono">#{dailyNumber}</span>
                <span>•</span>
                <span>
                  {new Date(initialData.date).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
                Tap to enable sound and start your daily puzzle
              </p>
            </div>

            {/* Start Button */}
            <Button
              size="lg"
              onClick={startGame}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-all"
            >
              Start Game
            </Button>

            {/* Blurred Game Preview */}
            <div className="relative mx-auto max-w-md w-full">
              <div className="bg-card/50 rounded-2xl p-6 border border-border/50 backdrop-blur-sm">
                {/* Grid Preview */}
                <div className="grid grid-cols-4 gap-2 mb-6 blur-sm select-none">
                  {initialData.grid.map((letter, index) => (
                    <div
                      key={index}
                      className="aspect-square bg-primary/10 rounded-lg flex items-center justify-center text-2xl font-bold"
                    >
                      {letter}
                    </div>
                  ))}
                </div>

                {/* Word List Preview */}
                <div className="space-y-2 blur-sm select-none">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Find these words ({initialData.words.length})
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {initialData.words.slice(0, 8).map((word, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-muted rounded-full text-sm font-medium"
                      >
                        {word}
                      </span>
                    ))}
                    {initialData.words.length > 8 && (
                      <span className="px-3 py-1 bg-muted/50 rounded-full text-sm font-medium">
                        +{initialData.words.length - 8} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent pointer-events-none rounded-2xl" />
              </div>
            </div>
          </div>
        ) : (
          <SquaresGame initialData={initialData} />
        )}
      </div>
    </main>
  );
}
