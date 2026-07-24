"use client";

import { BarChart3, FileText, Calendar, TrendingUp, Zap, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { formatRelativeTime } from "@/lib/utils";
import { ActivityChart } from "./activity-chart";
import { QuickActions } from "./quick-actions";

interface Post {
  id: string;
  type: string;
  title: string | null;
  content: string;
  status: string;
  createdAt: Date | string;
  likes: number;
  comments: number;
  impressions: number;
}

interface MonthlyActivity {
  month: string;
  posts: number;
  engagement: number;
}

interface DashboardViewProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
    plan: string;
    credits: number;
  };
  stats: {
    totalPosts: number;
    publishedPosts: number;
    scheduledPosts: number;
    totalImpressions: number;
    totalEngagement: number;
  };
  recentPosts: Post[];
  monthlyActivity: MonthlyActivity[];
}

const statusColors: Record<string, string> = {
  DRAFT: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  SCHEDULED: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  PUBLISHED: "bg-green-500/10 text-green-500 border-green-500/20",
  ARCHIVED: "bg-muted text-muted-foreground border-border",
};

const statusLabels: Record<string, string> = {
  DRAFT: "Draft",
  SCHEDULED: "Scheduled",
  PUBLISHED: "Published",
  ARCHIVED: "Archived",
};

const typeLabels: Record<string, string> = {
  POST: "Post",
  CAROUSEL: "Carousel",
  HOOK: "Hook",
  THREAD: "Thread",
  POLL: "Poll",
  STORY: "Story",
  EDUCATIONAL: "Educational",
  THOUGHT_LEADERSHIP: "Thought Leadership",
  CTA: "CTA",
  FOUNDER_UPDATE: "Founder Update",
  CASE_STUDY: "Case Study",
};

export function DashboardView({ user, stats, recentPosts, monthlyActivity }: DashboardViewProps) {
  const statCards = [
    { title: "Total Posts", value: stats.totalPosts, icon: FileText, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "Published", value: stats.publishedPosts, icon: Zap, color: "text-green-400", bg: "bg-green-500/10" },
    { title: "Scheduled", value: stats.scheduledPosts, icon: Calendar, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { title: "Total Impressions", value: stats.totalImpressions.toLocaleString(), icon: TrendingUp, color: "text-purple-400", bg: "bg-purple-500/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user.name.split(" ")[0]}!</h1>
          <p className="text-sm text-muted-foreground mt-1">
            You have {user.credits} credits remaining. Plan: <Badge variant="outline" className="ml-1">{user.plan}</Badge>
          </p>
        </div>
        <QuickActions />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Card key={card.title} className="border-border bg-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{card.title}</CardTitle>
              <div className={`w-8 h-8 rounded-md flex items-center justify-center ${card.bg}`}>
                <card.icon className={`w-4 h-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts & Activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-border bg-card">
          <CardHeader>
            <CardTitle>Monthly Activity</CardTitle>
            <CardDescription>Your content generation and engagement over the past year.</CardDescription>
          </CardHeader>
          <CardContent>
            <ActivityChart data={monthlyActivity} />
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently used actions to get started fast.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Link href="/studio?type=POST">
              <Button variant="outline" className="w-full justify-start gap-2">
                <FileText className="w-4 h-4" /> Generate a Post
              </Button>
            </Link>
            <Link href="/studio?type=CAROUSEL">
              <Button variant="outline" className="w-full justify-start gap-2">
                <BarChart3 className="w-4 h-4" /> Create Carousel
              </Button>
            </Link>
            <Link href="/studio?type=HOOK">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Zap className="w-4 h-4" /> Generate Hook
              </Button>
            </Link>
            <Link href="/calendar">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Calendar className="w-4 h-4" /> Open Calendar
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Posts */}
      <Card className="border-border bg-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Your latest generated content.</CardDescription>
          </div>
          <Link href="/posts">
            <Button variant="ghost" size="sm" className="gap-1">
              View all <ArrowUpRight className="w-3 h-3" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {recentPosts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p>No posts yet. Start creating content in the AI Studio!</p>
              <Link href="/studio" className="mt-4 inline-block">
                <Button variant="gradient" size="sm">Open AI Studio</Button>
              </Link>
            </div>
          ) : (
            <ScrollArea className="h-[300px]">
              <div className="space-y-3">
                {recentPosts.map((post) => (
                  <Link key={post.id} href={`/posts/${post.id}`} className="block">
                    <div className="flex items-center gap-4 p-3 rounded-md hover:bg-muted transition-colors border border-transparent hover:border-border">
                      <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                        <FileText className="w-4 h-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate">
                            {post.title || post.content.slice(0, 50)}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {typeLabels[post.type] || post.type}
                          </Badge>
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[post.status] || ""}`}>
                            {statusLabels[post.status] || post.status}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-1">
                          {post.content.slice(0, 80)}...
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-muted-foreground">
                          {formatRelativeTime(post.createdAt)}
                        </div>
                        {post.impressions > 0 && (
                          <div className="text-xs text-muted-foreground">
                            {post.impressions.toLocaleString()} views
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
