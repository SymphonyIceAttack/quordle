"use client";

import { Bug, Lightbulb, RefreshCw, Share2, Undo2 } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { soundManager } from "@/lib/sound-manager";
import type { DailySquares } from "@/lib/squares-wordpool";
import { cn } from "@/lib/utils";

interface SquaresGameProps {
  initialData: DailySquares;
}

export function SquaresGame({ initialData }: SquaresGameProps) {
  const [selectedTiles, setSelectedTiles] = React.useState<number[]>([]);
  const [foundWords, setFoundWords] = React.useState<string[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [sortMode, setSortMode] = React.useState<"order" | "length">("length");
  const [hintsRemaining, setHintsRemaining] = React.useState(3);
  const [hintTile, setHintTile] = React.useState<number | null>(null);
  const [showDebug, setShowDebug] = React.useState(false);
  const [showBonusWords, setShowBonusWords] = React.useState(false);
  const isDevelopment = process.env.NEXT_PUBLIC_DEV_MODE === "development";
  const gridRef = React.useRef<HTMLDivElement>(null);

  const boardLetters = initialData.grid;
  // 计算网格大小（支持4x4和5x5）
  const gridSize = Math.sqrt(boardLetters.length);

  // 分离核心单词和奖励单词
  const coreWords = React.useMemo(
    () =>
      Array.from(
        new Set(initialData.coreWords || initialData.words.slice(0, 30)),
      ),
    [initialData.coreWords, initialData.words],
  );

  const bonusWords = React.useMemo(
    () =>
      Array.from(
        new Set(initialData.bonusWords || initialData.words.slice(30)),
      ),
    [initialData.bonusWords, initialData.words],
  );

  // 当前可见的单词列表（默认隐藏所有单词）
  const visibleWords = React.useMemo(() => {
    // 所有模式：默认显示0个单词
    return showBonusWords ? [...coreWords, ...bonusWords] : [];
  }, [coreWords, bonusWords, showBonusWords]);

  const allWords = React.useMemo(() => {
    const unique = Array.from(new Set(initialData.words));
    // Ensure exactly 30 unique words
    return unique.slice(0, 30);
  }, [initialData.words]);

  const validWords = React.useMemo(() => new Set(allWords), [allWords]);

  const totalWords = allWords.length;
  const coreWordsTotal = coreWords.length;
  const bonusWordsTotal = bonusWords.length;

  // 检查是否找到所有核心单词
  const coreWordsCompleted = React.useMemo(() => {
    const foundCoreWords = foundWords.filter((w) => coreWords.includes(w));
    return foundCoreWords.length === coreWordsTotal && coreWordsTotal > 0;
  }, [foundWords, coreWords, coreWordsTotal]);

  // 当完成所有核心单词时，自动显示提示
  React.useEffect(() => {
    if (coreWordsCompleted && !showBonusWords && bonusWordsTotal > 0) {
      const timer = setTimeout(() => {
        toast.success("🎉 All core words found! Bonus words unlocked!", {
          duration: 5000,
        });
        setShowBonusWords(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [coreWordsCompleted, showBonusWords, bonusWordsTotal]);

  const wordCategories = React.useMemo(() => {
    const categories: Record<number, { found: number; total: number }> = {};

    visibleWords.forEach((word) => {
      const len = word.length;
      if (!categories[len]) {
        categories[len] = { found: 0, total: 0 };
      }
      categories[len].total++;
    });

    foundWords.forEach((word) => {
      const len = word.length;
      if (categories[len]) {
        categories[len].found++;
      }
    });

    return Object.entries(categories)
      .map(([len, data]) => ({
        length: Number.parseInt(len, 10),
        found: data.found,
        total: data.total,
      }))
      .sort((a, b) => a.length - b.length);
  }, [visibleWords, foundWords]);

  const currentWord = selectedTiles
    .map((index) => boardLetters[index])
    .join("");

  const isAdjacent = (index1: number, index2: number) => {
    const row1 = Math.floor(index1 / gridSize);
    const col1 = index1 % gridSize;
    const row2 = Math.floor(index2 / gridSize);
    const col2 = index2 % gridSize;
    return Math.abs(row1 - row2) <= 1 && Math.abs(col1 - col2) <= 1;
  };

  const handleTileSelect = (index: number) => {
    if (selectedTiles.includes(index)) {
      if (index === selectedTiles[selectedTiles.length - 1]) {
      } else if (
        selectedTiles.length > 1 &&
        index === selectedTiles[selectedTiles.length - 2]
      ) {
        setSelectedTiles(selectedTiles.slice(0, -1));
      } else {
        const newSelection = selectedTiles.slice(
          0,
          selectedTiles.indexOf(index) + 1,
        );
        setSelectedTiles(newSelection);
      }
    } else {
      if (
        selectedTiles.length === 0 ||
        isAdjacent(index, selectedTiles[selectedTiles.length - 1])
      ) {
        soundManager?.playConnect();
        setSelectedTiles([...selectedTiles, index]);
      }
    }
  };

  const handleMouseDown = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    handleTileSelect(index);
  };

  const handleMouseEnter = (index: number) => {
    if (isDragging) {
      handleTileSelect(index);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (
      currentWord.length >= 3 &&
      !foundWords.includes(currentWord) &&
      validWords.has(currentWord)
    ) {
      setFoundWords((prev) => [...prev, currentWord]);
      setSelectedTiles([]);
      soundManager?.playGearTooth();
      soundManager?.vibrate(100);
      if (hintTile !== null && selectedTiles[0] === hintTile) {
        setHintTile(null);
      }
      toast.success(`Found: ${currentWord}`);
    } else {
      setSelectedTiles([]);
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    // Ensure we only track the first touch
    const touch = e.touches[0];
    const index = getIndexFromPoint(touch.clientX, touch.clientY);
    if (index !== -1) {
      handleTileSelect(index);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isDragging) return;
    // Only track first touch
    const touch = e.touches[0];
    if (!touch) return;

    const index = getIndexFromPoint(touch.clientX, touch.clientY);
    if (index !== -1) {
      handleTileSelect(index);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (
      currentWord.length >= 3 &&
      !foundWords.includes(currentWord) &&
      validWords.has(currentWord)
    ) {
      setFoundWords((prev) => [...prev, currentWord]);
      setSelectedTiles([]);
      soundManager?.playGearTooth();
      soundManager?.vibrate(100);
      if (hintTile !== null && selectedTiles[0] === hintTile) {
        setHintTile(null);
      }
      toast.success(`Found: ${currentWord}`);
    } else {
      setSelectedTiles([]);
    }
  };

  const getIndexFromPoint = (x: number, y: number) => {
    if (!gridRef.current) return -1;
    const rect = gridRef.current.getBoundingClientRect();
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom)
      return -1;

    // More precise calculation considering padding and gaps
    const padding = 8; // account for grid padding
    const totalWidth = rect.width;
    const totalHeight = rect.height;
    const innerWidth = totalWidth - padding * 2;
    const innerHeight = totalHeight - padding * 2;

    const relativeX = x - rect.left - padding;
    const relativeY = y - rect.top - padding;

    // Each cell occupies equal percentage with gaps between
    const cellWidth = innerWidth / gridSize;
    const cellHeight = innerHeight / gridSize;

    // Calculate column and row with better precision
    const col = Math.min(
      gridSize - 1,
      Math.max(0, Math.floor(relativeX / cellWidth)),
    );
    const row = Math.min(
      gridSize - 1,
      Math.max(0, Math.floor(relativeY / cellHeight)),
    );

    return row * gridSize + col;
  };

  React.useEffect(() => {
    const handleGlobalMouseUp = () => setIsDragging(false);
    window.addEventListener("mouseup", handleGlobalMouseUp);
    return () => window.removeEventListener("mouseup", handleGlobalMouseUp);
  }, []);

  const handleShuffle = () => {
    setSelectedTiles([]);
  };

  const handleUndo = () => {
    if (selectedTiles.length > 0) {
      setSelectedTiles((prev) => prev.slice(0, -1));
    }
  };

  const handleHint = () => {
    if (hintsRemaining <= 0) {
      toast.error("No hints remaining!");
      return;
    }

    // 优先为核心单词提供提示
    const unfoundCoreWords = coreWords.filter((w) => !foundWords.includes(w));
    const unfoundWords = visibleWords.filter((w) => !foundWords.includes(w));

    if (unfoundWords.length === 0) {
      toast.success("You found all visible words!");
      return;
    }

    // 首先尝试为核心单词提供提示
    let wordsToConsider = unfoundCoreWords;
    if (wordsToConsider.length === 0 && showBonusWords) {
      wordsToConsider = bonusWords.filter((w) => !foundWords.includes(w));
    }

    if (wordsToConsider.length === 0) {
      toast.success("All core words found!");
      return;
    }

    // Prefer shorter words for hints to make them easier to find
    const sortedWords = [...wordsToConsider].sort(
      (a, b) => a.length - b.length,
    );
    const wordsPool = sortedWords.slice(0, Math.min(5, sortedWords.length));
    const randomWord = wordsPool[Math.floor(Math.random() * wordsPool.length)];
    const path = findWordPath(randomWord);

    if (path && path.length > 0) {
      setHintsRemaining((prev) => prev - 1);
      setHintTile(path[0]);
      toast.info(
        `💡 Hint: Find a ${randomWord.length}-letter word starting with '${randomWord[0]}' at the highlighted tile!`,
        {
          duration: 4000,
        },
      );

      setTimeout(() => {
        setHintTile(null);
      }, 4000);
    } else {
      toast.error("Could not generate a hint.");
    }
  };

  const handleShare = () => {
    const text = `Squares - ${new Date().toLocaleDateString()}\nWords Found: ${foundWords.length}/${totalWords}\n\nPlay at: ${window.location.origin}/squares`;
    navigator.clipboard.writeText(text);
    toast.success("Results copied to clipboard!");
  };

  const findWordPath = React.useCallback(
    (word: string): number[] | null => {
      const rows = 5;
      const cols = 5;

      const dfs = (
        index: number,
        currentWord: string,
        visited: Set<number>,
      ): number[] | null => {
        if (currentWord === word) return Array.from(visited);
        if (!word.startsWith(currentWord)) return null;

        const row = Math.floor(index / 5);
        const col = index % 5;

        for (let r = row - 1; r <= row + 1; r++) {
          for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < rows && c >= 0 && c < cols) {
              const neighborIndex = r * 5 + c;
              if (!visited.has(neighborIndex)) {
                const nextChar = boardLetters[neighborIndex];
                if (word[currentWord.length] === nextChar) {
                  const newVisited = new Set(visited);
                  newVisited.add(neighborIndex);
                  const path = dfs(
                    neighborIndex,
                    currentWord + nextChar,
                    newVisited,
                  );
                  if (path) return path;
                }
              }
            }
          }
        }
        return null;
      };

      for (let i = 0; i < 25; i++) {
        if (boardLetters[i] === word[0]) {
          const path = dfs(i, word[0], new Set([i]));
          if (path) return path;
        }
      }
      return null;
    },
    [boardLetters],
  );

  const getTileCenter = (index: number) => {
    if (!gridRef.current) {
      const col = index % gridSize;
      const row = Math.floor(index / gridSize);
      // Calculate cell size based on grid size (100 / gridSize for viewBox)
      const cellSize = 100 / gridSize;
      return {
        x: col * cellSize + cellSize / 2,
        y: row * cellSize + cellSize / 2,
      };
    }

    const rect = gridRef.current.getBoundingClientRect();
    const padding = 8; // account for grid padding and gaps
    const gap = 8; // grid gap size (gap-2 sm:gap-3 ~ 8-12px)
    const cellWidth =
      (rect.width - padding * 2 - gap * (gridSize - 1)) / gridSize;
    const cellHeight =
      (rect.height - padding * 2 - gap * (gridSize - 1)) / gridSize;

    const col = index % gridSize;
    const row = Math.floor(index / gridSize);

    const x = padding + col * (cellWidth + gap) + cellWidth / 2;
    const y = padding + row * (cellHeight + gap) + cellHeight / 2;

    // Convert to viewBox coordinates (0-100)
    const viewBoxSize = 100;
    return {
      x: (x / rect.width) * viewBoxSize,
      y: (y / rect.height) * viewBoxSize,
    };
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8 select-none">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] gap-8 items-start">
        <div className="flex flex-col gap-8">
          <div className="relative px-2">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-green-500 text-white font-bold px-3 py-1 rounded-lg text-sm shadow-sm">
                {foundWords.length}
              </div>
              <div className="bg-muted text-muted-foreground font-bold px-3 py-1 rounded-lg text-sm">
                {totalWords}
              </div>
            </div>
            {/* 核心单词进度条 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-medium">Core Words</span>
                <span className="text-muted-foreground">
                  {foundWords.filter((w) => coreWords.includes(w)).length} /{" "}
                  {coreWordsTotal}
                </span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-green-500 transition-all duration-300"
                  style={{
                    width: `${(foundWords.filter((w) => coreWords.includes(w)).length / coreWordsTotal) * 100}%`,
                  }}
                />
              </div>
            </div>
            {/* 奖励单词进度条（始终显示） */}
            {bonusWordsTotal > 0 && (
              <div className="space-y-2 mt-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium flex items-center gap-1">
                    Bonus Words <span className="text-xs">⭐</span>
                  </span>
                  <span className="text-muted-foreground">
                    {foundWords.filter((w) => bonusWords.includes(w)).length} /{" "}
                    {bonusWordsTotal}
                  </span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="absolute top-0 left-0 h-full bg-blue-500 transition-all duration-300"
                    style={{
                      width: `${(foundWords.filter((w) => bonusWords.includes(w)).length / bonusWordsTotal) * 100}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="h-20 flex items-center justify-center">
            <h2
              className={cn(
                "text-4xl md:text-5xl font-bold tracking-widest uppercase min-h-[3rem] transition-all duration-200",
                currentWord.length > 0
                  ? "text-foreground animate-pulse"
                  : "text-muted-foreground",
                validWords.has(currentWord) &&
                  currentWord.length >= 3 &&
                  "text-green-600",
              )}
            >
              {currentWord || "Select letters"}
            </h2>
          </div>

          <div
            className="relative w-full max-w-[450px] mx-auto aspect-square"
            ref={gridRef}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={() => setIsDragging(false)}
            style={{
              touchAction: "none", // Prevent default touch behaviors (scroll, zoom)
            }}
          >
            <svg
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 w-full h-full pointer-events-none z-10 overflow-visible"
            >
              {selectedTiles.length > 1 && (
                <polyline
                  points={selectedTiles
                    .map((index) => {
                      const { x, y } = getTileCenter(index);
                      return `${x},${y}`;
                    })
                    .join(" ")}
                  fill="none"
                  stroke="#FCD34D"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="opacity-90 drop-shadow-lg"
                />
              )}
            </svg>

            <div
              className={`grid gap-2 sm:gap-3 w-full h-full p-1`}
              style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
            >
              {boardLetters.map((letter, index) => {
                const isSelected = selectedTiles.includes(index);
                const isHint = hintTile === index;
                return (
                  <div
                    key={index}
                    onMouseDown={(e) => handleMouseDown(index, e)}
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseUp={handleMouseUp}
                    className={cn(
                      "relative flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold rounded-xl shadow-sm transition-all duration-200 cursor-pointer z-20 min-h-[60px] sm:min-h-[70px] md:min-h-[80px]",
                      "bg-blue-50/50 dark:bg-secondary/50 hover:bg-blue-100/70 dark:hover:bg-secondary/80 active:scale-95",
                      isSelected &&
                        "bg-[#FDE68A] dark:bg-yellow-900/50 text-foreground transform scale-105 shadow-lg ring-2 ring-yellow-400",
                      isHint &&
                        !isSelected &&
                        "ring-4 ring-yellow-400 ring-opacity-75 animate-pulse bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/60 dark:to-amber-900/60 shadow-xl",
                      "select-none -webkit-tap-highlight-transparent",
                    )}
                    style={{
                      WebkitTapHighlightColor: "transparent",
                      touchAction: "manipulation",
                    }}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 m-auto w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FCD34D] dark:bg-yellow-600 -z-10 shadow-md" />
                    )}
                    <span className="relative z-10 drop-shadow-sm">
                      {letter}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between max-w-[400px] mx-auto w-full">
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-xl h-12 w-12 bg-blue-50/50 dark:bg-secondary/50 hover:bg-blue-100/50 relative"
                onClick={handleHint}
                disabled={hintsRemaining <= 0}
              >
                <Lightbulb
                  className={cn(
                    "h-5 w-5 text-foreground",
                    hintsRemaining === 0 && "opacity-50",
                  )}
                />
                <span className="absolute top-1 right-1.5 text-[10px] font-bold">
                  {hintsRemaining}
                </span>
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-xl h-12 w-12 bg-blue-50/50 dark:bg-secondary/50 hover:bg-blue-100/50"
                onClick={handleShare}
              >
                <Share2 className="h-5 w-5 text-foreground" />
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-xl h-12 w-12 bg-blue-50/50 dark:bg-secondary/50 hover:bg-blue-100/50"
                onClick={handleUndo}
                disabled={selectedTiles.length === 0}
                title="Undo last selection"
              >
                <Undo2 className="h-5 w-5 text-foreground" />
              </Button>
              {isDevelopment && (
                <Button
                  variant={showDebug ? "destructive" : "secondary"}
                  size="icon"
                  className="rounded-xl h-12 w-12"
                  onClick={() => setShowDebug(!showDebug)}
                  title="Toggle Developer Mode"
                >
                  <Bug className="h-5 w-5" />
                </Button>
              )}
              {isDevelopment && (
                <Button
                  variant={showBonusWords ? "default" : "secondary"}
                  size="icon"
                  className={cn(
                    "rounded-xl h-12 w-12",
                    showBonusWords &&
                      "bg-blue-500 hover:bg-blue-600 text-white",
                  )}
                  onClick={() => setShowBonusWords(!showBonusWords)}
                  title={
                    showBonusWords ? "Hide bonus words" : "Show bonus words"
                  }
                >
                  <Lightbulb className="h-5 w-5" />
                </Button>
              )}
              <Button
                variant="secondary"
                size="icon"
                className="rounded-xl h-12 w-12 bg-blue-50/50 dark:bg-secondary/50 hover:bg-blue-100/50"
                onClick={handleShuffle}
                title="Clear selection"
              >
                <RefreshCw className="h-5 w-5 text-foreground" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* 解锁提示 */}
          {!isDevelopment && !showBonusWords && bonusWordsTotal > 0 && (
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-300 text-center">
                💡 Find all {coreWordsTotal} core words to unlock{" "}
                {bonusWordsTotal} bonus words!
              </p>
            </div>
          )}
          <div className="flex justify-between items-center gap-2">
            <div className="flex gap-2">
              <Button
                variant={sortMode === "order" ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "font-bold",
                  sortMode === "order" && "bg-muted/50 hover:bg-muted",
                )}
                onClick={() => setSortMode("order")}
              >
                By order
              </Button>
              <Button
                variant={sortMode === "length" ? "secondary" : "ghost"}
                size="sm"
                className={cn(
                  "font-bold",
                  sortMode === "length" && "bg-muted/50 hover:bg-muted",
                )}
                onClick={() => setSortMode("length")}
              >
                By length
              </Button>
            </div>
            {/* 奖励单词解锁按钮 */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const coreWordsFound = foundWords.filter((w) =>
                  coreWords.includes(w),
                ).length;
                if (coreWordsFound === coreWordsTotal) {
                  setShowBonusWords(true);
                  toast.success("🎉 Bonus words unlocked!");
                } else {
                  toast.info(
                    `Find ${coreWordsTotal - coreWordsFound} more core words to unlock bonus words!`,
                  );
                }
              }}
              className="font-bold border-blue-300 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950"
            >
              ⭐ Unlock Bonus Words
            </Button>
          </div>

          <Card className="flex flex-col p-6 shadow-sm border border-border/50 bg-white dark:bg-card h-[500px]">
            <div className="space-y-6 flex flex-col h-full">
              <div className="font-bold text-lg shrink-0">
                {showBonusWords
                  ? `Words found: ${foundWords.length} / ${visibleWords.length}`
                  : `Core words: ${foundWords.filter((w) => coreWords.includes(w)).length} / ${coreWordsTotal}`}
                {bonusWordsTotal > 0 && !showBonusWords && (
                  <span className="text-sm text-muted-foreground ml-2">
                    (+{bonusWordsTotal} bonus words)
                  </span>
                )}
              </div>

              <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                {visibleWords.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                    <Lightbulb className="h-8 w-8 mb-3" />
                    <p className="text-sm font-medium mb-1">
                      Click lightbulb to show word list
                    </p>
                    <p className="text-xs text-center">
                      Then connect letters in the grid to find words
                    </p>
                  </div>
                ) : sortMode === "length" ? (
                  <div className="space-y-6">
                    {wordCategories.map((cat) => {
                      // 获取该长度的所有单词（已找到和未找到的）
                      const allWordsInCat = visibleWords.filter(
                        (w) => w.length === cat.length,
                      );
                      const wordsInCat = foundWords.filter(
                        (w) => w.length === cat.length,
                      );

                      return (
                        <div key={cat.length} className="space-y-2">
                          <div className="space-y-1">
                            <div className="font-bold text-base flex items-center gap-2">
                              <span>{cat.length}-letter words</span>
                              <span className="text-sm text-muted-foreground font-normal">
                                ({wordsInCat.length}/{cat.total})
                              </span>
                            </div>
                            {cat.total > wordsInCat.length && (
                              <div className="text-sm text-muted-foreground font-medium">
                                {cat.total - wordsInCat.length} to find
                              </div>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {allWordsInCat.map((word) => (
                              <span
                                key={word}
                                className={cn(
                                  "text-sm font-medium px-2 py-1 rounded border transition-all",
                                  foundWords.includes(word)
                                    ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                    : "bg-muted/50 text-muted-foreground border-border/50",
                                )}
                              >
                                {word}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : visibleWords.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
                    <Lightbulb className="h-8 w-8 mb-3" />
                    <p className="text-sm font-medium mb-1">
                      Click lightbulb to show word list
                    </p>
                    <p className="text-xs text-center">
                      Then connect letters in the grid to find words
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {foundWords.length === 0 ? (
                      <div className="text-muted-foreground text-sm italic">
                        No words found yet.
                      </div>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {foundWords.map((word, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-sm font-medium border-b border-border/50 pb-2 last:border-0"
                          >
                            <span>{word}</span>
                            <span className="text-muted-foreground text-xs">
                              {word.length} letters
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {showDebug && (
                  <div className="mt-8 pt-4 border-t border-border/50">
                    <h3 className="font-bold text-red-500 mb-2 flex items-center gap-2">
                      <Bug className="h-4 w-4" /> Developer Mode
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {visibleWords
                        .sort(
                          (a, b) => a.length - b.length || a.localeCompare(b),
                        )
                        .map((word) => (
                          <span
                            key={word}
                            className={cn(
                              "text-xs px-1.5 py-0.5 rounded border",
                              foundWords.includes(word)
                                ? "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800"
                                : "bg-red-50 text-red-800 border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
                            )}
                          >
                            {word}
                          </span>
                        ))}
                      {/* 显示隐藏的奖励单词（仅调试模式） */}
                      {!showBonusWords && bonusWords.length > 0 && (
                        <>
                          <div className="w-full text-xs text-muted-foreground mt-2 mb-1">
                            Bonus words (hidden):
                          </div>
                          {bonusWords
                            .sort(
                              (a, b) =>
                                a.length - b.length || a.localeCompare(b),
                            )
                            .map((word) => (
                              <span
                                key={word}
                                className="text-xs px-1.5 py-0.5 rounded border bg-gray-100 text-gray-600 border-gray-200 dark:bg-gray-800/50 dark:text-gray-500 dark:border-gray-700"
                              >
                                {word}
                              </span>
                            ))}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
