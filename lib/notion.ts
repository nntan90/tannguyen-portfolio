import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

// Initialize Notion client lazily to ensure env vars are available at runtime
function getNotionClient() {
  return new Client({
    auth: process.env.NOTION_TOKEN || "mock_token",
  });
}

function getN2M() {
  return new NotionToMarkdown({ notionClient: getNotionClient() });
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  tags: string[];
  excerpt: string;
}

// Mock Data Fallback
const MOCK_POSTS: BlogPost[] = [
  {
    id: "1",
    title: "Multi-Agent Orchestration: Context Window Management at Scale",
    slug: "multi-agent-orchestration",
    date: "2026-05-01",
    tags: ["AI", "Architecture"],
    excerpt: "How to handle 128k+ tokens effectively in enterprise setups.",
  },
  {
    id: "2",
    title: "ISTQB Advanced in Practice: RTMs That Actually Work",
    slug: "istqb-rtm-practice",
    date: "2026-04-20",
    tags: ["QA", "Testing"],
    excerpt: "Requirements Traceability Matrices don't have to be boring.",
  },
];

const MOCK_MARKDOWN = `
# Building Obsidian-style Knowledge Graphs

This content is a *mock fallback* because Notion is not configured.

> **Note**: To replace this with real data, add your Notion Integration Token and Database ID to \`.env.local\`.
`;

// ============================================================
// HELPER: Direct Notion API call (avoids SDK bundling issues)
// ============================================================

async function notionFetch(endpoint: string, body?: any) {
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error("NOTION_TOKEN not set");

  const res = await fetch(`https://api.notion.com/v1${endpoint}`, {
    method: body ? "POST" : "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Notion API ${res.status}: ${errorText}`);
  }

  return res.json();
}

// ============================================================
// BLOG FUNCTIONS
// ============================================================

export async function getPublishedPosts(): Promise<BlogPost[]> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    console.log("[Notion] Missing env vars, returning mock data");
    return MOCK_POSTS;
  }

  const databaseId = process.env.NOTION_DATABASE_ID;
  try {
    console.log("[Notion] Querying database:", databaseId);
    const response = await notionFetch(`/databases/${databaseId}/query`, {
      filter: {
        property: "Published",
        checkbox: { equals: true },
      },
      sorts: [
        { property: "Date", direction: "descending" },
      ],
    });

    console.log("[Notion] Query results count:", response.results.length);

    return response.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Name?.title?.[0]?.plain_text || "Untitled",
      slug: page.properties.Slug?.rich_text?.[0]?.plain_text || page.id,
      date: page.properties.Date?.date?.start || "",
      tags: (page.properties.Tags?.multi_select || []).map((tag: any) => tag.name),
      excerpt: page.properties.Excerpt?.rich_text?.[0]?.plain_text || "",
    }));
  } catch (error) {
    console.error("Error fetching Notion posts:", error);
    return MOCK_POSTS;
  }
}

export async function getPostAndMarkdown(slug: string): Promise<{ post: BlogPost | null; markdown: string }> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    const post = MOCK_POSTS.find((p) => p.slug === slug) || MOCK_POSTS[0];
    return { post, markdown: MOCK_MARKDOWN };
  }

  try {
    const databaseId = process.env.NOTION_DATABASE_ID;
    const response = await notionFetch(`/databases/${databaseId}/query`, {
      filter: {
        property: "Slug",
        rich_text: { equals: slug },
      },
    });

    if (!response.results.length) return { post: null, markdown: "" };

    const page: any = response.results[0];

    // Use notion-to-md for markdown conversion (falls back to direct blocks if it fails)
    let mdString = "";
    try {
      const n2m = getN2M();
      const mdblocks = await n2m.pageToMarkdown(page.id);
      const result = n2m.toMarkdownString(mdblocks);
      mdString = result.parent;
    } catch {
      // Fallback: fetch blocks directly
      const blocks = await notionFetch(`/blocks/${page.id}/children`);
      mdString = blocks.results.map((block: any) => {
        const type = block.type;
        const content = block[type]?.rich_text?.map((t: any) => t.plain_text).join("") || "";
        if (type === "heading_2") return `## ${content}`;
        if (type === "heading_3") return `### ${content}`;
        if (type === "bulleted_list_item") return `- ${content}`;
        if (type === "numbered_list_item") return `1. ${content}`;
        return content;
      }).join("\n\n");
    }

    const post: BlogPost = {
      id: page.id,
      title: page.properties.Name?.title?.[0]?.plain_text || "Untitled",
      slug: page.properties.Slug?.rich_text?.[0]?.plain_text || page.id,
      date: page.properties.Date?.date?.start || "",
      tags: (page.properties.Tags?.multi_select || []).map((tag: any) => tag.name),
      excerpt: page.properties.Excerpt?.rich_text?.[0]?.plain_text || "",
    };

    return { post, markdown: mdString };
  } catch (error) {
    console.error("Error fetching Notion post details:", error);
    return { post: null, markdown: "" };
  }
}

// ============================================================
// CONTACT FORM — Save to Notion Contacts Database
// ============================================================

export async function saveContact(data: {
  name: string;
  email: string;
  projectType: string;
  message: string;
}): Promise<{ success: boolean; error?: string }> {
  const dbId = process.env.NOTION_CONTACTS_DB;
  if (!process.env.NOTION_TOKEN || !dbId) {
    console.warn("Contact form: Notion not configured, skipping save.");
    return { success: false, error: "Notion not configured" };
  }

  try {
    await notionFetch("/pages", {
      parent: { database_id: dbId },
      properties: {
        Name: { title: [{ text: { content: data.name } }] },
        Email: { email: data.email },
        ProjectType: { select: { name: data.projectType || "Other" } },
        Message: { rich_text: [{ text: { content: data.message.slice(0, 2000) } }] },
        Date: { date: { start: new Date().toISOString().split("T")[0] } },
        Status: { select: { name: "New" } },
      },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error saving contact:", error);
    return { success: false, error: error.message || "Failed to save" };
  }
}

// ============================================================
// NEWSLETTER — Save subscriber to Notion Newsletter Database
// ============================================================

export async function saveNewsletterSubscriber(email: string): Promise<{ success: boolean; error?: string }> {
  const dbId = process.env.NOTION_NEWSLETTER_DB;
  if (!process.env.NOTION_TOKEN || !dbId) {
    console.warn("Newsletter: Notion not configured, skipping save.");
    return { success: false, error: "Notion not configured" };
  }

  try {
    // Check for duplicate
    const existing = await notionFetch(`/databases/${dbId}/query`, {
      filter: {
        property: "Email",
        title: { equals: email },
      },
    });

    if (existing.results.length > 0) {
      return { success: false, error: "Already subscribed" };
    }

    await notionFetch("/pages", {
      parent: { database_id: dbId },
      properties: {
        Email: { title: [{ text: { content: email } }] },
        Date: { date: { start: new Date().toISOString().split("T")[0] } },
      },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error saving newsletter subscriber:", error);
    return { success: false, error: error.message || "Failed to subscribe" };
  }
}

// ============================================================
// ADMIN — Blog Management Functions
// ============================================================

export async function getAllPosts(): Promise<BlogPost[]> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    return MOCK_POSTS;
  }

  const databaseId = process.env.NOTION_DATABASE_ID;
  try {
    const response = await notionFetch(`/databases/${databaseId}/query`, {
      sorts: [{ property: "Date", direction: "descending" }],
    });

    return response.results.map((page: any) => ({
      id: page.id,
      title: page.properties.Name?.title?.[0]?.plain_text || "Untitled",
      slug: page.properties.Slug?.rich_text?.[0]?.plain_text || page.id,
      date: page.properties.Date?.date?.start || "",
      tags: (page.properties.Tags?.multi_select || []).map((tag: any) => tag.name),
      excerpt: page.properties.Excerpt?.rich_text?.[0]?.plain_text || "",
      published: page.properties.Published?.checkbox || false,
    }));
  } catch (error) {
    console.error("Error fetching all posts:", error);
    return [];
  }
}

/**
 * Convert a markdown string to an array of Notion block objects.
 * Supports: h2, h3, paragraph, bulleted_list_item, numbered_list_item, code, quote, divider
 */
export function markdownToNotionBlocks(markdown: string): any[] {
  const lines = markdown.split("\n");
  const blocks: any[] = [];
  let inCodeBlock = false;
  let codeContent: string[] = [];
  let codeLang = "plain text";

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Code block toggle
    if (line.trimStart().startsWith("```")) {
      if (!inCodeBlock) {
        inCodeBlock = true;
        codeLang = line.trimStart().slice(3).trim() || "plain text";
        codeContent = [];
      } else {
        inCodeBlock = false;
        blocks.push({
          object: "block",
          type: "code",
          code: {
            rich_text: [{ type: "text", text: { content: codeContent.join("\n") } }],
            language: codeLang,
          },
        });
      }
      continue;
    }

    if (inCodeBlock) {
      codeContent.push(line);
      continue;
    }

    const trimmed = line.trim();

    // Skip empty lines
    if (!trimmed) continue;

    // Divider
    if (/^---+$/.test(trimmed) || /^\*\*\*+$/.test(trimmed)) {
      blocks.push({ object: "block", type: "divider", divider: {} });
      continue;
    }

    // Heading 2
    if (trimmed.startsWith("## ")) {
      blocks.push({
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: parseInlineFormatting(trimmed.slice(3)),
        },
      });
      continue;
    }

    // Heading 3
    if (trimmed.startsWith("### ")) {
      blocks.push({
        object: "block",
        type: "heading_3",
        heading_3: {
          rich_text: parseInlineFormatting(trimmed.slice(4)),
        },
      });
      continue;
    }

    // Heading 1 → map to heading_2 in Notion (h1 is page title)
    if (trimmed.startsWith("# ")) {
      blocks.push({
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: parseInlineFormatting(trimmed.slice(2)),
        },
      });
      continue;
    }

    // Blockquote
    if (trimmed.startsWith("> ")) {
      blocks.push({
        object: "block",
        type: "quote",
        quote: {
          rich_text: parseInlineFormatting(trimmed.slice(2)),
        },
      });
      continue;
    }

    // Bulleted list
    if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
      blocks.push({
        object: "block",
        type: "bulleted_list_item",
        bulleted_list_item: {
          rich_text: parseInlineFormatting(trimmed.slice(2)),
        },
      });
      continue;
    }

    // Numbered list
    const numMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (numMatch) {
      blocks.push({
        object: "block",
        type: "numbered_list_item",
        numbered_list_item: {
          rich_text: parseInlineFormatting(numMatch[1]),
        },
      });
      continue;
    }

    // Default: paragraph
    blocks.push({
      object: "block",
      type: "paragraph",
      paragraph: {
        rich_text: parseInlineFormatting(trimmed),
      },
    });
  }

  return blocks;
}

/**
 * Parse inline markdown formatting (bold, italic, code, links) into Notion rich_text array.
 */
function parseInlineFormatting(text: string): any[] {
  const result: any[] = [];
  // Regex to match **bold**, *italic*, `code`, and [text](url)
  const regex = /(\*\*(.+?)\*\*|\*(.+?)\*|`(.+?)`|\[(.+?)\]\((.+?)\))/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add plain text before this match
    if (match.index > lastIndex) {
      result.push({
        type: "text",
        text: { content: text.slice(lastIndex, match.index) },
      });
    }

    if (match[2]) {
      // Bold
      result.push({
        type: "text",
        text: { content: match[2] },
        annotations: { bold: true },
      });
    } else if (match[3]) {
      // Italic
      result.push({
        type: "text",
        text: { content: match[3] },
        annotations: { italic: true },
      });
    } else if (match[4]) {
      // Code
      result.push({
        type: "text",
        text: { content: match[4] },
        annotations: { code: true },
      });
    } else if (match[5] && match[6]) {
      // Link
      result.push({
        type: "text",
        text: { content: match[5], link: { url: match[6] } },
      });
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining plain text
  if (lastIndex < text.length) {
    result.push({
      type: "text",
      text: { content: text.slice(lastIndex) },
    });
  }

  // If no formatting found, return simple text
  if (result.length === 0) {
    return [{ type: "text", text: { content: text } }];
  }

  return result;
}

export async function createBlogPost(data: {
  title: string;
  slug: string;
  excerpt: string;
  tags: string[];
  date: string;
  published: boolean;
  content: string;
}): Promise<{ success: boolean; id?: string; error?: string }> {
  const dbId = process.env.NOTION_DATABASE_ID;
  if (!process.env.NOTION_TOKEN || !dbId) {
    return { success: false, error: "Notion not configured" };
  }

  try {
    // Step 1: Create the page with properties
    const page = await notionFetch("/pages", {
      parent: { database_id: dbId },
      properties: {
        Name: { title: [{ text: { content: data.title } }] },
        Slug: { rich_text: [{ text: { content: data.slug } }] },
        Excerpt: { rich_text: [{ text: { content: data.excerpt.slice(0, 2000) } }] },
        Tags: { multi_select: data.tags.map((t) => ({ name: t })) },
        Date: { date: { start: data.date || new Date().toISOString().split("T")[0] } },
        Published: { checkbox: data.published },
      },
    });

    // Step 2: Convert markdown to Notion blocks and append
    if (data.content.trim()) {
      const blocks = markdownToNotionBlocks(data.content);
      // Notion API limits to 100 blocks per request
      for (let i = 0; i < blocks.length; i += 100) {
        const chunk = blocks.slice(i, i + 100);
        await notionFetchMethod(`/blocks/${page.id}/children`, "PATCH", { children: chunk });
      }
    }

    return { success: true, id: page.id };
  } catch (error: any) {
    console.error("Error creating blog post:", error);
    return { success: false, error: error.message || "Failed to create post" };
  }
}

export async function updateBlogPost(
  pageId: string,
  data: {
    title?: string;
    slug?: string;
    excerpt?: string;
    tags?: string[];
    date?: string;
    published?: boolean;
  }
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.NOTION_TOKEN) {
    return { success: false, error: "Notion not configured" };
  }

  try {
    const properties: any = {};
    if (data.title !== undefined)
      properties.Name = { title: [{ text: { content: data.title } }] };
    if (data.slug !== undefined)
      properties.Slug = { rich_text: [{ text: { content: data.slug } }] };
    if (data.excerpt !== undefined)
      properties.Excerpt = { rich_text: [{ text: { content: data.excerpt.slice(0, 2000) } }] };
    if (data.tags !== undefined)
      properties.Tags = { multi_select: data.tags.map((t) => ({ name: t })) };
    if (data.date !== undefined)
      properties.Date = { date: { start: data.date } };
    if (data.published !== undefined)
      properties.Published = { checkbox: data.published };

    await notionFetchMethod(`/pages/${pageId}`, "PATCH", { properties });
    return { success: true };
  } catch (error: any) {
    console.error("Error updating blog post:", error);
    return { success: false, error: error.message || "Failed to update post" };
  }
}

export async function archiveBlogPost(
  pageId: string
): Promise<{ success: boolean; error?: string }> {
  if (!process.env.NOTION_TOKEN) {
    return { success: false, error: "Notion not configured" };
  }

  try {
    await notionFetchMethod(`/pages/${pageId}`, "PATCH", { archived: true });
    return { success: true };
  } catch (error: any) {
    console.error("Error archiving blog post:", error);
    return { success: false, error: error.message || "Failed to archive post" };
  }
}

/**
 * Extended fetch helper that supports PATCH method.
 */
async function notionFetchMethod(endpoint: string, method: string, body?: any) {
  const token = process.env.NOTION_TOKEN;
  if (!token) throw new Error("NOTION_TOKEN not set");

  const res = await fetch(`https://api.notion.com/v1${endpoint}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Notion API ${res.status}: ${errorText}`);
  }

  return res.json();
}
