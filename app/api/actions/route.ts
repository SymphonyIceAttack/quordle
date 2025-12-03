import { revalidatePath } from "next/cache";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get("secret");
    const slug = searchParams.get("slug");

    // Verify secret token
    if (secret !== process.env.ACCESS_TOKEN) {
      return new Response("Invalid token", { status: 401 });
    }

    if (!slug) {
      return new Response("Missing slug", { status: 400 });
    }

    // Revalidate the cache for the specific post route
    revalidatePath(`/posts/${slug}`);

    // Also revalidate the posts list page
    revalidatePath("/posts");

    return Response.json({
      success: true,
      message: `Post ${slug} revalidated successfully`,
    });
  } catch (error) {
    console.error("[v0] Revalidate error:", error);
    return new Response("Error revalidating post", { status: 500 });
  }
}
