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
    const cookieHeader = heads.get("cookie") || "";
    
    // Extract sessionToken from cookie
    const tokenMatch = cookieHeader.match(/linkedforge_session=([^;]+)/);
    const token = tokenMatch ? tokenMatch[1] : null;

    // Extract user custom name and email from cookie if set during signup/login
    let customUser: { name?: string; email?: string } | null = null;
    const userMatch = cookieHeader.match(/linkedforge_user_data=([^;]+)/);
    if (userMatch) {
      try {
        customUser = JSON.parse(decodeURIComponent(userMatch[1]));
      } catch {}
    }

    // 1. Direct Prisma Database query if session token exists
    if (token) {
      const dbSession = await prisma.session.findUnique({
        where: { sessionToken: token },
        include: { user: true },
      }).catch(() => null);

      if (dbSession?.user) {
        return {
          user: dbSession.user,
          session: dbSession,
        } as any;
      }
    }

    // 2. Query DB by email from cookie if available
    if (customUser?.email) {
      let dbUser = await prisma.user.findUnique({
        where: { email: customUser.email },
      }).catch(() => null);

      if (!dbUser && customUser.email) {
        // Create user in Neon PostgreSQL if missing
        dbUser = await prisma.user.create({
          data: {
            name: customUser.name || customUser.email.split("@")[0] || "User",
            email: customUser.email,
            credits: 50,
            role: "USER",
          },
        }).catch(() => null);
      }

      if (dbUser) {
        return {
          user: dbUser,
          session: {
            id: "sess_" + dbUser.id,
            userId: dbUser.id,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            sessionToken: token || "session_token",
          },
        } as any;
      }
    }

    return null;
  } catch {
    return null;
  }
}
