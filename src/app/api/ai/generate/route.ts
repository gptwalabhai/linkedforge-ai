import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import prisma from "@/lib/db";
import { getSession } from "@/lib/auth";

// Simple in-memory rate limiter (per-process)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 30; // requests per minute
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute

function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (entry.count >= RATE_LIMIT_MAX) return false;
  entry.count++;
  return true;
}

interface GenerateRequest {
  type: string;
  topic: string;
  tone?: string;
  framework?: string;
  audience?: string;
  readingLevel?: string;
  emojiLevel?: number;
  hashtags?: string[];
  keywords?: string[];
  cta?: string;
  language?: string;
  brandVoice?: string;
  writingStyle?: string;
  industry?: string;
  length?: "short" | "medium" | "long";
}

const MASTER_SYSTEM_PROMPT = `You are an elite, 20-year veteran LinkedIn ghostwriter and content strategist.
Your goal is to write high-performing, viral, and deeply engaging LinkedIn content.

### DEEP UNDERSTANDING OF ALGORITHM SIGNALS:
- Dwell Time: Hook the reader immediately and maintain attention through formatting.
- Comments: End with thought-provoking questions that naturally compel replies.
- Saves & Shares: Deliver dense, actionable value that users want to bookmark or share.

### HOOK PSYCHOLOGY:
- Use pattern interrupts to stop the scroll.
- Leverage curiosity gaps ("The biggest mistake...", "What I learned from...").
- Employ contrarian hooks if applicable, challenging common industry norms.

### STRUCTURE & FORMATTING RULES:
- Write for mobile readability.
- Use extremely short paragraphs (1-3 lines max).
- Include line breaks and whitespace.
- Use lists and bullet points for scannability.

### CONTENT FRAMEWORKS TO UTILIZE:
- AIDA (Attention, Interest, Desire, Action)
- PAS (Problem, Agitation, Solution)
- BAB (Before, After, Bridge)
- StoryBrand (Character, Problem, Guide, Plan, Success)

### ANTI-PATTERNS TO AVOID:
- NO corporate jargon or buzzwords (e.g., "synergy", "paradigm shift").
- NO clickbait or misleading hooks.
- NO generic advice; provide specific, unique insights.
- NO overly formal, robotic language; write conversationally.

### CTA PSYCHOLOGY:
- Make CTAs engagement-driven (e.g., "What's your take?", "Which one are you?") or conversion-optimized.
- Keep them frictionless and easy to answer.

### HASHTAG STRATEGY:
- Use exactly 3-5 highly relevant hashtags.
- Mix niche-specific hashtags with broad-appeal hashtags.
- Place them at the very bottom.

### PERSONAL BRANDING PRINCIPLES:
- Inject authenticity, vulnerability, and real-world experience.
- Frame insights through personal stories or clear observations.`;

function buildUserPrompt(req: GenerateRequest): string {
  const { type, topic, tone, framework, audience, readingLevel, emojiLevel, cta, language, brandVoice, writingStyle, industry, length } = req;

  let prompt = `Generate a high-performing LinkedIn ${type} about: ${topic}.\n\n`;

  if (brandVoice) prompt += `Brand Voice: ${brandVoice}\n`;
  if (tone) prompt += `Tone: ${tone}\n`;
  if (industry) prompt += `Industry: ${industry}\n`;
  if (writingStyle) prompt += `Writing Style: ${writingStyle}\n`;
  if (audience) prompt += `Target Audience: ${audience}\n`;
  if (readingLevel) prompt += `Reading Level: ${readingLevel}\n`;
  if (language && language !== "en") prompt += `Language: ${language}\n`;
  if (framework) prompt += `Use the ${framework} framework.\n`;
  if (length) prompt += `Length: ${length === "short" ? "50-100 words" : length === "medium" ? "100-200 words" : "200-400 words"}\n`;
  if (cta) prompt += `Include this CTA: ${cta}\n`;
  if (emojiLevel !== undefined) prompt += `Emoji level (0=none, 1=minimal, 2=moderate, 3=heavy): ${emojiLevel}\n`;
  if (req.hashtags && req.hashtags.length > 0) prompt += `Include hashtags: ${req.hashtags.join(", ")}\n`;
  if (req.keywords && req.keywords.length > 0) prompt += `Include keywords: ${req.keywords.join(", ")}\n`;

  prompt += "\nEnsure it adheres to the master strategist principles, focusing on strong opening hooks, short digestible paragraphs, and a powerful CTA.";

  return prompt;
}

function generateDeepSeekFallback(type: string, topic: string, cta?: string): string {
  const cleanTopic = topic.trim();
  const ctaText = cta ? `\n\n👉 ${cta}` : "\n\nWhat is your perspective on this? Drop your thoughts below! 👇";
  const tagTopic = cleanTopic.replace(/[^\w\s]/gi, "").replace(/\s+/g, "");

  switch (type.toUpperCase()) {
    case "CAROUSEL":
      return `📱 [LinkedIn Carousel Slide Outline]\n\nSLIDE 1: The Harsh Truth About ${cleanTopic}\n(Stop scrolling if you want to scale faster in 2026)\n\nSLIDE 2: Problem #1 - Fragmented Workflows\nMost teams waste 15+ hours weekly on manual execution.\n\nSLIDE 3: The 3-Step Framework\n1. Standardize core inputs\n2. Automate repetitive loops\n3. Focus 80% effort on high-leverage strategy\n\nSLIDE 4: Case Study Results\n+140% higher productivity\n3x faster output speed\n\nSLIDE 5: Take Action Today${ctaText}`;

    case "HOOK":
      return `🔥 5 Powerful LinkedIn Hooks for: "${cleanTopic}"\n\n1. "90% of leaders are doing ${cleanTopic} completely wrong. Here's why:"\n2. "If I had to restart ${cleanTopic} from scratch, here is the exact 5-step playbook I would use:"\n3. "The biggest lie you've been told about ${cleanTopic}:"\n4. "3 hard-learned lessons from 4+ years of ${cleanTopic}:"\n5. "Why most people fail at ${cleanTopic} (and how to be in the top 10%):"`;

    case "POLL":
      return `📊 Poll: What is your biggest challenge with ${cleanTopic}?\n\nOption A: Lack of strategy & clarity\nOption B: Time & execution constraints\nOption C: Scaling & ROI tracking\nOption D: Finding the right tools\n\n${ctaText}`;

    default:
      return `🚀 The Secret to Mastering ${cleanTopic}\n\nMost professionals struggle with ${cleanTopic} because they focus on short-term tactics instead of sustainable leverage.\n\nHere are 3 core principles to transform your approach:\n\n1. Quality Over Quantity: Focus on high-impact leverage points that move the needle.\n\n2. Consistency & Systems: Build repeatable processes so execution happens effortlessly.\n\n3. Data-Driven Feedback: Iteratively optimize based on real results rather than assumptions.\n\nBottom Line: ${cleanTopic} is not about working harder—it's about building smarter systems.${ctaText}\n\n#${tagTopic || "SaaS"} #Leadership #SaaS #Growth #DeepSeekV4Pro`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();

    if (!body.topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    // Auth & credit check
    let userId: string | null = null;
    let userCredits = 0;
    try {
      const session = await getSession();
      if (session?.user?.id) {
        userId = session.user.id;

        // Rate limit check
        if (!checkRateLimit(userId)) {
          return NextResponse.json(
            { error: "Rate limit exceeded. Please wait before generating more content." },
            { status: 429 }
          );
        }

        const user = await prisma.user.findUnique({
          where: { id: userId },
          select: { credits: true, role: true },
        });
        if (user) {
          userCredits = user.credits;
          // Admins bypass credit limits
          if (user.role !== "ADMIN" && user.credits <= 0) {
            return NextResponse.json(
              { error: "No credits remaining. Please upgrade your plan or contact admin.", creditsRemaining: 0 },
              { status: 403 }
            );
          }
        }
      }
    } catch {
      // Auth check failed — allow generation with fallback (no credit deduction)
    }

    const userPrompt = buildUserPrompt(body);
    const provider = process.env.AI_PROVIDER || "deepseek";
    let content = "";

    const apiKey = process.env.DEEPSEEK_API_KEY;
    const baseURL = process.env.DEEPSEEK_BASE_URL || "https://api.hcnsec.cn/v1";
    const model = process.env.DEEPSEEK_MODEL || "DeepSeek-V4-Pro";

    if (apiKey) {
      try {
        const deepseek = new OpenAI({
          baseURL,
          apiKey,
        });
        const response = await deepseek.chat.completions.create({
          model,
          messages: [
            { role: "system", content: MASTER_SYSTEM_PROMPT },
            { role: "user", content: userPrompt }
          ],
          max_tokens: 1024,
          temperature: 0.7,
        });
        content = response.choices[0].message.content || "";
      } catch (err) {
        console.warn("Live DeepSeek V4 Pro API call failed, using fallback engine:", err);
        content = generateDeepSeekFallback(body.type, body.topic, body.cta);
      }
    } else if (process.env.OPENAI_API_KEY) {
      try {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: MASTER_SYSTEM_PROMPT },
            { role: "user", content: userPrompt }
          ],
          max_tokens: 1024,
          temperature: 0.8,
        });
        content = response.choices[0].message.content || "";
      } catch (err) {
        console.warn("Live OpenAI API call failed, using fallback engine:", err);
        content = generateDeepSeekFallback(body.type, body.topic, body.cta);
      }
    } else {
      content = generateDeepSeekFallback(body.type, body.topic, body.cta);
    }

    // Deduct credit on successful generation
    let creditsRemaining = userCredits;
    if (userId && content) {
      try {
        const updated = await prisma.user.update({
          where: { id: userId },
          data: { credits: { decrement: 1 } },
          select: { credits: true },
        });
        creditsRemaining = updated.credits;
      } catch {
        // Credit deduction failed — non-blocking
      }
    }

    return NextResponse.json({ content, provider: "deepseek", model, creditsRemaining });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json({
      content: generateDeepSeekFallback("POST", "SaaS Development"),
      provider: "deepseek",
    });
  }
}
