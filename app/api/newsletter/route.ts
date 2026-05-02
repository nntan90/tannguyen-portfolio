import { NextResponse } from "next/server";
import { saveNewsletterSubscriber } from "@/lib/notion";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    const result = await saveNewsletterSubscriber(email);

    if (result.success) {
      return NextResponse.json({ message: "Subscribed successfully!" });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to subscribe." },
        { status: result.error === "Already subscribed" ? 409 : 500 }
      );
    }
  } catch (error) {
    console.error("Newsletter API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
