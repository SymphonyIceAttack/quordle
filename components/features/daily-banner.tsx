"use client";

import type React from "react";

interface DailyBannerProps {
  gameMode: "daily" | "infinite";
  solvedCount: number;
  totalPuzzles: number;
}

export const DailyBanner: React.FC<DailyBannerProps> = ({
  gameMode,
  solvedCount,
  totalPuzzles,
}) => {
  const getMotivationalMessage = () => {
    if (gameMode !== "daily") {
      return "Explore Mode - Unlimited Challenges!";
    }
    if (solvedCount === 0) {
      return "Ready to solve today's 4 puzzles?";
    } else if (solvedCount < totalPuzzles) {
      return `Great! You solved ${solvedCount}/${totalPuzzles} puzzles!`;
    } else {
      return "🎉 Congratulations! All puzzles completed!";
    }
  };

  if (gameMode !== "daily") return null;

  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 sm:p-4 rounded-lg mb-4 text-center shadow-md">
      <p className="text-sm sm:text-base font-medium">
        {getMotivationalMessage()}
      </p>
    </div>
  );
};
