// Cloudflare-compatible version of ai-wordpool.ts

import { deepseek } from "@ai-sdk/deepseek";
import { generateText } from "ai";
import type { DailyWordPool } from "@/types/AIWordPool";
import { cachedFunction } from "./cache/cache-helper";

const model = deepseek("deepseek-chat");

const FALLBACK_WORDS = {
  easy: ["APPLE", "BEACH", "CHAIR", "DANCE"],
  medium: ["FROST", "GRAPE", "HOTEL", "IMAGE"],
  hard: ["JAZZY", "KNOCK", "LEMON", "MUSIC"],
};

export async function generateDailyWords(
  difficulty: "beginner" | "intermediate" | "expert" = "intermediate",
  date?: string,
): Promise<DailyWordPool> {
  const today = date || new Date().toISOString().split("T")[0];
  const prompt = `Generate 12 unique 5-letter English words for Wordle puzzles for the date ${today} with the following specifications:
    
    Difficulty: ${difficulty}
    - Easy: Common, everyday words (e.g., TABLE, CHAIR, WATER)
    - Medium: Less common but still familiar words
    - Hard: More obscure or challenging words
    
    Requirements:
    1. Exactly 4 words for each difficulty level (easy, medium, hard)
    2. All words must be valid English words
    3. No proper nouns or abbreviations
    4. Words should be appropriate for all ages
    5. Avoid duplicate letters in hard mode when possible
    6. Words MUST be exactly 5 letters long
    
    Return a JSON object with this structure:
    {
      "words": {
        "easy": ["TABLE", "CHAIR", "WATER", "LIGHT"],
        "medium": ["BLAZE", "CROWN", "FLUTE", "PRIDE"],
        "hard": ["VIVID", "LYRIC", "CRYPT", "WHACK"]
      }
    }
    
    IMPORTANT: Return ONLY the JSON object, no markdown formatting or explanations.`;

  const { text } = await generateText({
    model: model,
    prompt,
  });

  const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();

  let parsedWords: { words: DailyWordPool["words"] };
  try {
    parsedWords = JSON.parse(cleanText);
  } catch {
    console.error("Failed to parse AI response:", text);
    throw new Error("Failed to parse AI response");
  }

  return {
    words: parsedWords.words,
    date: today,
    metadata: {
      generatedAt: new Date().toISOString(),
      aiModel: "deepseek-chat",
      difficulty,
    },
  };
}

export async function cacheDailyWords(): Promise<DailyWordPool> {
  const today = new Date().toISOString().split("T")[0];

  try {
    return await cachedFunction(
      async () => generateDailyWords("intermediate", today),
      ["daily-word-pool", today],
      {
        revalidate: 86400,
        tags: ["daily-word-pool"],
      },
    );
  } catch (error) {
    console.error("Error generating daily words, using fallback:", error);
    return {
      words: FALLBACK_WORDS,
      date: new Date().toISOString().split("T")[0],
      metadata: {
        generatedAt: new Date().toISOString(),
        aiModel: "fallback",
        difficulty: "intermediate",
      },
    };
  }
}
