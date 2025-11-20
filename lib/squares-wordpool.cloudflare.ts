import { cachedFunction } from "./cache/cache-helper";
import { FALLBACK_DATA, generateDailySquares } from "./daily-squares-generator";

export interface DailySquares {
  grid: string[];
  words: string[];
  date: string;
  metadata?: {
    generatedAt: string;
    aiModel: string;
  };
}

export async function getDailySquares(): Promise<DailySquares> {
  const today = new Date().toISOString().split("T")[0];

  try {
    return await cachedFunction(
      async () => generateDailySquares(today),
      ["daily-squares-puzzle", today],
      {
        revalidate: 86400,
        tags: ["daily-squares-puzzle"],
      },
    );
  } catch (error) {
    console.error("Error fetching daily squares, using fallback:", error);
    return {
      ...FALLBACK_DATA,
      date: new Date().toISOString().split("T")[0],
    };
  }
}
