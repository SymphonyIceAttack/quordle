import { z } from "zod";

export interface DailyWordPool {
  date: string;
  words: {
    easy: string[];
    medium: string[];
    hard: string[];
  };
  metadata: {
    generatedAt: string;
    aiModel: string;
    difficulty: "beginner" | "intermediate" | "expert";
  };
}

export const DailyWordPoolSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  words: z.object({
    easy: z.array(z.string().length(5)),
    medium: z.array(z.string().length(5)),
    hard: z.array(z.string().length(5)),
  }),
  metadata: z.object({
    generatedAt: z.string(),
    aiModel: z.string(),
    difficulty: z.enum(["beginner", "intermediate", "expert"]),
  }),
});
