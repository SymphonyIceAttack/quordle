import { deepseek } from "@ai-sdk/deepseek";
import { generateText } from "ai";
import { unstable_cache } from "next/cache";
import type { DailyWordPool } from "@/types/AIWordPool";

const model = deepseek("deepseek-chat");

const FALLBACK_WORDS = {
  easy: ["APPLE", "BEACH", "CHAIR", "DANCE"],
  medium: ["FROST", "GRAPE", "HOTEL", "IMAGE"],
  hard: ["JAZZY", "KNOCK", "LEMON", "MUSIC"],
};

export async function generateDailyWords(
  difficulty: "beginner" | "intermediate" | "expert" = "intermediate",
): Promise<DailyWordPool> {
  const prompt = `Generate 12 unique 5-letter English words for Wordle puzzles with the following specifications:
    
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

  // Clean up the response in case it contains markdown code blocks
  const cleanText = text.replace(/```json\n?|\n?```/g, "").trim();

  let parsedWords: { words: DailyWordPool["words"] };
  try {
    parsedWords = JSON.parse(cleanText);
  } catch {
    console.error("Failed to parse AI response:", text);
    throw new Error("Failed to parse AI response");
  }

  // Validate with schema if possible, or just use the parsed object
  // const validated = DailyWordPoolSchema.pick({ words: true }).parse(parsedWords)

  return {
    words: parsedWords.words,
    date: new Date().toISOString().split("T")[0],
    metadata: {
      generatedAt: new Date().toISOString(),
      aiModel: "deepseek-chat",
      difficulty,
    },
  };
}

// In a real app, this would cache to a DB or KV store
// For this demo, we'll just generate fresh words if needed or rely on client-side state
export async function cacheDailyWords(): Promise<DailyWordPool> {
  const getCachedWords = unstable_cache(
    async () => {
      return generateDailyWords();
    },
    ["daily-word-pool"],
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
        aiModel: "fallback",
        difficulty: "intermediate",
      },
    };
  }
}
