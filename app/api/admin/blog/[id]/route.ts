import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-auth";
import { updateBlogPost, archiveBlogPost } from "@/lib/notion";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await request.json();
    const result = await updateBlogPost(id, body);

    if (result.success) {
      return NextResponse.json({ message: "Post updated!" });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to update." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Admin blog PATCH error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const isAdmin = await getAdminSession();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const result = await archiveBlogPost(id);

    if (result.success) {
      return NextResponse.json({ message: "Post archived!" });
    } else {
      return NextResponse.json(
        { error: result.error || "Failed to archive." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Admin blog DELETE error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
