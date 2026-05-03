import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { getAllPosts, createBlogPost } from "@/lib/notion";

export const dynamic = "force-dynamic";

export async function GET() {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await getAllPosts();
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("Admin blog GET error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { title, slug, excerpt, tags, date, published, content } = body;

    if (!title || !slug) {
      return NextResponse.json(
        { error: "Title and slug are required." },
        { status: 400 }
      );
    }

    const result = await createBlogPost({
      title,
      slug,
      excerpt: excerpt || "",
      tags: tags || [],
      date: date || new Date().toISOString().split("T")[0],
      published: published || false,
      content: content || "",
    });

    if (result.success) {
      return NextResponse.json({ message: "Post created!", id: result.id });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to create post." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Admin blog POST error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
