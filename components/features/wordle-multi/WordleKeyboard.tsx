"use client";

import { CornerDownLeft, Delete } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { soundManager } from "@/lib/sound-manager";
import { cn } from "@/lib/utils";

interface WordleKeyboardProps {
  onKeyPress: (key: string) => void;
  disabled?: boolean;
  letterStatuses?: Record<string, "correct" | "present" | "absent">;
}

export const WordleKeyboard: React.FC<WordleKeyboardProps> = ({
  onKeyPress,
  disabled = false,
  letterStatuses = {},
}) => {
  const [pressedKey, setPressedKey] = useState<string | null>(null);
  const pressTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (disabled) return;

      const key = e.key.toUpperCase();
      if (key === "ENTER" || key === "BACKSPACE") {
        setPressedKey(key);
      } else if (/^[A-Z]$/.test(key)) {
        setPressedKey(key);
      }

      if (pressTimeoutRef.current) {
        clearTimeout(pressTimeoutRef.current);
      }
      pressTimeoutRef.current = setTimeout(() => {
        setPressedKey(null);
      }, 150);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      if (pressTimeoutRef.current) {
        clearTimeout(pressTimeoutRef.current);
      }
    };
  }, [disabled]);

  const handleKeyClick = (key: string) => {
    soundManager?.playKeyPress();
    onKeyPress(key);
    setPressedKey(key);
    if (pressTimeoutRef.current) {
      clearTimeout(pressTimeoutRef.current);
    }
    pressTimeoutRef.current = setTimeout(() => {
      setPressedKey(null);
    }, 150);
  };

  const getKeyStatusClass = (key: string) => {
    const status = letterStatuses[key];
    const isPressed = pressedKey === key;

    if (status === "correct")
      return cn(
        "bg-green-500 text-white border-green-600 shadow-green-500/50",
        isPressed && "scale-90 brightness-110",
      );
    if (status === "present")
      return cn(
        "bg-yellow-500 text-white border-yellow-600 shadow-yellow-500/50",
        isPressed && "scale-90 brightness-110",
      );
    if (status === "absent")
      return cn(
        "bg-gray-500 text-white border-gray-600 shadow-gray-500/50",
        isPressed && "scale-90 brightness-110",
      );

    return cn(
      "bg-muted text-foreground border-border shadow-md",
      !disabled &&
        "hover:bg-muted/80 hover:shadow-lg hover:brightness-105 active:scale-95",
      isPressed && "scale-90 brightness-110",
    );
  };

  return (
    <div className="w-full max-w-md mx-auto p-0.5 space-y-1">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1">
          {row.map((key) => {
            const isSpecial = key.length > 1;
            const isPressed = pressedKey === key;

            return (
              <Button
                key={key}
                onClick={() => handleKeyClick(key)}
                disabled={disabled}
                variant="outline"
                className={cn(
                  "h-9 sm:h-12 font-bold transition-all duration-150 p-0 shadow-sm",
                  "transform-gpu hover:scale-105 active:scale-90",
                  isSpecial
                    ? "px-1 sm:px-3 text-[10px] sm:text-xs flex-1 max-w-[60px]"
                    : "w-8 sm:w-9 text-sm sm:text-base flex-1",
                  getKeyStatusClass(key),
                  isPressed && "ring-2 ring-offset-2 ring-blue-400",
                )}
                data-key={key}
              >
                {key === "BACKSPACE" ? (
                  <Delete className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : key === "ENTER" ? (
                  <CornerDownLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  key
                )}
              </Button>
            );
          })}
        </div>
      ))}
    </div>
  );
};
