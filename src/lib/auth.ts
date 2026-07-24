import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET || "linkedforge-ai-super-secret-key-32chars-min",
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    minPasswordLength: 8,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  user: {
    additionalFields: {
      brandVoice: { type: "string", required: false },
      writingStyle: { type: "string", required: false },
      industry: { type: "string", required: false },
      jobTitle: { type: "string", required: false },
      company: { type: "string", required: false },
      timezone: { type: "string", required: false },
      credits: { type: "number", required: false, defaultValue: 10 },
      role: { type: "string", required: false, defaultValue: "USER" },
    },
  },
  rateLimit: {
    enabled: true,
    window: 60,
    max: 30,
  },
  advanced: {
    cookies: {
      session_token: {
        name: "linkedforge_session",
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;

export async function getSession(): Promise<Session | null> {
  try {
    const { headers } = await import("next/headers");
    const heads = await headers();
    const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const request = new Request(`${baseUrl}/api/auth/get-session`, {
      headers: heads,
    });
    const response = await auth.handler(request);
    if (!response.ok) return null;
    const data = await response.json();
    return data as Session | null;
  } catch {
    return null;
  }
}
