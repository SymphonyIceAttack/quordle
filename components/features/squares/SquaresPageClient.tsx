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

  // Modals state
  const [showSettings, setShowSettings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  // Settings state
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

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
            Find words in the <strong>4x4 grid</strong>.
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
        <SquaresGame initialData={initialData} />
      </div>
    </main>
  );
}
