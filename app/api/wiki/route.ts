import { NextResponse } from "next/server";
import { getPublishedPosts } from "@/lib/notion";

export async function GET() {
  try {
    const posts = await getPublishedPosts();
    const wikiIndex = posts.map(post => ({
      title: post.title,
      slug: post.slug,
      excerpt: post.excerpt,
      tags: post.tags,
      api_url: `/api/wiki/${post.slug}`,
      web_url: `/blog/${post.slug}`
    }));

    return NextResponse.json({
      name: "Tan Nguyen - Knowledge Base",
      description: "Research and knowledge base for QA/QC, Automation, and Architecture.",
      articles_count: wikiIndex.length,
      articles: wikiIndex
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch wiki index" }, { status: 500 });
  }
}
