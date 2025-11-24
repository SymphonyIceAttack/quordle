import type { Metadata } from "next";
import { SquaresPageClient } from "@/components/features/squares/SquaresPageClient";
import { getDailySquares } from "@/lib/squares-wordpool";

export const metadata: Metadata = {
  title: "Squares - Daily Word Game",
  description:
    "Play Squares, a daily word puzzle game where you find words in a 4x4 grid.",
  icons: {
    icon: [
      { url: "/squares-favicon.ico", sizes: "32x32", type: "image/x-icon" },
      { url: "/squares-icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/squares-icon-32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      {
        url: "/squares-apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/squares",
    title: "Squares - Daily Word Game",
    description:
      "Challenge yourself with Squares, a daily 4x4 word search puzzle game. Find as many words as you can!",
    siteName: "Squares Daily",
  },
  twitter: {
    card: "summary_large_image",
    title: "Squares - Daily Word Game",
    description:
      "Find words in a 4x4 grid! Play the daily Squares challenge now.",
    creator: "@quordle",
  },
};

export default async function SquaresPage() {
  const dailyData = await getDailySquares();

  return <SquaresPageClient initialData={dailyData} />;
}
