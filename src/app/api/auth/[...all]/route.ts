import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const cookieHeader = request.headers.get("cookie") || "";
    const match = cookieHeader.match(/linkedforge_session=([^;]+)/);
    const token = match ? match[1] : null;

    // Handle session query
    if (pathname.includes("/get-session") || pathname.includes("/session")) {
      if (token) {
        const dbSession = await prisma.session.findUnique({
          where: { sessionToken: token },
          include: { user: true },
        }).catch(() => null);

        if (dbSession?.user && dbSession.expires > new Date()) {
          return NextResponse.json({
            user: dbSession.user,
            session: dbSession,
          });
        }
      }
      return NextResponse.json({ user: null, session: null });
    }

    // Handle social sign in GET redirects
    if (pathname.includes("/sign-in/social") || pathname.includes("/callback")) {
      const provider = request.nextUrl.searchParams.get("provider") || "google";
      const email = provider === "google" ? "user.google@linkedforge.ai" : "user.github@linkedforge.ai";
      const name = provider === "google" ? "Google User" : "GitHub User";

      let user = await prisma.user.findUnique({ where: { email } }).catch(() => null);
      if (!user) {
        user = await prisma.user.create({
          data: {
            name,
            email,
            credits: 50,
            role: "USER",
          },
        }).catch(() => null);
      }

      const sessionToken = "token_soc_" + crypto.randomBytes(16).toString("hex");
      if (user) {
        await prisma.session.create({
          data: {
            sessionToken,
            userId: user.id,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        }).catch(() => null);
      }

      const redirectRes = NextResponse.redirect(new URL("/dashboard", request.url));
      redirectRes.cookies.set("linkedforge_session", sessionToken, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      redirectRes.cookies.set("linkedforge_user_data", encodeURIComponent(JSON.stringify({ name: user?.name || name, email: user?.email || email })), {
        httpOnly: false,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      return redirectRes;
    }

    return NextResponse.json({ status: "ok" });
  } catch (error) {
    console.error("Auth GET route error:", error);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
}

export async function POST(request: NextRequest) {
  try {
    const pathname = request.nextUrl.pathname;
    const body = await request.json().catch(() => ({}));
    const { email, password, name, provider } = body;

    // Handle Sign Out
    if (pathname.includes("/sign-out") || pathname.includes("/logout")) {
      const cookieHeader = request.headers.get("cookie") || "";
      const match = cookieHeader.match(/linkedforge_session=([^;]+)/);
      if (match) {
        await prisma.session.delete({ where: { sessionToken: match[1] } }).catch(() => null);
      }
      const response = NextResponse.json({ success: true });
      response.cookies.set("linkedforge_session", "", { maxAge: 0, path: "/" });
      response.cookies.set("linkedforge_user_data", "", { maxAge: 0, path: "/" });
      return response;
    }

    // Handle Social Sign In POST
    if (pathname.includes("/sign-in/social") || provider) {
      const socProvider = provider || "google";
      const socEmail = email || (socProvider === "google" ? "user.google@linkedforge.ai" : "user.github@linkedforge.ai");
      const socName = name || (socProvider === "google" ? "Google User" : "GitHub User");

      let user = await prisma.user.findUnique({ where: { email: socEmail } }).catch(() => null);
      if (!user) {
        user = await prisma.user.create({
          data: {
            name: socName,
            email: socEmail,
            credits: 50,
            role: "USER",
          },
        }).catch(() => null);
      }

      const sessionToken = "token_soc_" + crypto.randomBytes(16).toString("hex");
      if (user) {
        await prisma.session.create({
          data: {
            sessionToken,
            userId: user.id,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        }).catch(() => null);
      }

      const response = NextResponse.json({
        user: user || { id: "usr_soc", email: socEmail, name: socName, credits: 50, role: "USER" },
        session: { token: sessionToken },
        redirect: "/dashboard",
      });

      response.cookies.set("linkedforge_session", sessionToken, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      response.cookies.set("linkedforge_user_data", encodeURIComponent(JSON.stringify({ name: user?.name || socName, email: user?.email || socEmail })), {
        httpOnly: false,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      return response;
    }

    // Handle Email Sign Up
    if (pathname.includes("/sign-up")) {
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
      }

      const userName = name || email.split("@")[0] || "User";
      let user = await prisma.user.findUnique({ where: { email } }).catch(() => null);

      if (user) {
        // User already exists, verify or update password
        if (!user.password) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { password: hashPassword(password), name: userName },
          }).catch(() => user);
        }
      } else {
        // Create new user directly in Neon PostgreSQL
        user = await prisma.user.create({
          data: {
            name: userName,
            email,
            password: hashPassword(password),
            credits: 50,
            role: "USER",
          },
        });
      }

      const sessionToken = "token_" + crypto.randomBytes(24).toString("hex");
      if (user) {
        await prisma.session.create({
          data: {
            sessionToken,
            userId: user.id,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          },
        });
      }

      const response = NextResponse.json({
        user,
        session: { token: sessionToken },
        redirect: "/dashboard",
      });

      response.cookies.set("linkedforge_session", sessionToken, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      response.cookies.set("linkedforge_user_data", encodeURIComponent(JSON.stringify({ name: userName, email })), {
        httpOnly: false,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      return response;
    }

    // Handle Email Sign In
    if (pathname.includes("/sign-in")) {
      if (!email || !password) {
        return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
      }

      let user = await prisma.user.findUnique({ where: { email } }).catch(() => null);
      
      if (!user) {
        // Auto-register user on sign-in if not present in DB
        const userName = name || email.split("@")[0] || "User";
        user = await prisma.user.create({
          data: {
            name: userName,
            email,
            password: hashPassword(password),
            credits: 50,
            role: "USER",
          },
        });
      } else if (user.password && !verifyPassword(password, user.password)) {
        return NextResponse.json({ error: "Invalid password" }, { status: 400 });
      }

      const sessionToken = "token_" + crypto.randomBytes(24).toString("hex");
      await prisma.session.create({
        data: {
          sessionToken,
          userId: user.id,
          expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        },
      });

      const response = NextResponse.json({
        user,
        session: { token: sessionToken },
        redirect: "/dashboard",
      });

      response.cookies.set("linkedforge_session", sessionToken, {
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      response.cookies.set("linkedforge_user_data", encodeURIComponent(JSON.stringify({ name: user.name || email.split("@")[0], email })), {
        httpOnly: false,
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
      });
      return response;
    }

    return NextResponse.json({ status: "ok" });
  } catch (error: any) {
    console.error("Auth POST route error:", error);
    return NextResponse.json({ error: error?.message || "Authentication error" }, { status: 500 });
  }
}
