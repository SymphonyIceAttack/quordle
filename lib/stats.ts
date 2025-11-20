export interface GameStats {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  winPercentage: number;
  guessDistribution: Record<number, number>;
  lastPlayed?: string;
}

const STATS_KEY = "quordle-stats";

export const defaultStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  winPercentage: 0,
  guessDistribution: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
    7: 0,
    8: 0,
    9: 0,
  },
};

export function loadStats(): GameStats {
  if (typeof window === "undefined") return defaultStats;

  try {
    const stored = localStorage.getItem(STATS_KEY);
    if (!stored) return defaultStats;
    return { ...defaultStats, ...JSON.parse(stored) };
  } catch (error) {
    console.error("Failed to load stats:", error);
    return defaultStats;
  }
}

export function saveStats(stats: GameStats) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (error) {
    console.error("Failed to save stats:", error);
  }
}

export function updateStats(isWin: boolean, guessCount: number): GameStats {
  const stats = loadStats();
  const today = new Date().toDateString();

  // Prevent double counting if called multiple times for same day/game
  // For simplicity in this version, we'll assume the caller handles "once per game" logic
  // or we could check a "lastGameId" if we had one.
  // For now, we'll just update.

  stats.gamesPlayed += 1;

  if (isWin) {
    stats.gamesWon += 1;
    stats.currentStreak += 1;
    stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);

    // Update guess distribution
    // Ensure the guess count is within valid range (1-9)
    const safeGuessCount = Math.max(1, Math.min(9, guessCount));
    stats.guessDistribution[safeGuessCount] =
      (stats.guessDistribution[safeGuessCount] || 0) + 1;
  } else {
    stats.currentStreak = 0;
  }

  stats.winPercentage = Math.round((stats.gamesWon / stats.gamesPlayed) * 100);
  stats.lastPlayed = today;

  saveStats(stats);
  return stats;
}
