import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const slug = searchParams.get("slug");
    const published = searchParams.get("published") !== "false";
    const category = searchParams.get("category");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: Record<string, unknown> = {};
    if (slug) {
      const post = await prisma.blogPost.findUnique({ where: { slug } });
      if (!post) return NextResponse.json(null, { status: 404 });
      // Increment views
      await prisma.blogPost.update({ where: { id: post.id }, data: { views: { increment: 1 } } });
      const related = await prisma.blogPost.findMany({
        where: { published: true, category: post.category, id: { not: post.id } },
        orderBy: { views: "desc" },
        take: 3,
      });
      return NextResponse.json({ ...post, related });
    }
    if (published) where.published = true;
    if (category) where.category = category;

    const [posts, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        orderBy: { publishedAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.blogPost.count({ where }),
    ]);

    return NextResponse.json({ posts, pagination: { page, limit, total } });
  } catch (error) {
    console.error("Blog GET error:", error);
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, content, excerpt, coverImage, authorName, category, tags, published } = body;

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const slug = title
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .trim();

    const post = await prisma.blogPost.create({
      data: {
        title,
        slug,
        content,
        excerpt: excerpt || null,
        coverImage: coverImage || null,
        authorId: body.authorId || "admin",
        authorName: authorName || "LinkedForge Team",
        category: category || "General",
        tags: tags || [],
        published: published || false,
        publishedAt: published ? new Date() : null,
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    console.error("Blog POST error:", error);
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 });
  }
}
