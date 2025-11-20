import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { cacheDailyWords } from "@/lib/ai-wordpool";
import { getDailySquares } from "@/lib/squares-wordpool";

export const revalidate = 86400; // 24 hours

export async function GET() {
  try {
    const [wordleData, squaresData] = await Promise.all([
      cacheDailyWords(),
      getDailySquares(),
    ]);
    return NextResponse.json({
      wordle: wordleData,
      squares: squaresData,
    });
  } catch (error) {
    console.error("Failed to generate daily puzzles:", error);
    return NextResponse.json(
      { error: "Failed to generate daily puzzles" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  // Admin/Debug endpoint to force regeneration
  try {
    // const authHeader = request.headers.get("authorization");
    // if (authHeader !== `Bearer ${process.env.API_SECRET}`) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    revalidateTag("daily-word-pool", "max");
    revalidateTag("daily-squares-puzzle", "max");

    const [wordleData, squaresData] = await Promise.all([
      cacheDailyWords(),
      getDailySquares(),
    ]);

    return NextResponse.json({
      message: "Daily puzzles regenerated successfully",
      wordle: wordleData,
      squares: squaresData,
    });
  } catch (error) {
    console.error("Failed to regenerate daily puzzles:", error);
    return NextResponse.json(
      { error: "Failed to regenerate daily puzzles" },
      { status: 500 },
    );
  }
}
