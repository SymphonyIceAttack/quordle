"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type EntranceAnimationProps = {
  children: React.ReactNode;
  type: "quordle" | "squares";
};

export function EntranceAnimation({ children, type }: EntranceAnimationProps) {
  const [animationPhase, setAnimationPhase] = useState(0);

  useEffect(() => {
    // Slow down animation phases for better visibility
    const timer1 = setTimeout(() => setAnimationPhase(1), 200);
    const timer2 = setTimeout(() => setAnimationPhase(2), 800);
    const timer3 = setTimeout(() => setAnimationPhase(3), 1400);
    const timer4 = setTimeout(() => setAnimationPhase(4), 2000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  }, []);

  if (type === "quordle") {
    return (
      <div className="relative w-full h-full">
        {/* Phase 1: Background glow */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-green-500/20 via-emerald-500/10 to-green-500/5 transition-all duration-700",
            animationPhase >= 1
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95",
          )}
        />

        {/* Phase 2: Icon/Letter reveal */}
        <div
          className={cn(
            "relative z-10 w-full h-full transition-all duration-500",
            animationPhase >= 2
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4",
          )}
        >
          {children}
        </div>

        {/* Phase 3: Particle effect */}
        {animationPhase >= 2 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-green-400/40 rounded-full animate-ping"
                style={{
                  left: `${20 + i * 10}%`,
                  top: `${30 + (i % 3) * 20}%`,
                  animationDelay: `${i * 100}ms`,
                  animationDuration: "1.5s",
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (type === "squares") {
    return (
      <div className="relative w-full h-full">
        {/* Phase 1: Background gradient */}
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/10 to-blue-500/5 transition-all duration-700",
            animationPhase >= 1
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95",
          )}
        />

        {/* Phase 2: Grid reveal */}
        <div
          className={cn(
            "relative z-10 w-full h-full transition-all duration-500",
            animationPhase >= 2
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95",
          )}
        >
          {children}
        </div>

        {/* Phase 3: Grid lines animation */}
        {animationPhase >= 2 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {/* Vertical lines */}
            {[...Array(5)].map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute top-0 bottom-0 w-px bg-blue-400/30"
                style={{
                  left: `${20 + i * 15}%`,
                  animation: "drawLine 0.8s ease-out forwards",
                  animationDelay: `${i * 50}ms`,
                }}
              />
            ))}
            {/* Horizontal lines */}
            {[...Array(5)].map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute left-0 right-0 h-px bg-blue-400/30"
                style={{
                  top: `${20 + i * 15}%`,
                  animation: "drawLine 0.8s ease-out forwards",
                  animationDelay: `${i * 50 + 100}ms`,
                }}
              />
            ))}
          </div>
        )}

        {/* Phase 4: Sparkles */}
        {animationPhase >= 3 && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-cyan-300 rounded-full animate-pulse"
                style={{
                  left: `${15 + i * 15}%`,
                  top: `${25 + (i % 4) * 20}%`,
                  animationDelay: `${i * 150}ms`,
                  animationDuration: "2s",
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return children;
}

const drawLineKeyframes = `
  @keyframes drawLine {
    from {
      transform: scaleX(0);
      opacity: 0;
    }
    to {
      transform: scaleX(1);
      opacity: 1;
    }
  }
`;

// Inject keyframes
if (typeof document !== "undefined") {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = drawLineKeyframes;
  document.head.appendChild(styleSheet);
}
