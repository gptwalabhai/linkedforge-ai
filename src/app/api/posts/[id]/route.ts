import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const post = await prisma.post.findFirst({
      where: { id, userId: session.user.id },
      include: { versions: { orderBy: { createdAt: "desc" }, take: 20 } },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Post GET error:", error);
    return NextResponse.json({ error: "Failed to fetch post" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.post.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    const { title, content, status, scheduledAt, tone, framework, audience, readingLevel, emojiLevel, hashtags, keywords, cta, language, folderId } = body;

    const updateData: Record<string, unknown> = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) {
      updateData.content = content;
      updateData.wordCount = content.split(/\s+/).filter(Boolean).length;
    }
    if (status !== undefined) updateData.status = status;
    if (scheduledAt !== undefined) updateData.scheduledAt = scheduledAt;
    if (tone !== undefined) updateData.tone = tone;
    if (framework !== undefined) updateData.framework = framework;
    if (audience !== undefined) updateData.audience = audience;
    if (readingLevel !== undefined) updateData.readingLevel = readingLevel;
    if (emojiLevel !== undefined) updateData.emojiLevel = emojiLevel;
    if (hashtags !== undefined) updateData.hashtags = hashtags;
    if (keywords !== undefined) updateData.keywords = keywords;
    if (cta !== undefined) updateData.cta = cta;
    if (language !== undefined) updateData.language = language;
    if (folderId !== undefined) updateData.folderId = folderId;
    if (status === "PUBLISHED" && !existing.publishedAt) updateData.publishedAt = new Date();

    const post = await prisma.post.update({ where: { id }, data: updateData });

    // Create version if content changed
    if (content !== undefined && content !== existing.content) {
      await prisma.postVersion.create({
        data: { postId: id, content, action: "UPDATE", reason: "Content edited" },
      });
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error("Post PUT error:", error);
    return NextResponse.json({ error: "Failed to update post" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { id } = await params;

    const existing = await prisma.post.findFirst({
      where: { id, userId: session.user.id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    await prisma.post.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Post DELETE error:", error);
    return NextResponse.json({ error: "Failed to delete post" }, { status: 500 });
  }
}
