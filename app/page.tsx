import { QuordlePageClient } from "@/components/features/wordle-multi/QuordlePageClient";
import {
  GameStructuredData,
  OrganizationStructuredData,
  WebsiteStructuredData,
} from "@/components/structured-data";
import { cacheDailyWords } from "@/lib/wordle-daily-words";

export default async function Page() {
  const initialDailyWords = await cacheDailyWords();

  return (
    <>
      <WebsiteStructuredData />
      <OrganizationStructuredData />
      <GameStructuredData />
      <QuordlePageClient initialData={initialDailyWords} />
    </>
  );
}
