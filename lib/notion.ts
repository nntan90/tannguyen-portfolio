import { Client } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

const notion = new Client({
  auth: process.env.NOTION_TOKEN || "mock_token",
});

const n2m = new NotionToMarkdown({ notionClient: notion });

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

Welcome to your new **Obsidian-inspired** blog! 
This content is currently a *mock fallback* because the \`NOTION_TOKEN\` is missing.

## What is this?
As an architecture developer, I wanted a clean space to store my research and let LLMs crawl it easily.

### Features
1. **Markdown Support**: Render headings, bold text, italics.
2. **Code Blocks**:
\`\`\`javascript
function helloWorld() {
  console.log("Hello LLMs!");
}
\`\`\`
3. **API Access**: This content is also available via \`/api/wiki/multi-agent-orchestration\`.

> **Note**: To replace this with real data, add your Notion Integration Token and Database ID to \`.env.local\`.
`;

// ============================================================
// BLOG FUNCTIONS
// ============================================================

export async function getPublishedPosts(): Promise<BlogPost[]> {
  if (!process.env.NOTION_TOKEN || !process.env.NOTION_DATABASE_ID) {
    return MOCK_POSTS;
  }

  const databaseId = process.env.NOTION_DATABASE_ID;
  try {
    const response = await (notion.databases as any).query({
      database_id: databaseId,
      filter: {
        property: "Published",
        checkbox: {
          equals: true,
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });

    return response.results.map((page: any) => {
      return {
        id: page.id,
        title: page.properties.Name.title[0]?.plain_text || "Untitled",
        slug: page.properties.Slug.rich_text[0]?.plain_text || page.id,
        date: page.properties.Date.date?.start || "",
        tags: page.properties.Tags.multi_select.map((tag: any) => tag.name),
        excerpt: page.properties.Excerpt?.rich_text[0]?.plain_text || "",
      };
    });
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
    const response = await (notion.databases as any).query({
      database_id: databaseId,
      filter: {
        property: "Slug",
        rich_text: {
          equals: slug,
        },
      },
    });

    if (!response.results.length) return { post: null, markdown: "" };

    const page: any = response.results[0];
    const mdblocks = await n2m.pageToMarkdown(page.id);
    const mdString = n2m.toMarkdownString(mdblocks);

    const post: BlogPost = {
      id: page.id,
      title: page.properties.Name.title[0]?.plain_text || "Untitled",
      slug: page.properties.Slug.rich_text[0]?.plain_text || page.id,
      date: page.properties.Date.date?.start || "",
      tags: page.properties.Tags.multi_select.map((tag: any) => tag.name),
      excerpt: page.properties.Excerpt?.rich_text[0]?.plain_text || "",
    };

    return { post, markdown: mdString.parent };
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
    await (notion.pages as any).create({
      parent: { database_id: dbId },
      properties: {
        Name: {
          title: [{ text: { content: data.name } }],
        },
        Email: {
          email: data.email,
        },
        ProjectType: {
          select: { name: data.projectType || "Other" },
        },
        Message: {
          rich_text: [{ text: { content: data.message.slice(0, 2000) } }],
        },
        Date: {
          date: { start: new Date().toISOString().split("T")[0] },
        },
        Status: {
          select: { name: "New" },
        },
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
    const existing = await (notion.databases as any).query({
      database_id: dbId,
      filter: {
        property: "Email",
        title: { equals: email },
      },
    });

    if (existing.results.length > 0) {
      return { success: false, error: "Already subscribed" };
    }

    await (notion.pages as any).create({
      parent: { database_id: dbId },
      properties: {
        Email: {
          title: [{ text: { content: email } }],
        },
        Date: {
          date: { start: new Date().toISOString().split("T")[0] },
        },
      },
    });
    return { success: true };
  } catch (error: any) {
    console.error("Error saving newsletter subscriber:", error);
    return { success: false, error: error.message || "Failed to subscribe" };
  }
}
