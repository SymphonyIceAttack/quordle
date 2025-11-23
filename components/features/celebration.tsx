"use client";

import { useEffect, useState } from "react";

interface CelebrationProps {
  show: boolean;
  message?: string;
}

export const Celebration: React.FC<CelebrationProps> = ({
  show,
  message = "🎉 Awesome!",
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className="bg-black/70 text-white px-6 py-4 rounded-xl text-2xl sm:text-3xl font-bold animate-bounce shadow-2xl">
        {message}
      </div>
    </div>
  );
};
