import { unstable_cache } from "next/cache";
import { generateDailySquaresAdvanced } from "./advanced-wordlist";
import { type DailySquares, FALLBACK_DATA } from "./daily-squares-generator";
import { generateDailySquaresUltimate } from "./squares-dfs-generator";
import { generateDailySquaresFromList } from "./wordlist-dictionary";

export type { DailySquares };

export async function getDailySquares(): Promise<DailySquares> {
  const today = new Date().toISOString().split("T")[0];

  // 在开发模式下禁用缓存，实时生成新的网格
  const isDevelopment = process.env.NODE_ENV === "development";

  if (isDevelopment) {
    try {
      // 跳过复杂的DFS算法，直接使用高级词库生成简单网格
      const result = await generateDailySquaresAdvanced(today);

      if (
        !result ||
        !result.grid ||
        !result.words ||
        result.words.length === 0
      ) {
        throw new Error(
          "Invalid or empty result from generateDailySquaresAdvanced",
        );
      }

      return {
        grid: result.grid,
        words: result.words,
        coreWords: result.words.slice(0, 30),
        bonusWords: result.words.slice(30),
        date: result.date,
        metadata: {
          ...result.metadata,
          source: result.metadata.source || "advanced-wordlist-simple",
        },
      };
    } catch (_advancedError) {
      try {
        // 回退到基础词库
        const result = await generateDailySquaresFromList(today);

        if (
          !result ||
          !result.grid ||
          !result.words ||
          result.words.length === 0
        ) {
          throw new Error(
            "Invalid or empty result from generateDailySquaresFromList",
          );
        }

        return {
          grid: result.grid,
          words: result.words,
          coreWords: result.words.slice(0, 30),
          bonusWords: result.words.slice(30),
          date: result.date,
          metadata: {
            ...result.metadata,
            source: result.metadata.source || "wordlist",
          },
        };
      } catch (_basicError) {
        return {
          ...FALLBACK_DATA,
          date: new Date().toISOString().split("T")[0],
          metadata: {
            generatedAt: new Date().toISOString(),
            source: "fallback",
          },
        };
      }
    }
  }

  const getCached = unstable_cache(
    async () => {
      // 使用终极DFS算法生成可验证的网格
      const result = await generateDailySquaresUltimate(today);

      if (
        !result ||
        !result.grid ||
        !result.words ||
        result.words.length === 0
      ) {
        throw new Error(
          "Invalid or empty result from generateDailySquaresUltimate",
        );
      }

      return {
        grid: result.grid,
        words: result.words,
        coreWords: result.coreWords,
        bonusWords: result.bonusWords,
        date: result.date,
        metadata: {
          generatedAt: result.metadata.generatedAt,
          source: result.metadata.algorithm,
          successRate: result.successRate,
          verified: result.metadata.verified,
        },
      };
    },
    ["daily-squares-puzzle", today],
    {
      revalidate: 86400,
      tags: ["daily-squares-puzzle"],
    },
  );

  try {
    return await getCached();
  } catch (_error) {
    try {
      // 回退到高级词库
      const result = await generateDailySquaresAdvanced(today);

      if (
        !result ||
        !result.grid ||
        !result.words ||
        result.words.length === 0
      ) {
        throw new Error(
          "Invalid or empty result from generateDailySquaresAdvanced",
        );
      }

      return {
        grid: result.grid,
        words: result.words,
        coreWords: result.words.slice(0, 30),
        bonusWords: result.words.slice(30),
        date: result.date,
        metadata: {
          ...result.metadata,
          source: result.metadata.source || "advanced-wordlist",
        },
      };
    } catch (_advancedError) {
      try {
        // 回退到基础词库
        const result = await generateDailySquaresFromList(today);

        if (
          !result ||
          !result.grid ||
          !result.words ||
          result.words.length === 0
        ) {
          throw new Error(
            "Invalid or empty result from generateDailySquaresFromList",
          );
        }

        return {
          grid: result.grid,
          words: result.words,
          coreWords: result.words.slice(0, 30),
          bonusWords: result.words.slice(30),
          date: result.date,
          metadata: {
            ...result.metadata,
            source: result.metadata.source || "wordlist",
          },
        };
      } catch (_basicError) {
        return {
          ...FALLBACK_DATA,
          date: new Date().toISOString().split("T")[0],
          metadata: {
            generatedAt: new Date().toISOString(),
            source: "fallback",
          },
        };
      }
    }
  }
}
