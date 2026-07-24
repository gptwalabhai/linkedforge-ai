import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const status = searchParams.get("status");
    const type = searchParams.get("type");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where: Record<string, unknown> = { userId: session.user.id };

    if (status) where.status = status;
    if (type) where.type = type;
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
      ];
    }

    const [posts, total] = await Promise.all([
      prisma.post.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.post.count({ where }),
    ]);

    return NextResponse.json({
      posts,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Posts GET error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { type, content, title, status, tone, framework, audience, readingLevel, emojiLevel, hashtags, keywords, cta, language, folderId } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    const post = await prisma.post.create({
      data: {
        userId: session.user.id,
        type: type || "POST",
        content,
        title: title || null,
        status: status || "DRAFT",
        tone: tone || null,
        framework: framework || null,
        audience: audience || null,
        readingLevel: readingLevel || null,
        emojiLevel: emojiLevel || 1,
        hashtags: hashtags || [],
        keywords: keywords || [],
        cta: cta || null,
        language: language || "en",
        wordCount: content.split(/\s+/).filter(Boolean).length,
        folderId: folderId || null,
      },
    });

    // Create initial version
    await prisma.postVersion.create({
      data: { postId: post.id, content, action: "CREATE", reason: "Initial creation" },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Posts POST error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
