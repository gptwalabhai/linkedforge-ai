import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

// Admin-only: Grant/revoke credits for a user
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify admin role
    const admin = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (admin?.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, action, amount } = body;

    if (!userId || !action || typeof amount !== "number" || amount <= 0) {
      return NextResponse.json(
        { error: "Invalid request: userId, action (grant|revoke|set), and amount (positive number) required" },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, credits: true, email: true },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let newCredits: number;
    switch (action) {
      case "grant":
        newCredits = targetUser.credits + amount;
        break;
      case "revoke":
        newCredits = Math.max(0, targetUser.credits - amount);
        break;
      case "set":
        newCredits = amount;
        break;
      default:
        return NextResponse.json({ error: "Invalid action. Use: grant, revoke, or set" }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { credits: newCredits },
      select: { id: true, email: true, credits: true },
    });

    // Log the admin action
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: `ADMIN_CREDITS_${action.toUpperCase()}`,
        entity: "User",
        entityId: userId,
        metadata: {
          targetEmail: targetUser.email,
          previousCredits: targetUser.credits,
          newCredits,
          amount,
        },
      },
    });

    return NextResponse.json({
      success: true,
      user: updated,
      message: `Successfully ${action === "grant" ? "granted" : action === "revoke" ? "revoked" : "set"} ${amount} credits`,
    });
  } catch (error) {
    console.error("Admin credits error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
