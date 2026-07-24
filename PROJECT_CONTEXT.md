# 🚀 LinkedForge AI — Comprehensive Project Context & Architecture

This document serves as the **Single Source of Truth** for **LinkedForge AI**. Any AI coding assistant reading this file can instantly understand the complete system architecture, technology stack, database schema, API endpoints, key files, and deployment workflow without needing to scan the entire codebase.

---

## 📌 Project Overview
- **Name**: LinkedForge AI
- **Tagline**: AI-Powered LinkedIn Content Generator & Personal Branding SaaS
- **GitHub Repository**: [https://github.com/gptwalabhai/linkedforge-ai.git](https://github.com/gptwalabhai/linkedforge-ai.git)
- **Target Audience**: Founders, Executives, Marketers, Agencies, Freelancers, Job Seekers
- **Primary AI Model**: `DeepSeek-V4-Pro` (OpenAI-compatible endpoint)

---

## 🛠️ Technology Stack
1. **Frontend**: Next.js 16.2 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Radix UI.
2. **Backend**: Next.js Server Components & Route Handlers (`src/app/api/...`).
3. **Database & ORM**: PostgreSQL (hosted on [Neon.tech](https://neon.tech)) + Prisma ORM v5.22.
4. **Authentication**: Better Auth (`better-auth`) with custom fallback logic for zero-downtime onboarding.
5. **AI Engine**: DeepSeek-V4-Pro (`https://api.hcnsec.cn/v1`) with fallback content generation logic.
6. **Payments & Billing**: Stripe API (Subscriptions, Webhook processing).
7. **Styling**: Modern dark glassmorphic design system (`src/app/globals.css`).

---

## 🔐 Environment Variables (`.env`)

```env
# Live Neon PostgreSQL Database
DATABASE_URL="postgresql://neondb_owner:npg_3SuPqstJv0Er@ep-wandering-pond-ay2eb1at.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="linkedforge-ai-super-secret-key-32chars-min"
BETTER_AUTH_SECRET="linkedforge-ai-super-secret-key-32chars-min"

# AI Engine (DeepSeek V4 Pro)
DEEPSEEK_API_KEY="sk-2CTL9UGHUlt8ronqjaApSFIoAQ2fMLtkwaOoBjAea1kr3oxE"
DEEPSEEK_BASE_URL="https://api.hcnsec.cn/v1"
DEEPSEEK_MODEL="DeepSeek-V4-Pro"
AI_PROVIDER="deepseek"

# Stripe (Billing)
STRIPE_SECRET_KEY="sk_test_dummy_key_for_dev"
STRIPE_WEBHOOK_SECRET="whsec_dummy_key_for_dev"

# App Public URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 📂 Project Directory Structure

```text
p1/
├── prisma/
│   └── schema.prisma              # Database Models (User, Post, Subscription, Workspace, etc.)
├── public/                        # Static Assets & Icons
├── src/
│   ├── app/                       # Next.js App Router Pages & API Routes
│   │   ├── page.tsx               # Landing Page (Hero, Features, Pricing, Testimonials)
│   │   ├── login/page.tsx         # Sign In Page with resilient auth
│   │   ├── signup/page.tsx        # Sign Up Page with resilient auth
│   │   ├── dashboard/page.tsx     # User Dashboard (Analytics summary, Recent posts)
│   │   ├── studio/page.tsx        # AI Studio (Content Generation & AI Transformations)
│   │   ├── posts/page.tsx         # Post Management & Draft Editor
│   │   ├── calendar/page.tsx      # Content Scheduler & Calendar View
│   │   ├── analytics/page.tsx     # Impressions & Engagement Charts + AI Tips
│   │   ├── pricing/page.tsx       # Pricing Plans (Free, Pro, Team, Enterprise)
│   │   ├── settings/page.tsx      # Brand Voice, Writing Style, Profile & Security
│   │   ├── admin/page.tsx         # System Admin Panel (Users, Revenue, Feature Flags)
│   │   ├── blog/page.tsx          # SEO Blog Index & Post Viewer
│   │   ├── support/page.tsx       # Knowledge Base & Help Desk
│   │   └── api/
│   │       ├── ai/generate/       # Main AI Generation Route Handler (DeepSeek-V4-Pro)
│   │       ├── ai/action/         # AI Transformations (Rewrite, Expand, Humanize, etc.)
│   │       ├── auth/[...all]/     # Better Auth REST API Handler
│   │       ├── billing/checkout/  # Stripe Checkout Session Generator
│   │       ├── billing/webhook/   # Stripe Webhook Event Listener
│   │       ├── posts/             # Post CRUD Operations
│   │       └── settings/          # User Preference Save/Load API
│   ├── components/
│   │   ├── layout/                # AppShell, Navbar, SidebarNav, Footer, CommandMenu
│   │   ├── dashboard/             # Dashboard Widgets & Quick Actions
│   │   ├── analytics/             # Charts & Data Tables
│   │   ├── settings/              # Brand Voice Form & Security Settings
│   │   └── ui/                    # Reusable Shadcn UI Elements (Button, Card, Input, etc.)
│   └── lib/
│       ├── auth.ts                # Server-Side Better Auth Instance & getSession()
│       ├── auth-client.ts         # Client-Side Better Auth React SDK
│       ├── db.ts                  # Prisma Client Instance
│       └── utils.ts               # Utility Functions (cn, formatters)
├── Dockerfile                     # Production Container Config
├── docker-compose.yml             # Local Multi-Container Services
├── next.config.ts                 # Next.js Build Configuration
├── package.json                   # Dependencies & Scripts
├── tsconfig.json                  # TypeScript Compiler Settings
└── PROJECT_CONTEXT.md             # Single Source of Truth Context Document (THIS FILE)
```

---

## 🛢️ Database Schema (Prisma)

Key Models in `prisma/schema.prisma`:
- **`User`**: Core user entity (`id`, `email`, `name`, `password`, `brandVoice`, `writingStyle`, `industry`, `jobTitle`, `company`, `credits`, `role`).
- **`Session` & `Account`**: Authentication sessions & OAuth bindings for Better Auth.
- **`Post`**: Generated LinkedIn content (`id`, `type`, `title`, `content`, `status`, `likes`, `comments`, `impressions`, `scheduledFor`, `userId`).
- **`Workspace`**: Multi-tenant workspace management for teams and agencies.
- **`Subscription`**: Stripe billing record (`plan`, `status`, `stripeCustomerId`, `creditsMonthly`, `creditsUsed`).
- **`BlogPost`**: SEO marketing articles.
- **`SupportTicket`**: Help desk tickets.

---

## 🧠 AI Generation Architecture

All AI calls use `src/app/api/ai/generate/route.ts` & `src/app/api/ai/action/route.ts`:
1. **Primary Provider**: Calls `https://api.hcnsec.cn/v1` with model `DeepSeek-V4-Pro`.
2. **Supported Transformations**:
   - **Rewrite**: Viral formatting, high-engagement hook restructuring.
   - **Expand**: Strategic deep-dive & actionable bullet points.
   - **Shorten**: Condenses long posts into punchy 2-4 paragraph snippets.
   - **Humanize**: Removes corporate jargon and robotic tone.
   - **Grammar & Fact Check**: Fixes punctuation and checks claims.
   - **Repurpose**: Converts Blogs, Tweets, and YouTube transcripts into LinkedIn posts.
3. **Resilient Fallback**: If the external API endpoint is temporarily non-responsive, the system automatically uses a structured fallback generator so users **never** experience errors.

---

## 🚀 Common Commands

```bash
# Development Server
npx next dev --webpack

# Production Build Verification
npm run build

# Push Database Schema Changes to Neon PostgreSQL
npx prisma db push

# Git Sync to GitHub
git add .
git commit -m "Your commit message"
git push origin main
```

---

## 🌐 Public Deployment Details
- **Hosting Platform**: Vercel (Auto-deploys from GitHub `main` branch).
- **Live GitHub URL**: `https://github.com/gptwalabhai/linkedforge-ai.git`
