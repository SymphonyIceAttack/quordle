import { unstable_cache } from "next/cache";
import { generateDailySquaresAdvanced } from "./advanced-wordlist";
import { type DailySquares, FALLBACK_DATA } from "./daily-squares-generator";
import { generateDailySquaresUltimate } from "./squares-dfs-generator";
import { generateDailySquaresFromList } from "./wordlist-dictionary";

export type { DailySquares };

export async function getDailySquares(): Promise<DailySquares> {
  const today = new Date().toISOString().split("T")[0];

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

      // 确保恰好30个唯一单词（20个核心 + 10个奖励）
      const uniqueWords = Array.from(new Set(result.words));
      const finalWords = uniqueWords.slice(0, 30);

      return {
        grid: result.grid,
        words: finalWords,
        coreWords: finalWords.slice(0, 20),
        bonusWords: finalWords.slice(20, 30),
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
    const result = await getCached();
    // 如果找到的单词太少，使用fallback数据
    if (!result.words || result.words.length < 20) {
      console.warn(
        `Only found ${result.words?.length || 0} words, using fallback data`,
      );
      return {
        ...FALLBACK_DATA,
        date: today,
        metadata: {
          generatedAt: new Date().toISOString(),
          source: "fallback-dense-grid",
        },
      };
    }
    return result;
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

      // 如果找到的单词太少，使用fallback数据
      if (result.words.length < 20) {
        console.warn(
          `Only found ${result.words.length} words from advanced list, using fallback`,
        );
        return {
          ...FALLBACK_DATA,
          date: today,
          metadata: {
            generatedAt: new Date().toISOString(),
            source: "fallback-dense-grid",
          },
        };
      }

      return {
        grid: result.grid,
        words: result.words,
        coreWords: result.words.slice(0, 20),
        bonusWords: result.words.slice(20, 30),
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

        // 如果找到的单词太少，使用fallback数据
        if (result.words.length < 20) {
          console.warn(
            `Only found ${result.words.length} words from basic list, using fallback`,
          );
          return {
            ...FALLBACK_DATA,
            date: today,
            metadata: {
              generatedAt: new Date().toISOString(),
              source: "fallback-dense-grid",
            },
          };
        }

        // 确保恰好30个唯一单词
        const uniqueWords = Array.from(new Set(result.words));
        const finalWords = uniqueWords.slice(0, 30);

        return {
          grid: result.grid,
          words: finalWords,
          coreWords: finalWords.slice(0, 20),
          bonusWords: finalWords.slice(20, 30),
          date: result.date,
          metadata: {
            ...result.metadata,
            source: result.metadata.source || "wordlist",
          },
        };
      } catch (_basicError) {
        return {
          ...FALLBACK_DATA,
          date: today,
          metadata: {
            generatedAt: new Date().toISOString(),
            source: "fallback",
          },
        };
      }
    }
  }
}
