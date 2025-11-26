import { unstable_cache } from "next/cache";
import type { DailyWordPool } from "@/types/WordPool";
import { generateDailyWordsAdvanced } from "./advanced-wordlist";
import { generateDailyWordsFromList } from "./wordlist-dictionary";

const FALLBACK_WORDS = {
  easy: ["APPLE", "BEACH", "CHAIR", "DANCE"],
  medium: ["FROST", "GRAPE", "HOTEL", "IMAGE"],
  hard: ["JAZZY", "KNOCK", "LEMON", "MUSIC"],
};

export async function generateDailyWords(
  difficulty: "beginner" | "intermediate" | "expert" = "intermediate",
  date?: string,
  theme?: string,
): Promise<DailyWordPool> {
  try {
    // 使用高级词库系统，支持主题和更多词汇
    return await generateDailyWordsAdvanced(difficulty, date, theme);
  } catch (error) {
    console.error(
      "Failed to generate words from advanced list, using basic list:",
      error,
    );
    try {
      // 回退到基础词库
      return await generateDailyWordsFromList(difficulty, date);
    } catch (fallbackError) {
      console.error(
        "Failed to generate words from basic list, using fallback:",
        fallbackError,
      );
      throw error;
    }
  }
}

// Cached daily word generation with 24-hour revalidation
export async function cacheDailyWords(): Promise<DailyWordPool> {
  const today = new Date().toISOString().split("T")[0];

  const getCachedWords = unstable_cache(
    async () => {
      return generateDailyWords("intermediate", today);
    },
    ["daily-word-pool", today],
    {
      revalidate: 86400, // 24 hours
      tags: ["daily-word-pool"],
    },
  );

  try {
    return await getCachedWords();
  } catch (error) {
    console.error("Error generating daily words, using fallback:", error);
    return {
      words: FALLBACK_WORDS,
      date: new Date().toISOString().split("T")[0],
      metadata: {
        generatedAt: new Date().toISOString(),
        source: "fallback",
        difficulty: "intermediate",
      },
    };
  }
}
