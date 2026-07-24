import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string | null): string {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatRelativeTime(date: Date | string | null): string {
  if (!date) return "";
  const now = new Date();
  const then = new Date(date);
  const diffMs = now.getTime() - then.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "…";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function wordCount(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export function estimateReadTime(str: string): number {
  const words = wordCount(str);
  return Math.ceil(words / 200);
}

export const PLANS = {
  FREE: { name: "Free", price: 0, credits: 10, priceId: null },
  PRO: { name: "Pro", price: 29, credits: 200, priceId: process.env.STRIPE_PRO_PRICE_ID },
  TEAM: { name: "Team", price: 79, credits: 1000, priceId: process.env.STRIPE_TEAM_PRICE_ID },
  ENTERPRISE: { name: "Enterprise", price: 199, credits: 5000, priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID },
} as const;

export const POST_TYPES = [
  { value: "POST", label: "Post", icon: "file-text" },
  { value: "CAROUSEL", label: "Carousel", icon: "layers" },
  { value: "HOOK", label: "Hook", icon: "zap" },
  { value: "THREAD", label: "Thread", icon: "message-square" },
  { value: "POLL", label: "Poll", icon: "bar-chart-2" },
  { value: "STORY", label: "Story", icon: "book-open" },
  { value: "EDUCATIONAL", label: "Educational", icon: "graduation-cap" },
  { value: "THOUGHT_LEADERSHIP", label: "Thought Leadership", icon: "crown" },
  { value: "CTA", label: "CTA", icon: "mouse-pointer" },
  { value: "COLD_OUTREACH", label: "Cold Outreach", icon: "mail" },
  { value: "FOUNDER_UPDATE", label: "Founder Update", icon: "megaphone" },
  { value: "CASE_STUDY", label: "Case Study", icon: "file-check" },
  { value: "LESSONS_LEARNED", label: "Lessons Learned", icon: "lightbulb" },
  { value: "BEHIND_THE_SCENES", label: "Behind the Scenes", icon: "eye" },
  { value: "PRODUCT_LAUNCH", label: "Product Launch", icon: "rocket" },
  { value: "HIRING", label: "Hiring", icon: "users" },
  { value: "SALES", label: "Sales", icon: "dollar-sign" },
  { value: "LEAD_MAGNET", label: "Lead Magnet", icon: "magnet" },
  { value: "NEWSLETTER", label: "Newsletter", icon: "send" },
  { value: "REPLY", label: "Reply", icon: "reply" },
  { value: "COMMENT", label: "Comment", icon: "message-circle" },
] as const;

export const TONES = [
  "Professional", "Casual", "Friendly", "Authoritative",
  "Inspirational", "Humorous", "Educational", "Controversial",
] as const;

export const FRAMEWORKS = [
  { value: "PAS", label: "PAS (Problem-Agitation-Solution)" },
  { value: "AIDA", label: "AIDA (Attention-Interest-Desire-Action)" },
  { value: "BAB", label: "BAB (Before-After-Bridge)" },
  { value: "HERO_JOURNEY", label: "Hero's Journey" },
  { value: "STORY", label: "Storytelling Framework" },
] as const;

export const READING_LEVELS = [
  "Elementary", "Middle School", "High School",
  "College", "Professional",
] as const;

export const LANGUAGES = [
  { value: "en", label: "English" },
  { value: "es", label: "Spanish" },
  { value: "fr", label: "French" },
  { value: "de", label: "German" },
  { value: "pt", label: "Portuguese" },
  { value: "zh", label: "Chinese" },
  { value: "ja", label: "Japanese" },
  { value: "ko", label: "Korean" },
  { value: "hi", label: "Hindi" },
] as const;

export function getPlanCredits(plan: string): number {
  switch (plan) {
    case "PRO": return 200;
    case "TEAM": return 1000;
    case "ENTERPRISE": return 5000;
    default: return 10;
  }
}
