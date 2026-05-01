import { NextResponse } from "next/server";
import { getPostAndMarkdown } from "@/lib/notion";

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params;
    const { post, markdown } = await getPostAndMarkdown(slug);

    if (!post) {
      return new NextResponse("Post not found", { status: 404 });
    }

    // Return plain text / markdown for LLM friendly crawling
    return new NextResponse(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    });
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
