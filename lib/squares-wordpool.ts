import { deepseek } from "@ai-sdk/deepseek";
import { generateText } from "ai";
import { unstable_cache } from "next/cache";

const model = deepseek("deepseek-chat");

export interface DailySquares {
  grid: string[];
  words: string[];
  date: string;
  metadata?: {
    generatedAt: string;
    aiModel: string;
  };
}

const FALLBACK_DATA: DailySquares = {
  grid: [
    "F",
    "O",
    "O",
    "T",
    "N",
    "M",
    "T",
    "E",
    "R",
    "D",
    "S",
    "E",
    "A",
    "B",
    "N",
    "Y",
  ],
  words: [
    "FOOT",
    "NOTE",
    "TEND",
    "MOTE",
    "FORM",
    "FORT",
    "FONT",
    "TOE",
    "TON",
    "TEN",
    "NOT",
    "NET",
    "MEN",
    "MET",
    "ROT",
    "ROD",
    "SOD",
    "SET",
    "BET",
    "BAT",
    "BAN",
    "FAN",
    "FAT",
    "FAR",
    "FOR",
    "FORE",
    "TEAR",
    "NEAR",
    "FEAR",
    "BEAR",
    "BEAT",
    "SEAT",
    "SENT",
    "RENT",
    "DENT",
    "BENT",
    "FERN",
    "TERM",
    "TEAM",
    "MEAT",
  ],
  date: new Date().toISOString().split("T")[0],
};

function getNeighbors(index: number): number[] {
  const neighbors: number[] = [];
  const row = Math.floor(index / 4);
  const col = index % 4;

  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < 4 && c >= 0 && c < 4) {
        const neighborIndex = r * 4 + c;
        if (neighborIndex !== index) {
          neighbors.push(neighborIndex);
        }
      }
    }
  }
  return neighbors;
}

function canFindWord(word: string, grid: string[]): boolean {
  const upperWord = word.toUpperCase();

  // Helper for DFS
  const search = (
    index: number,
    wordIdx: number,
    visited: Set<number>,
  ): boolean => {
    if (wordIdx === upperWord.length) return true;

    const neighbors = getNeighbors(index);
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor) && grid[neighbor] === upperWord[wordIdx]) {
        visited.add(neighbor);
        if (search(neighbor, wordIdx + 1, visited)) return true;
        visited.delete(neighbor);
      }
    }
    return false;
  };

  // Start search from every matching first letter
  for (let i = 0; i < 16; i++) {
    if (grid[i] === upperWord[0]) {
      const visited = new Set<number>([i]);
      if (search(i, 1, visited)) return true;
    }
  }

  return false;
}

export async function generateDailySquares(
  date?: string,
): Promise<DailySquares> {
  const today = date || new Date().toISOString().split("T")[0];
  const prompt = `Generate a 4x4 Boggle-style grid of letters and a list of valid English words found in it for the date ${today}.
    
    Requirements:
    1. The grid must contain 16 letters (A-Z).
    2. The grid must contain at least 30 valid English words of 3 letters or more.
    3. Words must be formed by connecting adjacent letters (horizontally, vertically, or diagonally).
    4. Words must be common enough for a general audience.
    
    Return a JSON object with this structure:
    {
      "grid": ["A", "B", "C", "D", ...], // Array of 16 strings, row by row
      "words": ["WORD1", "WORD2", ...] // Array of valid words found in the grid
    }
    
    IMPORTANT: Return ONLY the JSON object, no markdown formatting.`;

  try {
    const { text } = await generateText({
      model: model,
      prompt,
    });

    const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();
    const parsed = JSON.parse(cleanText);

    // Basic validation
    if (
      !Array.isArray(parsed.grid) ||
      parsed.grid.length !== 16 ||
      !Array.isArray(parsed.words)
    ) {
      throw new Error("Invalid response structure");
    }

    const grid = parsed.grid.map((l: string) => l.toUpperCase());
    const validWords = (parsed.words as string[])
      .map((w) => w.toUpperCase())
      .filter((word) => word.length >= 3 && canFindWord(word, grid));

    const uniqueWords = Array.from(new Set(validWords));

    return {
      grid: grid,
      words: uniqueWords,
      date: today,
      metadata: {
        generatedAt: new Date().toISOString(),
        aiModel: "deepseek-chat",
      },
    };
  } catch (error) {
    console.error("Failed to generate squares puzzle:", error);
    throw error; // Let the cache handler deal with fallback
  }
}

export async function getDailySquares(): Promise<DailySquares> {
  const today = new Date().toISOString().split("T")[0];

  const getCached = unstable_cache(
    async () => {
      return generateDailySquares(today);
    },
    ["daily-squares-puzzle", today],
    {
      revalidate: 86400, // 24 hours
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
