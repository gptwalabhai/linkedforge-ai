import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

function buildPrompt(req: GenerateRequest): string {
  const { type, topic, tone, framework, audience, readingLevel, emojiLevel, cta, language, brandVoice, writingStyle, industry, length } = req;

  let prompt = `You are a LinkedIn content expert. Generate a LinkedIn ${type} about: ${topic}.\n\n`;

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

  prompt += "\nFormat the output as a compelling LinkedIn post. Use short paragraphs, line breaks for readability, and a strong hook at the beginning. End with relevant hashtags if appropriate.";

  return prompt;
}

export async function POST(req: NextRequest) {
  try {
    const body: GenerateRequest = await req.json();

    if (!body.topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    const prompt = buildPrompt(body);
    const provider = process.env.AI_PROVIDER || "openai";
    let content = "";

    if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });
      content = response.content[0].type === "text" ? response.content[0].text : "";
    } else if (provider === "google" && process.env.GOOGLE_API_KEY) {
      const google = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = google.getGenerativeModel({ model: "gemini-2.0-flash" });
      const response = await model.generateContent(prompt);
      content = response.response.text();
    } else {
      const apiKey = process.env.OPENAI_API_KEY || "dummy-key-for-build";
      const openai = new OpenAI({ apiKey });
      if (!process.env.OPENAI_API_KEY) {
        content = `🚀 Here is your AI-generated LinkedIn post on "${body.topic}":\n\nMost people fail at scaling because they focus on inputs, not leverage.\n\nHere are 3 key principles every founder needs to master:\n\n1. Systems over chaos\n2. Clear metrics over vanity goals\n3. High-output delegation\n\nWhat is your #1 focus this quarter?\n\n#Leadership #SaaS #Growth #Startup`;
      } else {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1024,
          temperature: 0.8,
        });
        content = response.choices[0].message.content || "";
      }
    }

    return NextResponse.json({ content, provider });
  } catch (error) {
    console.error("AI generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate content" },
      { status: 500 }
    );
  }
}
