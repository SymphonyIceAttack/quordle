/**
 * Squares游戏DFS算法生成器
 * - 使用深度优先搜索算法生成4x4网格
 * - 确保所有单词都能在网格中找到
 * - 支持相邻字母连接（8个方向）
 */

// 获取相邻格子（包括对角线）
function getNeighbors(index: number, gridSize: number = 5): number[] {
  const neighbors: number[] = [];
  const row = Math.floor(index / gridSize);
  const col = index % gridSize;

  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
        const neighborIndex = r * gridSize + c;
        if (neighborIndex !== index) {
          neighbors.push(neighborIndex);
        }
      }
    }
  }
  return neighbors;
}

/**
 * 使用DFS检查单词是否能在网格中找到
 */
export function canFindWord(word: string, grid: string[]): boolean {
  const upperWord = word.toUpperCase();
  const visited = new Set<number>();

  // DFS搜索函数
  const search = (index: number, wordIdx: number): boolean => {
    if (wordIdx === upperWord.length) return true;
    if (grid[index] !== upperWord[wordIdx]) return false;

    visited.add(index);
    const neighbors = getNeighbors(index);

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (search(neighbor, wordIdx + 1)) {
          visited.delete(index);
          return true;
        }
      }
    }

    visited.delete(index);
    return false;
  };

  // 尝试从每个格子开始搜索
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] === upperWord[0]) {
      visited.clear();
      if (search(i, 0)) return true;
    }
  }

  return false;
}

/**
 * 获取单词在网格中的路径
 */
export function getWordPath(word: string, grid: string[]): number[] | null {
  const upperWord = word.toUpperCase();
  const visited = new Set<number>();
  const path: number[] = [];

  const search = (index: number, wordIdx: number): boolean => {
    path.push(index);

    if (wordIdx === upperWord.length) return true;

    if (grid[index] !== upperWord[wordIdx]) {
      path.pop();
      return false;
    }

    visited.add(index);
    const neighbors = getNeighbors(index);

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (search(neighbor, wordIdx + 1)) {
          return true;
        }
      }
    }

    visited.delete(index);
    path.pop();
    return false;
  };

  // 尝试从每个格子开始
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] === upperWord[0]) {
      visited.clear();
      path.length = 0;
      if (search(i, 0)) {
        return path.slice();
      }
    }
  }

  return null;
}

/**
 * 智能单词放置算法
 * 尝试将单词放置在网格中，支持8个方向和字母重叠
 */
function _placeWordInGrid(
  grid: (string | null)[],
  word: string,
  row: number,
  col: number,
  dirRow: number,
  dirCol: number,
  isFirstWord: boolean = false,
): { success: boolean; path: number[] } {
  const path: number[] = [];
  const wordUpper = word.toUpperCase();

  // 检查单词是否能完全放置
  for (let i = 0; i < wordUpper.length; i++) {
    const newRow = row + i * dirRow;
    const newCol = col + i * dirCol;

    // 检查边界
    if (newRow < 0 || newRow >= 5 || newCol < 0 || newCol >= 5) {
      return { success: false, path: [] };
    }

    const index = newRow * 5 + newCol;
    const existingLetter = grid[index];

    // 如果是第一个单词，允许自由放置（所有位置都为空）
    // 如果不是第一个单词，检查字母是否匹配（空位置或相同字母）
    if (
      !isFirstWord &&
      existingLetter !== null &&
      existingLetter !== wordUpper[i]
    ) {
      return { success: false, path: [] };
    }

    // 如果是第一个单词但位置已被占用，则失败
    if (isFirstWord && existingLetter !== null) {
      return { success: false, path: [] };
    }

    path.push(index);
  }

  // 放置单词
  for (let i = 0; i < wordUpper.length; i++) {
    const index = path[i];
    grid[index] = wordUpper[i];
  }

  return { success: true, path };
}

/**
 * 使用递归搜索放置单词（允许转弯）
 */
function placeWordRecursive(
  grid: (string | null)[],
  word: string,
  index: number,
  path: number[],
  visited: Set<number>,
): number[] | null {
  if (index === word.length) {
    return [...path];
  }

  const currentIndex = path[path.length - 1];
  const row = Math.floor(currentIndex / 5);
  const col = currentIndex % 5;

  // 尝试所有相邻位置（包括对角线）
  for (let r = row - 1; r <= row + 1; r++) {
    for (let c = col - 1; c <= col + 1; c++) {
      if (r === row && c === col) continue; // 跳过当前位置
      if (r < 0 || r >= 5 || c < 0 || c >= 5) continue;

      const neighborIndex = r * 5 + c;
      if (visited.has(neighborIndex)) continue;

      const letter = grid[neighborIndex];
      if (letter !== word[index] && letter !== null) continue;

      // 临时放置字母
      const tempLetter = grid[neighborIndex];
      grid[neighborIndex] = word[index];

      visited.add(neighborIndex);
      path.push(neighborIndex);

      const result = placeWordRecursive(grid, word, index + 1, path, visited);

      if (result) {
        return result;
      }

      // 回溯
      path.pop();
      visited.delete(neighborIndex);
      grid[neighborIndex] = tempLetter;
    }
  }

  return null;
}

/**
 * 使用回溯算法生成网格
 */
function generateGridWithWordPlacement(words: string[]): {
  grid: string[];
  foundWords: string[];
  wordPaths: Record<string, number[]>;
} {
  const wordPaths: Record<string, number[]> = {};
  const grid: (string | null)[] = new Array(25).fill(null);

  // 按单词长度排序（长单词优先，更容易放置）
  const sortedWords = [...words].sort((a, b) => b.length - a.length);

  // 记录所有成功放置的单词
  const placedWords: string[] = [];

  // 为每个单词寻找放置位置
  for (const [index, word] of sortedWords.entries()) {
    const wordUpper = word.toUpperCase();
    let placed = false;

    // 第一个单词可以自由放置（不需要匹配现有字母）
    const _isFirstWord = index === 0;

    // 尝试所有可能的起始位置
    for (let startIndex = 0; startIndex < 25 && !placed; startIndex++) {
      if (grid[startIndex] !== null && grid[startIndex] !== wordUpper[0]) {
        continue; // 第一个字母必须匹配
      }

      const path = [startIndex];
      const visited = new Set<number>([startIndex]);

      // 临时放置第一个字母
      const tempLetter = grid[startIndex];
      grid[startIndex] = wordUpper[0];

      // 递归放置剩余字母
      const result = placeWordRecursive(grid, wordUpper, 1, path, visited);

      if (result && result.length === wordUpper.length) {
        wordPaths[wordUpper] = result;
        placedWords.push(wordUpper);
        placed = true;
      } else {
        // 回溯
        grid[startIndex] = tempLetter;
      }
    }
  }

  // 如果没有放置任何单词，返回空结果
  if (placedWords.length === 0) {
    return {
      grid: [],
      foundWords: [],
      wordPaths: {},
    };
  }

  // 用常用字母填充空位
  const commonLetters = [
    "E",
    "T",
    "A",
    "O",
    "I",
    "N",
    "S",
    "H",
    "R",
    "D",
    "L",
    "U",
  ];
  for (let i = 0; i < grid.length; i++) {
    if (grid[i] === null) {
      grid[i] = commonLetters[Math.floor(Math.random() * commonLetters.length)];
    }
  }

  // 验证放置的单词是否真的可以找到
  const verifiedWords: string[] = [];
  const verifiedPaths: Record<string, number[]> = {};

  for (const word of placedWords) {
    const path = getWordPath(word, grid as string[]);
    if (path) {
      verifiedWords.push(word);
      verifiedPaths[word] = path;
    }
  }

  return {
    grid: grid as string[],
    foundWords: verifiedWords,
    wordPaths: verifiedPaths,
  };
}

/**
 * 生成包含指定单词的网格（改进版）
 */
export function generateGridWithWords(words: string[]): {
  grid: string[];
  foundWords: string[];
  wordPaths: Record<string, number[]>;
} {
  // 限制单词数量以提高成功率
  const maxWords = Math.min(words.length, 10);
  const selectedWords = words.slice(0, maxWords);

  // 使用智能放置算法
  return generateGridWithWordPlacement(selectedWords);
}

/**
 * 智能网格生成器（增强版）
 * 尝试多次生成，使用不同的单词选择和放置策略
 */
export function generateOptimalGrid(
  words: string[],
  maxAttempts: number = 50,
): {
  grid: string[];
  foundWords: string[];
  wordPaths: Record<string, number[]>;
  successRate: number;
} {
  let bestGrid: {
    grid: string[];
    foundWords: string[];
    wordPaths: Record<string, number[]>;
  } | null = null;
  let bestScore = 0;

  // 预过滤：优先3-6字母单词（现在使用5x5网格，支持更丰富的长度）
  const filteredWords = words.filter((w) => w.length >= 3 && w.length <= 6);

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      // 每次尝试使用不同的单词组合和排序
      const shuffledWords = [...filteredWords].sort(() => Math.random() - 0.5);

      // 随机选择单词数量（25-40个，支持更多核心单词）
      const wordCount = Math.floor(Math.random() * 16) + 25;
      const selectedWords = shuffledWords.slice(0, wordCount);

      const result = generateGridWithWords(selectedWords);

      // 计算得分：找到的单词数 + 单词平均长度 + 放置效率 + 长度多样性
      const avgLength =
        result.foundWords.length > 0
          ? result.foundWords.reduce((sum, w) => sum + w.length, 0) /
            result.foundWords.length
          : 0;

      // 计算长度多样性（不同长度的数量）
      const uniqueLengths = new Set(result.foundWords.map((w) => w.length))
        .size;
      // 显著提高长度多样性权重，确保算法优先选择包含更多不同长度的网格
      const lengthDiversityBonus = uniqueLengths * 20; // 每个不同长度加20分（原5分）

      const placementEfficiency =
        result.foundWords.length / selectedWords.length;
      const score =
        result.foundWords.length * 3 +
        avgLength +
        placementEfficiency * 10 +
        lengthDiversityBonus;

      if (attempt === 0 || score > bestScore) {
        bestScore = score;
        bestGrid = result;
      }

      // 如果成功率很高（>70%），提前结束
      if (
        result.foundWords.length >= selectedWords.length * 0.7 &&
        result.foundWords.length >= 4
      ) {
        break;
      }
    } catch (_error) {
      // Silent fail - try next attempt
    }
  }

  const successRate = bestGrid ? bestGrid.foundWords.length / words.length : 0;

  // Always return a valid grid, even if it's empty
  if (!bestGrid) {
    // Create a fallback grid using letters from the selected words
    const fallbackGrid: string[] = new Array(25).fill(null);
    const _lettersFromWords = words.join("").toUpperCase().split("");

    // Try to place words in a simple pattern first
    const sortedWords = [...words].sort((a, b) => b.length - a.length);
    let gridIndex = 0;

    for (const word of sortedWords.slice(0, 5)) {
      for (const letter of word.toUpperCase()) {
        if (gridIndex < 25) {
          fallbackGrid[gridIndex] = letter;
          gridIndex++;
        }
      }
    }

    // Fill remaining cells with common letters
    const commonLetters = ["E", "T", "A", "O", "I", "N", "S", "H", "R"];
    while (gridIndex < 25) {
      fallbackGrid[gridIndex] = commonLetters[gridIndex % commonLetters.length];
      gridIndex++;
    }

    return {
      grid: fallbackGrid,
      foundWords: [], // No words successfully placed
      wordPaths: {},
      successRate: 0,
    };
  }

  return {
    ...bestGrid,
    successRate,
  };
}

/**
 * 生成每日Squares谜题（终极版）
 */
export async function generateDailySquaresUltimate(
  date?: string,
  minWords: number = 35,
  maxWords: number = 50,
): Promise<{
  grid: string[];
  words: string[];
  coreWords: string[];
  bonusWords: string[];
  wordPaths: Record<string, number[]>;
  successRate: number;
  date: string;
  metadata: {
    generatedAt: string;
    source: string;
    algorithm: string;
    verified: boolean;
  };
}> {
  const today = date || new Date().toISOString().split("T")[0];

  // 导入词库
  const { generateDailySquaresAdvanced } = await import("./advanced-wordlist");

  // 获取可用单词（3-6字母）
  const squaresData = await generateDailySquaresAdvanced(today);
  const availableWords = squaresData.words.filter(
    (w) => w.length >= 3 && w.length <= 6,
  );

  // 将单词分为核心单词（前30个）和奖励单词（剩余的）
  const coreWords = availableWords.slice(0, 30);
  const bonusWords = availableWords.slice(30, 50);

  // 随机选择一定数量的单词
  const seedRandom = (seed: string): number => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      const char = seed.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  };

  const random = seedRandom(today);
  const numWords = Math.min(
    maxWords,
    Math.max(minWords, minWords + (random % (maxWords - minWords + 1))),
  );

  // 选择单词
  let selectedWords: string[] = [];
  const usedIndices = new Set<number>();

  for (let i = 0; i < numWords && selectedWords.length < numWords; i++) {
    const index = (random + i * 9973) % availableWords.length;
    if (!usedIndices.has(index)) {
      selectedWords.push(availableWords[index].toUpperCase());
      usedIndices.add(index);
    }
  }

  // 确保选择的单词组合的unique letters <= 16
  let uniqueLetters = [
    ...new Set(selectedWords.join("").toUpperCase().split("")),
  ];
  if (uniqueLetters.length > 16) {
    // 逐步减少单词数量，直到.unique letters <= 16
    let attempts = 0;
    while (attempts < 20) {
      const newCount = Math.max(10, numWords - attempts * 3);
      selectedWords = [];
      usedIndices.clear();

      for (let i = 0; i < newCount && selectedWords.length < newCount; i++) {
        const idx = (random + i * 9973) % availableWords.length;
        if (!usedIndices.has(idx)) {
          selectedWords.push(availableWords[idx].toUpperCase());
          usedIndices.add(idx);
        }
      }

      uniqueLetters = [
        ...new Set(selectedWords.join("").toUpperCase().split("")),
      ];
      if (uniqueLetters.length <= 16) {
        break;
      }
      attempts++;
    }
  }

  if (selectedWords.length === 0) {
    throw new Error("No words selected for grid generation");
  }

  try {
    // 使用智能生成器创建网格
    const result = generateOptimalGrid(selectedWords, 50);

    if (!result || !result.grid || !result.foundWords) {
      throw new Error("Invalid result from generateOptimalGrid");
    }

    // 重新分配核心和奖励单词（基于实际成功放置的单词）
    const actualWords = result.foundWords;
    const newCoreWords = actualWords.slice(0, Math.min(30, actualWords.length));
    const newBonusWords = actualWords.slice(30);

    return {
      grid: result.grid,
      words: actualWords,
      coreWords: newCoreWords,
      bonusWords: newBonusWords,
      wordPaths: result.wordPaths || {},
      successRate: result.successRate || 0,
      date: today,
      metadata: {
        generatedAt: new Date().toISOString(),
        source: "advanced-wordlist",
        algorithm: "DFS-Smart",
        verified: true,
      },
    };
  } catch (_error) {
    // Return a fallback grid
    return {
      grid: [
        "R",
        "E",
        "S",
        "O",
        "A",
        "I",
        "T",
        "N",
        "D",
        "U",
        "C",
        "H",
        "Y",
        "K",
        "W",
        "G",
      ],
      words: availableWords,
      coreWords: coreWords,
      bonusWords: bonusWords,
      wordPaths: {},
      successRate: 0,
      date: today,
      metadata: {
        generatedAt: new Date().toISOString(),
        source: "advanced-wordlist-fallback",
        algorithm: "DFS-Smart-Failed",
        verified: false,
      },
    };
  }
}

/**
 * 批量验证多个单词
 */
export function validateWordsInGrid(
  words: string[],
  grid: string[],
): {
  valid: string[];
  invalid: string[];
  paths: Record<string, number[]>;
} {
  const valid: string[] = [];
  const invalid: string[] = [];
  const paths: Record<string, number[]> = {};

  words.forEach((word) => {
    const path = getWordPath(word, grid);
    if (path) {
      valid.push(word.toUpperCase());
      paths[word.toUpperCase()] = path;
    } else {
      invalid.push(word.toUpperCase());
    }
  });

  return { valid, invalid, paths };
}
