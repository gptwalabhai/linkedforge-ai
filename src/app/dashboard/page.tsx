import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/layout/app-shell";
import { DashboardView } from "@/components/dashboard/dashboard-view";
import prisma from "@/lib/db";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session?.user) {
    redirect("/login");
  }

  // Fetch user data with error safety
  const user = session.user.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        include: {
          posts: {
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
              id: true,
              type: true,
              title: true,
              content: true,
              status: true,
              createdAt: true,
              likes: true,
              comments: true,
              impressions: true,
            },
          },
          subscriptions: {
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      }).catch(() => null)
    : null;

  const displayUser = {
    name: user?.name || session.user.name || session.user.email || "Professional User",
    email: user?.email || session.user.email,
    image: user?.image || session.user.image || null,
    plan: user?.subscriptions?.[0]?.plan || "FREE",
    credits: user?.subscriptions?.[0]
      ? user.subscriptions[0].creditsMonthly - user.subscriptions[0].creditsUsed
      : (session.user as any).credits || 50,
  };

  const posts = user?.posts || [];

  // Calculate stats
  const totalPosts = posts.length;
  const publishedPosts = posts.filter((p) => p.status === "PUBLISHED").length;
  const scheduledPosts = posts.filter((p) => p.status === "SCHEDULED").length;
  const totalImpressions = posts.reduce((sum, p) => sum + p.impressions, 0);
  const totalEngagement = posts.reduce((sum, p) => sum + p.likes + p.comments, 0);

  // Monthly activity (mock data for chart)
  const monthlyActivity = Array.from({ length: 12 }, (_, i) => {
    const month = new Date();
    month.setMonth(month.getMonth() - (11 - i));
    return {
      month: month.toLocaleString("en", { month: "short" }),
      posts: Math.floor(Math.random() * 20) + 5,
      engagement: Math.floor(Math.random() * 500) + 100,
    };
  });

  return (
    <AppShell>
      <DashboardView
        user={displayUser}
        stats={{
          totalPosts,
          publishedPosts,
          scheduledPosts,
          totalImpressions,
          totalEngagement,
        }}
        recentPosts={posts}
        monthlyActivity={monthlyActivity}
      />
    </AppShell>
  );
}
