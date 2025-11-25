import { QuordlePageClient } from "@/components/features/wordle-multi/QuordlePageClient";
import { cacheDailyWords } from "@/lib/wordle-daily-words";

export default async function Page() {
  const initialDailyWords = await cacheDailyWords();

  return <QuordlePageClient initialData={initialDailyWords} />;
}
