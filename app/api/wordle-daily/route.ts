import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { cacheDailyWords } from "@/lib/ai-wordpool";

export const revalidate = 86400; // 24 hours

export async function GET() {
  try {
    const wordPool = await cacheDailyWords();
    return NextResponse.json(wordPool);
  } catch (error) {
    console.error("Failed to generate daily words:", error);
    return NextResponse.json(
      { error: "Failed to generate daily words" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  // Admin/Debug endpoint to force regeneration
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.API_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    revalidateTag("daily-word-pool", "max");
    const wordPool = await cacheDailyWords();
    return NextResponse.json(wordPool);
  } catch (error) {
    console.error("Failed to regenerate daily words:", error);
    return NextResponse.json(
      { error: "Failed to regenerate daily words" },
      { status: 500 },
    );
  }
}
