import type { Metadata } from "next";
import { SquaresPageClient } from "@/components/features/squares/SquaresPageClient";
import { getDailySquares } from "@/lib/squares-wordpool";

export const metadata: Metadata = {
  title: "Squares - Daily Word Game",
  description:
    "Play Squares, a daily word puzzle game where you find words in a 4x4 grid.",
  icons: {
    icon: "/squares-icon.jpg",
  },
};

export default async function SquaresPage() {
  const dailyData = await getDailySquares();

  return <SquaresPageClient initialData={dailyData} />;
}
