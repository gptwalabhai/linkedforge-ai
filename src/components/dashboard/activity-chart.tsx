"use client";

import { useEffect, useRef } from "react";

interface DataPoint {
  month: string;
  posts: number;
  engagement: number;
}

interface ActivityChartProps {
  data: DataPoint[];
}

export function ActivityChart({ data }: ActivityChartProps) {
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

    const maxPosts = Math.max(...data.map((d) => d.posts), 1);
    const maxEngagement = Math.max(...data.map((d) => d.engagement), 1);

    // Clear
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

    // Bar chart for posts
    const barWidth = chartWidth / data.length * 0.35;
    const gap = chartWidth / data.length;

    data.forEach((d, i) => {
      const x = padding.left + gap * i + gap / 2;
      const barHeight = (d.posts / maxPosts) * chartHeight;
      const gradient = ctx.createLinearGradient(x, padding.top, x, padding.top + barHeight);
      gradient.addColorStop(0, "rgba(99,102,241,0.8)");
      gradient.addColorStop(1, "rgba(99,102,241,0.2)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(x - barWidth / 2, padding.top + chartHeight - barHeight, barWidth, barHeight, [4, 4, 0, 0]);
      ctx.fill();
    });

    // Line chart for engagement
    ctx.strokeStyle = "rgba(236,72,153,0.6)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    data.forEach((d, i) => {
      const x = padding.left + gap * i + gap / 2;
      const y = padding.top + chartHeight - (d.engagement / maxEngagement) * chartHeight;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Dots
    data.forEach((d, i) => {
      const x = padding.left + gap * i + gap / 2;
      const y = padding.top + chartHeight - (d.engagement / maxEngagement) * chartHeight;
      ctx.fillStyle = "#ec4899";
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Month labels
    ctx.fillStyle = "rgba(255,255,255,0.4)";
    ctx.font = "11px Inter, sans-serif";
    ctx.textAlign = "center";
    data.forEach((d, i) => {
      const x = padding.left + gap * i + gap / 2;
      ctx.fillText(d.month, x, height - padding.bottom + 20);
    });

    // Y-axis labels
    ctx.textAlign = "right";
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    for (let i = 0; i <= 4; i++) {
      const y = padding.top + (chartHeight / 4) * i;
      const val = Math.round(maxPosts - (maxPosts / 4) * i);
      ctx.fillText(val.toString(), padding.left - 8, y + 4);
    }

    // Legend
    ctx.textAlign = "left";
    ctx.fillStyle = "rgba(99,102,241,0.8)";
    ctx.fillRect(padding.left, 8, 12, 12);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText("Posts", padding.left + 18, 18);

    ctx.fillStyle = "rgba(236,72,153,0.8)";
    ctx.fillRect(padding.left + 80, 8, 12, 12);
    ctx.fillStyle = "rgba(255,255,255,0.5)";
    ctx.fillText("Engagement", padding.left + 98, 18);
  }, [data]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-[250px]"
      style={{ width: "100%", height: "250px" }}
    />
  );
}
