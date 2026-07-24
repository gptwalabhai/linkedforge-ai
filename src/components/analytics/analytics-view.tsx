"use client";

import { useEffect, useRef } from "react";
import {
  BarChart3,
  TrendingUp,
  Users,
  Percent,
  Zap,
  ArrowUpRight,
  Lightbulb,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MonthlyImpression {
  month: string;
  impressions: number;
}

interface EngagementPoint {
  month: string;
  engagement: number;
}

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
  engagementScore?: number;
}

interface PublishingWeek {
  week: string;
  posts: number;
}

interface AISuggestion {
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
}

interface AnalyticsViewProps {
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
  stats: {
    totalPosts: number;
    totalImpressions: number;
    totalEngagement: number;
    avgEngagementRate: number;
  };
  monthlyImpressions: MonthlyImpression[];
  engagementOverTime: EngagementPoint[];
  bestPerformingPosts: Post[];
  publishingFrequency: PublishingWeek[];
  aiSuggestions: AISuggestion[];
}

const impactColors: Record<string, string> = {
  high: "bg-green-500/10 text-green-500 border-green-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
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

export function AnalyticsView({
  user,
  stats,
  monthlyImpressions,
  engagementOverTime,
  bestPerformingPosts,
  publishingFrequency,
  aiSuggestions,
}: AnalyticsViewProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your content performance and growth insights.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Posts
            </CardTitle>
            <div className="w-8 h-8 rounded-md bg-blue-500/10 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-blue-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPosts}</div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Impressions
            </CardTitle>
            <div className="w-8 h-8 rounded-md bg-purple-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-purple-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalImpressions.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Engagement
            </CardTitle>
            <div className="w-8 h-8 rounded-md bg-pink-500/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-pink-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalEngagement.toLocaleString()}
            </div>
          </CardContent>
        </Card>
        <Card className="border-border bg-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Avg Engagement Rate
            </CardTitle>
            <div className="w-8 h-8 rounded-md bg-green-500/10 flex items-center justify-center">
              <Percent className="w-4 h-4 text-green-400" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgEngagementRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Monthly Impressions Bar Chart */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Monthly Impressions</CardTitle>
            <CardDescription>Total impressions over the past year.</CardDescription>
          </CardHeader>
          <CardContent>
            <ImpressionsBarChart data={monthlyImpressions} />
          </CardContent>
        </Card>

        {/* Engagement Over Time Line Chart */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Engagement Over Time</CardTitle>
            <CardDescription>
              Total engagement (likes + comments) by month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EngagementLineChart data={engagementOverTime} />
          </CardContent>
        </Card>
      </div>

      {/* Best Performing + Publishing Frequency */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Best Performing Posts */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Best Performing Posts</CardTitle>
            <CardDescription>
              Top 5 posts ranked by engagement score.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[320px] pr-4">
              <div className="space-y-3">
                {bestPerformingPosts.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-30" />
                    <p>No posts yet to analyze.</p>
                  </div>
                ) : (
                  bestPerformingPosts.map((post, idx) => (
                    <div
                      key={post.id}
                      className="flex items-center gap-4 p-3 rounded-md hover:bg-muted transition-colors border border-transparent hover:border-border"
                    >
                      <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0 font-bold text-sm text-primary">
                        #{idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium truncate text-sm">
                            {post.title || post.content.slice(0, 40)}
                          </span>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {typeLabels[post.type] || post.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {post.impressions.toLocaleString()} impressions
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-sm font-semibold text-green-500">
                          {post.engagementScore?.toFixed(0) || 0}
                        </div>
                        <div className="text-xs text-muted-foreground">score</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Publishing Frequency */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Publishing Frequency</CardTitle>
            <CardDescription>
              Posts published per week over the last 8 weeks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PublishingFrequencyChart data={publishingFrequency} />
          </CardContent>
        </Card>
      </div>

      {/* AI Suggestions */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            <CardTitle>AI Suggestions</CardTitle>
          </div>
          <CardDescription>
            Actionable insights to improve your content performance.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {aiSuggestions.map((suggestion, idx) => (
              <div
                key={idx}
                className="p-4 rounded-lg border border-border bg-muted/30 hover:bg-muted transition-colors"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-sm">{suggestion.title}</h3>
                  <Badge
                    variant="outline"
                    className={`text-xs ${impactColors[suggestion.impact]}`}
                  >
                    {suggestion.impact}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {suggestion.description}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Bar Chart for Monthly Impressions
function ImpressionsBarChart({ data }: { data: MonthlyImpression[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxVal = Math.max(...data.map((d) => d.impressions), 1);

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Bars
    const barWidth = chartWidth / data.length * 0.6;
    const gap = chartWidth / data.length;

    data.forEach((d, i) => {
      const x = padding.left + gap * i + gap / 2;
      const barHeight = (d.impressions / maxVal) * chartHeight;
      const gradient = ctx.createLinearGradient(x, padding.top, x, padding.top + barHeight);
      gradient.addColorStop(0, "rgba(168,85,247,0.9)");
      gradient.addColorStop(1, "rgba(168,85,247,0.15)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(
        x - barWidth / 2,
        padding.top + chartHeight - barHeight,
        barWidth,
        barHeight,
        [4, 4, 0, 0]
      );
      ctx.fill();
    });

    // Month labels
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "11px Inter, sans-serif";
    ctx.textAlign = "center";
    data.forEach((d, i) => {
      const x = padding.left + gap * i + gap / 2;
      ctx.fillText(d.month, x, height - padding.bottom + 18);
    });

    // Y-axis labels
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      const val = Math.round(maxVal - (maxVal / 4) * i);
      ctx.fillText(
        val >= 1000 ? (val / 1000).toFixed(1) + "K" : val.toString(),
        padding.left - 8,
        y + 4
      );
    }
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[250px]"
      style={{ width: "100%", height: "250px" }}
    />
  );
}

// Line Chart for Engagement Over Time
function EngagementLineChart({ data }: { data: EngagementPoint[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxVal = Math.max(...data.map((d) => d.engagement), 1);

    ctx.clearRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Area fill
    const gap = chartWidth / (data.length - 1 || 1);
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = padding.left + gap * i;
      const y =
        padding.top + chartHeight - (d.engagement / maxVal) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    // Close the area
    ctx.lineTo(padding.left + gap * (data.length - 1), padding.top + chartHeight);
    ctx.lineTo(padding.left, padding.top + chartHeight);
    ctx.closePath();
    const areaGradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartHeight);
    areaGradient.addColorStop(0, "rgba(236,72,153,0.2)");
    areaGradient.addColorStop(1, "rgba(236,72,153,0.0)");
    ctx.fillStyle = areaGradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    ctx.strokeStyle = "rgba(236,72,153,0.8)";
    ctx.lineWidth = 2;
    data.forEach((d, i) => {
      const x = padding.left + gap * i;
      const y =
        padding.top + chartHeight - (d.engagement / maxVal) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dots
    data.forEach((d, i) => {
      const x = padding.left + gap * i;
      const y =
        padding.top + chartHeight - (d.engagement / maxVal) * chartHeight;
      ctx.fillStyle = "#ec4899";
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(236,72,153,0.3)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.stroke();
    });

    // Month labels
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "11px Inter, sans-serif";
    ctx.textAlign = "center";
    data.forEach((d, i) => {
      const x = padding.left + gap * i;
      ctx.fillText(d.month, x, height - padding.bottom + 18);
    });

    // Y-axis labels
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      const val = Math.round(maxVal - (maxVal / 4) * i);
      ctx.fillText(val.toString(), padding.left - 8, y + 4);
    }
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[250px]"
      style={{ width: "100%", height: "250px" }}
    />
  );
}

// Bar Chart for Publishing Frequency
function PublishingFrequencyChart({ data }: { data: PublishingWeek[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 20, bottom: 40, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    const maxVal = Math.max(...data.map((d) => d.posts), 1);

    ctx.clearRect(0, 0, width, height);

    // Grid
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Bars
    const barWidth = chartWidth / data.length * 0.5;
    const gap = chartWidth / data.length;

    data.forEach((d, i) => {
      const x = padding.left + gap * i + gap / 2;
      const barHeight = (d.posts / maxVal) * chartHeight;
      const gradient = ctx.createLinearGradient(x, padding.top, x, padding.top + barHeight);
      gradient.addColorStop(0, "rgba(59,130,246,0.85)");
      gradient.addColorStop(1, "rgba(59,130,246,0.15)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(
        x - barWidth / 2,
        padding.top + chartHeight - barHeight,
        barWidth,
        barHeight,
        [4, 4, 0, 0]
      );
      ctx.fill();
    });

    // Week labels
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "10px Inter, sans-serif";
    ctx.textAlign = "center";
    data.forEach((d, i) => {
      const x = padding.left + gap * i + gap / 2;
      ctx.fillText(d.week, x, height - padding.bottom + 18);
    });

    // Y-axis
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      const val = Math.round(maxVal - (maxVal / 4) * i);
      ctx.fillText(val.toString(), padding.left - 8, y + 4);
    }
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[250px]"
      style={{ width: "100%", height: "250px" }}
    />
  );
}
