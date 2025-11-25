// 注意：现在主要使用 wordlist-dictionary.ts 中的 generateDailySquaresFromList 函数
// 此文件保留用于 DFS 验证算法和其他工具函数

export interface DailySquares {
  grid: string[];
  words: string[];
  coreWords: string[];
  bonusWords: string[];
  date: string;
  metadata?: {
    generatedAt: string;
    source: string; // 数据来源标识
  };
}

export const FALLBACK_DATA: DailySquares = {
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
  coreWords: [
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
  ],
  bonusWords: [
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
  metadata: {
    generatedAt: new Date().toISOString(),
    source: "fallback",
  },
};

function getNeighbors(index: number): number[] {
  const neighbors: number[] = [];
  const row = Math.floor(index / 5);
  const col = index % 5;

  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < 5 && c >= 0 && c < 5) {
        const neighborIndex = r * 5 + c;
        if (neighborIndex !== index) {
          neighbors.push(neighborIndex);
        }
      }
    }
  }
  return neighbors;
}

function _canFindWord(word: string, grid: string[]): boolean {
  const upperWord = word.toUpperCase();

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
  // This function is deprecated - use generateDailySquaresFromList in wordlist-dictionary.ts
  // Kept for backwards compatibility
  const { generateDailySquaresFromList } = await import(
    "./wordlist-dictionary"
  );
  return generateDailySquaresFromList(date);
}
