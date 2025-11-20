import { unstable_cache } from "next/cache";
import {
  type DailySquares,
  FALLBACK_DATA,
  generateDailySquares,
} from "./daily-squares-generator";

export type { DailySquares };

export async function getDailySquares(): Promise<DailySquares> {
  const today = new Date().toISOString().split("T")[0];

  const getCached = unstable_cache(
    async () => {
      return generateDailySquares(today);
    },
    ["daily-squares-puzzle", today],
    {
      revalidate: 86400,
      tags: ["daily-squares-puzzle"],
    },
  );

  try {
    return await getCached();
  } catch (error) {
    console.error("Error fetching daily squares, using fallback:", error);
    return {
      ...FALLBACK_DATA,
      date: new Date().toISOString().split("T")[0],
    };
  }
}
