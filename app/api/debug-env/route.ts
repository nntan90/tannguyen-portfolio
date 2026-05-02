import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    hasToken: !!process.env.NOTION_TOKEN,
    hasDbId: !!process.env.NOTION_DATABASE_ID,
    hasContactsDb: !!process.env.NOTION_CONTACTS_DB,
    hasNewsletterDb: !!process.env.NOTION_NEWSLETTER_DB,
    tokenPrefix: process.env.NOTION_TOKEN ? process.env.NOTION_TOKEN.substring(0, 8) + "..." : "missing",
  });
}
