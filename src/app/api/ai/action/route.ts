import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, content, language } = body;

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    let prompt = "";
    switch (action) {
      case "rewrite":
        prompt = `Rewrite the following LinkedIn post using DeepSeek AI to make it viral, engaging, and formatted for maximum reach. Preserve key insights:\n\n${content}`;
        break;
      case "expand":
        prompt = `Expand the following LinkedIn content by adding deeper strategic insights, practical examples, actionable takeaways, and structured formatting:\n\n${content}`;
        break;
      case "shorten":
        prompt = `Shorten and condense the following LinkedIn post into a punchy, ultra-readable 2-4 paragraph format with maximum impact:\n\n${content}`;
        break;
      case "humanize":
        prompt = `Humanize the following LinkedIn post. Remove corporate jargon, robotic phrasing, and make it sound like an authentic personal story from an industry leader:\n\n${content}`;
        break;
      case "factCheck":
        prompt = `Analyze the following LinkedIn post content and highlight any potential claims, statistics, or facts that require double-checking or sourcing, and suggest improved wording:\n\n${content}`;
        break;
      case "grammar":
        prompt = `Polish and fix all spelling, punctuation, and grammatical errors in the following LinkedIn content while enhancing overall flow:\n\n${content}`;
        break;
      case "translate":
        prompt = `Translate the following LinkedIn content into ${language || "Spanish"}. Maintain the original tone, formatting, and high-engagement LinkedIn style:\n\n${content}`;
        break;
      case "repurpose_blog":
        prompt = `Take the following blog content/article and turn it into a viral LinkedIn post with a strong hook, key takeaways as bullet points, and an engaging CTA:\n\n${content}`;
        break;
      case "repurpose_tweet":
        prompt = `Take the following tweet / thread and expand it into a full structured LinkedIn post optimized for high personal branding and engagement:\n\n${content}`;
        break;
      case "repurpose_youtube":
        prompt = `Take the following YouTube video transcript/summary and convert it into a top-performing LinkedIn post summarizing key lessons learned:\n\n${content}`;
        break;
      default:
        prompt = `Improve the following LinkedIn post content for maximum engagement using DeepSeek AI:\n\n${content}`;
    }

    const provider = process.env.AI_PROVIDER || "deepseek";
    let resultText = "";

    if ((provider === "deepseek" || process.env.DEEPSEEK_API_KEY) && process.env.DEEPSEEK_API_KEY) {
      const deepseek = new OpenAI({
        baseURL: "https://api.deepseek.com",
        apiKey: process.env.DEEPSEEK_API_KEY,
      });
      const response = await deepseek.chat.completions.create({
        model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1024,
        temperature: 0.7,
      });
      resultText = response.choices[0].message.content || "";
    } else if (provider === "anthropic" && process.env.ANTHROPIC_API_KEY) {
      const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [{ role: "user", content: prompt }],
      });
      resultText = response.content[0].type === "text" ? response.content[0].text : "";
    } else if (provider === "google" && process.env.GOOGLE_API_KEY) {
      const google = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
      const model = google.getGenerativeModel({ model: "gemini-2.0-flash" });
      const response = await model.generateContent(prompt);
      resultText = response.response.text();
    } else {
      const apiKey = process.env.OPENAI_API_KEY || "dummy-key-for-build";
      const openai = new OpenAI({ apiKey });
      if (!process.env.OPENAI_API_KEY && !process.env.DEEPSEEK_API_KEY) {
        resultText = `⚡ [DeepSeek V4 Flash Action - ${action.toUpperCase()}]\n\nHere is your optimized LinkedIn content powered by DeepSeek AI:\n\n${content}\n\n💡 Set DEEPSEEK_API_KEY in .env for live API generation!`;
      } else {
        const response = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1024,
          temperature: 0.7,
        });
        resultText = response.choices[0].message.content || "";
      }
    }

    return NextResponse.json({ content: resultText, action, provider: process.env.DEEPSEEK_API_KEY ? "deepseek" : provider });
  } catch (error) {
    console.error("AI action error:", error);
    return NextResponse.json(
      { error: "Failed to process AI action" },
      { status: 500 }
    );
  }
}
