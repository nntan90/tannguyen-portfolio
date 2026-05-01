import { getPostAndMarkdown } from "@/lib/notion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";
import "./obsidian.css"; // We will create this

export const revalidate = 60; // Revalidate every 60 seconds

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { post, markdown } = await getPostAndMarkdown(slug);

  if (!post) {
    return (
      <div className="obsidian-page">
        <div className="obsidian-content">
          <h1>404 - Note Not Found</h1>
          <Link href="/" className="obsidian-link">← Back to Graph</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="obsidian-page">
      <div className="obsidian-topbar">
        <Link href="/" className="obsidian-breadcrumb">~/root</Link>
        <span className="obsidian-breadcrumb-sep">/</span>
        <span className="obsidian-breadcrumb-current">{post.title}</span>
      </div>
      
      <main className="obsidian-content">
        <header className="obsidian-header">
          <h1 className="obsidian-title">{post.title}</h1>
          <div className="obsidian-meta">
            <span className="obsidian-date">🗓 {post.date}</span>
            <div className="obsidian-tags">
              {post.tags.map(tag => (
                <span key={tag} className="obsidian-tag">#{tag}</span>
              ))}
            </div>
          </div>
        </header>

        <article className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {markdown || ""}
          </ReactMarkdown>
        </article>
      </main>
    </div>
  );
}
