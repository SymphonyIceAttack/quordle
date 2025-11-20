import { QuordlePageClient } from "@/components/features/wordle-multi/QuordlePageClient";
import { cacheDailyWords } from "@/lib/ai-wordpool";

export default async function Page() {
  const initialDailyWords = await cacheDailyWords();

  return <QuordlePageClient initialData={initialDailyWords} />;
}
