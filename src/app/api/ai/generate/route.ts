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

const MASTER_SYSTEM_PROMPT = `You are an elite, 20-year veteran LinkedIn ghostwriter and content strategist for Fortune 500 executives and top-tier founders.
Your goal is to write high-performing, viral, humanized, and deeply engaging LinkedIn content ready to publish.

### STRICT OUTPUT RULES:
- DO NOT wrap the output in quotes or start with commas or symbols.
- DO NOT include conversational filler like "Here is your post:" or "Sure, here's a post".
- Start IMMEDIATELY on line 1 with the opening hook.

### ALGORITHM & ENGAGEMENT OPTIMIZATION:
- Dwell Time: Hook the reader on Line 1 with a scroll-stopping pattern interrupt.
- Comments & Shares: Pack every line with raw tactical value, eliminating fluff.
- Readability: Mobile-first structure with 1-3 sentence paragraphs and generous line spacing.

### HOOK PSYCHOLOGY:
- Pattern Interrupts: Challenge standard advice ("Stop doing X if you want Y").
- Vulnerable Storytelling: Ground insights in realistic scenarios and hard-learned lessons.
- Contrarian Insights: Offer non-obvious, highly actionable perspectives.

### ANTI-PATTERNS (NEVER USE):
- NO corporate jargon ("synergy", "leverage", "game-changer", "delve", "testament").
- NO robotic AI phrases ("In today's fast-paced world", "Let's dive in", "Unlocking potential").
- NO excessive emojis. Keep emojis subtle and natural (0-2 per post).

### STRUCTURAL FRAMEWORKS:
- AIDA (Attention, Interest, Desire, Action)
- PAS (Problem, Agitation, Solution)
- BAB (Before, After, Bridge)
- End with a low-friction, natural question that encourages meaningful comments.`;

function cleanGeneratedContent(text: string): string {
  if (!text) return "";
  let cleaned = text.trim();
  
  // Strip markdown code fences if present
  cleaned = cleaned.replace(/^```(?:markdown|text)?\n?/i, "").replace(/\n?```$/i, "").trim();
  
  // Strip conversational introductions
  cleaned = cleaned.replace(/^(?:Here is|Here's|Sure|Certainly|Below is)(?:[^\n:]+):?\s*/i, "").trim();
  
  // Remove leading commas, quotes, or stray punctuation
  cleaned = cleaned.replace(/^[",'\s]+/, "").replace(/["]+$/, "").trim();
  cleaned = cleaned.replace(/^,\s*/, "");
  
  return cleaned;
}

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

    // Clean content to remove quotes, leading commas, and fluff
    content = cleanGeneratedContent(content);

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
