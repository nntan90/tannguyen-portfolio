"use client";

import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./admin.css";

const AVAILABLE_TAGS = ["AI", "QA", "Testing", "Architecture", "Guides"];

interface Post {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  excerpt: string;
  published?: boolean;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function AdminPage() {
  // Auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);
  const [authChecking, setAuthChecking] = useState(true);

  // Dashboard state
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Editor state
  const [showEditor, setShowEditor] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    excerpt: "",
    tags: [] as string[],
    date: new Date().toISOString().split("T")[0],
    published: false,
    content: "",
  });
  const [showPreview, setShowPreview] = useState(false);

  // Check existing session on load
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/blog");
        if (res.ok) {
          setIsLoggedIn(true);
          const data = await res.json();
          setPosts(data.posts || []);
        }
      } catch { /* not logged in */ }
      setAuthChecking(false);
    })();
  }, []);

  // Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        setIsLoggedIn(true);
        setPassword("");
        fetchPosts();
      } else {
        const data = await res.json();
        setLoginError(data.error || "Invalid password");
      }
    } catch {
      setLoginError("Network error.");
    }
    setLoginLoading(false);
  };

  // Logout
  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsLoggedIn(false);
    setPosts([]);
  };

  // Fetch posts
  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blog");
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts || []);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, []);

  // Auto-generate slug from title
  const updateTitle = (title: string) => {
    setForm((prev) => ({
      ...prev,
      title,
      slug: prev.slug === slugify(prev.title) || prev.slug === "" ? slugify(title) : prev.slug,
    }));
  };

  // Toggle tag
  const toggleTag = (tag: string) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  // Create post
  const handleSave = async () => {
    if (!form.title.trim() || !form.slug.trim()) {
      setFeedback({ type: "error", msg: "Title and slug are required." });
      return;
    }
    setSaving(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/admin/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setFeedback({ type: "success", msg: "✓ Post created successfully!" });
        setShowEditor(false);
        resetForm();
        fetchPosts();
      } else {
        setFeedback({ type: "error", msg: data.error || "Failed to create post." });
      }
    } catch {
      setFeedback({ type: "error", msg: "Network error." });
    }
    setSaving(false);
  };

  // Toggle publish status
  const handleTogglePublish = async (post: Post) => {
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: !post.published }),
      });
      if (res.ok) {
        setFeedback({
          type: "success",
          msg: `✓ "${post.title}" ${post.published ? "unpublished" : "published"}!`,
        });
        fetchPosts();
      }
    } catch {
      setFeedback({ type: "error", msg: "Failed to update status." });
    }
  };

  // Delete post
  const handleDelete = async (post: Post) => {
    if (!confirm(`Delete "${post.title}"? This will archive it in Notion.`)) return;
    try {
      const res = await fetch(`/api/admin/blog/${post.id}`, { method: "DELETE" });
      if (res.ok) {
        setFeedback({ type: "success", msg: `✓ "${post.title}" archived.` });
        fetchPosts();
      }
    } catch {
      setFeedback({ type: "error", msg: "Failed to delete." });
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      slug: "",
      excerpt: "",
      tags: [],
      date: new Date().toISOString().split("T")[0],
      published: false,
      content: "",
    });
    setShowPreview(false);
  };

  const openEditor = () => {
    resetForm();
    setShowEditor(true);
    setFeedback(null);
  };

  // Loading check
  if (authChecking) {
    return (
      <div className="admin-body">
        <div className="admin-login">
          <div className="admin-login-box" style={{ textAlign: "center" }}>
            <div style={{ color: "#4ade80", fontSize: "0.8rem" }}>AUTHENTICATING...</div>
          </div>
        </div>
      </div>
    );
  }

  // ===== LOGIN SCREEN =====
  if (!isLoggedIn) {
    return (
      <div className="admin-body">
        <div className="admin-login">
          <div className="admin-login-box">
            <div className="admin-login-title">▸ ADMIN PANEL</div>
            <div className="admin-login-subtitle">BLOG MANAGEMENT SYSTEM // AUTHENTICATION REQUIRED</div>
            <form onSubmit={handleLogin}>
              <input
                className="admin-login-input"
                type="password"
                placeholder="Enter admin password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoFocus
              />
              <button className="admin-login-btn" type="submit" disabled={loginLoading}>
                {loginLoading ? "VERIFYING..." : "▸ LOGIN"}
              </button>
            </form>
            {loginError && <div className="admin-login-error">{loginError}</div>}
          </div>
        </div>
      </div>
    );
  }

  // ===== DASHBOARD =====
  const publishedCount = posts.filter((p) => p.published).length;
  const draftCount = posts.length - publishedCount;

  return (
    <div className="admin-body">
      <div className="admin-dashboard">
        {/* Header */}
        <div className="admin-header">
          <div className="admin-header-left">
            <div className="admin-header-title">▸ ADMIN // BLOG MANAGEMENT</div>
            <a href="/" className="admin-header-back">← Portfolio</a>
          </div>
          <button className="admin-logout-btn" onClick={handleLogout}>LOGOUT</button>
        </div>

        {/* Feedback */}
        {feedback && (
          <div className={`admin-feedback ${feedback.type}`}>{feedback.msg}</div>
        )}

        {/* Stats */}
        <div className="admin-stats">
          <div className="admin-stat">
            <div className="admin-stat-value">{posts.length}</div>
            <div className="admin-stat-label">Total Posts</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-value green">{publishedCount}</div>
            <div className="admin-stat-label">Published</div>
          </div>
          <div className="admin-stat">
            <div className="admin-stat-value yellow">{draftCount}</div>
            <div className="admin-stat-label">Drafts</div>
          </div>
        </div>

        {/* New Post Button */}
        {!showEditor && (
          <button className="admin-new-btn" onClick={openEditor}>✚ NEW POST</button>
        )}

        {/* Editor */}
        {showEditor && (
          <div className="admin-editor">
            <div className="admin-editor-title">▸ CREATE NEW POST</div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Title</label>
                <input
                  className="admin-form-input"
                  type="text"
                  placeholder="My Awesome Blog Post"
                  value={form.title}
                  onChange={(e) => updateTitle(e.target.value)}
                />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Slug</label>
                <input
                  className="admin-form-input"
                  type="text"
                  placeholder="my-awesome-blog-post"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">Excerpt</label>
              <textarea
                className="admin-form-textarea"
                placeholder="Brief description of the post..."
                value={form.excerpt}
                onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              />
            </div>

            <div className="admin-form-row">
              <div className="admin-form-group">
                <label className="admin-form-label">Tags</label>
                <div className="admin-tags-group">
                  {AVAILABLE_TAGS.map((tag) => (
                    <label key={tag} className="admin-tag-checkbox">
                      <input
                        type="checkbox"
                        checked={form.tags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Date</label>
                <input
                  className="admin-form-input"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
            </div>

            <div className="admin-publish-toggle">
              <div
                className={`admin-toggle ${form.published ? "active" : ""}`}
                onClick={() => setForm({ ...form, published: !form.published })}
              />
              <span>{form.published ? "PUBLISHED" : "DRAFT"}</span>
            </div>

            <div className="admin-form-group">
              <label className="admin-form-label">
                Content (Markdown)
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  style={{
                    marginLeft: 12,
                    fontSize: "0.55rem",
                    background: "transparent",
                    border: "1px solid #444",
                    color: "#888",
                    padding: "2px 8px",
                    borderRadius: "2px",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                  }}
                >
                  {showPreview ? "HIDE PREVIEW" : "SHOW PREVIEW"}
                </button>
              </label>
              <textarea
                className="admin-form-textarea content"
                placeholder={"## Introduction\n\nWrite your blog post content here using **Markdown** syntax.\n\n- Supports **bold**, *italic*, `code`\n- Headings: ## H2, ### H3\n- Lists, code blocks, quotes, and more\n\n```javascript\nconsole.log('Hello World');\n```\n\n> This is a blockquote"}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
              <div className="admin-md-hint">
                Supports: ## Heading, **bold**, *italic*, `code`, - bullet, 1. numbered, {">"} quote, ``` code block ```, --- divider, [link](url)
              </div>
            </div>

            {/* Preview */}
            {showPreview && form.content && (
              <div className="admin-preview">
                <div className="admin-preview-title">▸ PREVIEW</div>
                <div className="admin-preview-body">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {form.content}
                  </ReactMarkdown>
                </div>
              </div>
            )}

            <div className="admin-editor-actions">
              <button
                className="admin-save-btn"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "SAVING..." : "✓ SAVE POST"}
              </button>
              <button
                className="admin-cancel-btn"
                onClick={() => { setShowEditor(false); resetForm(); }}
              >
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Posts Table */}
        <div className="admin-table-wrap">
          {loading ? (
            <div className="admin-empty">Loading posts...</div>
          ) : posts.length === 0 ? (
            <div className="admin-empty">
              <div className="admin-empty-icon">📝</div>
              <div>No posts yet. Create your first one!</div>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Slug</th>
                  <th>Tags</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.id}>
                    <td className="admin-table-title">{post.title}</td>
                    <td className="admin-table-slug">{post.slug}</td>
                    <td>
                      <div className="admin-table-tags">
                        {post.tags?.map((tag) => (
                          <span key={tag} className="admin-tag">{tag}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ color: "#888", fontSize: "0.65rem" }}>{post.date}</td>
                    <td>
                      <span className={`admin-badge ${post.published ? "published" : "draft"}`}>
                        {post.published ? "PUBLISHED" : "DRAFT"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="admin-action-btn toggle"
                        onClick={() => handleTogglePublish(post)}
                        title={post.published ? "Unpublish" : "Publish"}
                      >
                        {post.published ? "UNPUB" : "PUB"}
                      </button>
                      <a
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="admin-action-btn"
                        style={{ textDecoration: "none", display: "inline-block" }}
                      >
                        VIEW
                      </a>
                      <button
                        className="admin-action-btn delete"
                        onClick={() => handleDelete(post)}
                      >
                        DEL
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
