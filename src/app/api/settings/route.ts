import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import prisma from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscriptions: { orderBy: { createdAt: "desc" }, take: 1 },
        apiKeys: { orderBy: { createdAt: "desc" } },
      },
    });

    return NextResponse.json({
      name: user?.name,
      email: user?.email,
      image: user?.image,
      brandVoice: user?.brandVoice,
      writingStyle: user?.writingStyle,
      industry: user?.industry,
      jobTitle: user?.jobTitle,
      company: user?.company,
      timezone: user?.timezone,
      subscription: user?.subscriptions?.[0] || null,
      apiKeys: user?.apiKeys || [],
    });
  } catch (error) {
    console.error("Settings GET error:", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, image, brandVoice, writingStyle, industry, jobTitle, company, timezone } = body;

    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (image !== undefined) updateData.image = image;
    if (brandVoice !== undefined) updateData.brandVoice = brandVoice;
    if (writingStyle !== undefined) updateData.writingStyle = writingStyle;
    if (industry !== undefined) updateData.industry = industry;
    if (jobTitle !== undefined) updateData.jobTitle = jobTitle;
    if (company !== undefined) updateData.company = company;
    if (timezone !== undefined) updateData.timezone = timezone;

    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Settings PUT error:", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
