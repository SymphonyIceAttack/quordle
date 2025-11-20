"use client";

import { CornerDownLeft, Delete } from "lucide-react";
import type React from "react";
import { Button } from "@/components/ui/button";
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
  const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["ENTER", "Z", "X", "C", "V", "B", "N", "M", "BACKSPACE"],
  ];

  const getKeyStatusClass = (key: string) => {
    const status = letterStatuses[key];
    if (status === "correct")
      return "bg-green-500 text-white hover:bg-green-600 border-green-600";
    if (status === "present")
      return "bg-yellow-500 text-white hover:bg-yellow-600 border-yellow-600";
    if (status === "absent")
      return "bg-gray-500 text-white hover:bg-gray-600 border-gray-600";
    return "bg-muted text-foreground hover:bg-muted/80 border-border";
  };

  return (
    <div className="w-full max-w-md mx-auto p-0.5 space-y-1">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center gap-1">
          {row.map((key) => {
            const isSpecial = key.length > 1;
            return (
              <Button
                key={key}
                onClick={() => onKeyPress(key)}
                disabled={disabled}
                variant="outline"
                className={cn(
                  "h-9 sm:h-12 font-bold transition-all active:scale-95 p-0 shadow-sm",
                  isSpecial
                    ? "px-1 sm:px-3 text-[10px] sm:text-xs flex-1 max-w-[60px]"
                    : "w-8 sm:w-9 text-sm sm:text-base flex-1",
                  getKeyStatusClass(key),
                )}
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
