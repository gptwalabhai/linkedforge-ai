# 🚀 LinkedForge AI — Comprehensive Project Context & Architecture

This document serves as the **Single Source of Truth** for **LinkedForge AI**. Any AI coding assistant reading this file can instantly understand the complete system architecture, technology stack, database schema, API endpoints, key files, and deployment workflow without needing to scan the entire codebase.

---

## 📌 Project Overview
- **Name**: LinkedForge AI
- **Tagline**: Enterprise-Grade AI-Powered LinkedIn Content Generator & Personal Branding SaaS
- **GitHub Repository**: [https://github.com/gptwalabhai/linkedforge-ai.git](https://github.com/gptwalabhai/linkedforge-ai.git)
- **Target Audience**: Founders, Executives, Marketers, Agencies, Freelancers, Job Seekers
- **Primary AI Model**: `DeepSeek-V4-Pro` (OpenAI-compatible endpoint)

---

## 🛠️ Technology Stack
1. **Frontend**: Next.js 16.2 (App Router), React 19, TypeScript, Tailwind CSS, Lucide Icons, Radix UI.
2. **Backend**: Next.js Server Components & Route Handlers (`src/app/api/...`).
3. **Database & ORM**: PostgreSQL (hosted on [Neon.tech](https://neon.tech)) + Prisma ORM v5.22.
4. **Authentication**: Better Auth (`better-auth`) with custom fallback logic for zero-downtime onboarding.
5. **AI Engine**: DeepSeek-V4-Pro (`https://api.hcnsec.cn/v1`) with **Master Prompt System** (20-year veteran LinkedIn strategist persona).
6. **Payments & Billing**: Stripe API (Subscriptions, Webhook processing).
7. **Styling**: Modern dark glassmorphic design system (`src/app/globals.css`).

---

## 🧠 Master Prompt System (Enterprise AI Engine)

The AI generation uses a **dual-prompt architecture**:
1. **MASTER_SYSTEM_PROMPT** (system role): Establishes the AI as a 20-year veteran LinkedIn ghostwriter with deep understanding of:
   - LinkedIn algorithm signals (dwell time, comments, saves, shares)
   - Hook psychology (pattern interrupts, curiosity gaps, contrarian hooks)
   - Formatting rules (mobile readability, short paragraphs, whitespace)
   - Content frameworks (AIDA, PAS, BAB, StoryBrand)
   - Anti-patterns to avoid (corporate jargon, clickbait, generic advice)
   - CTA psychology (engagement-driven, conversion-optimized)
   - Hashtag strategy (3-5 targeted, niche + broad mix)
   - Personal branding principles

2. **User Prompt** (user role): Contains the specific topic, tone, framework, audience, brand voice, and other configuration from the user's form input.

The same pattern applies to the AI action/transformation endpoint (`MASTER_ACTION_SYSTEM_PROMPT`).

---

## 🔐 Environment Variables Reference (`.env`)

> ⚠️ Keep actual secret keys in your private `.env` file (which is git-ignored and never committed).

```env
# Live Neon PostgreSQL Database
DATABASE_URL="postgresql://neondb_owner:YOUR_DATABASE_PASSWORD@ep-wandering-pond-ay2eb1at.c-5.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Auth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-at-least-32-chars-long"
BETTER_AUTH_SECRET="your-better-auth-secret-key-min-32-chars"

# AI Engine (DeepSeek V4 Pro)
DEEPSEEK_API_KEY="sk-your-deepseek-key-here"
DEEPSEEK_BASE_URL="https://api.hcnsec.cn/v1"
DEEPSEEK_MODEL="DeepSeek-V4-Pro"
AI_PROVIDER="deepseek"

# Stripe (Billing)
STRIPE_SECRET_KEY="sk_test_your_stripe_key"
STRIPE_WEBHOOK_SECRET="whsec_your_stripe_webhook_secret"

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
│   │   ├── page.tsx               # Landing Page (Hero, Features, Pricing, Testimonials, FAQ)
│   │   ├── login/page.tsx         # Sign In Page with resilient auth
│   │   ├── signup/page.tsx        # Sign Up Page with resilient auth
│   │   ├── dashboard/page.tsx     # User Dashboard (Analytics summary, Recent posts, Credits)
│   │   ├── studio/page.tsx        # AI Studio (Content Generation & AI Transformations)
│   │   ├── posts/page.tsx         # Post Management & Draft Editor
│   │   ├── calendar/page.tsx      # Content Scheduler & Calendar View
│   │   ├── analytics/page.tsx     # Impressions & Engagement Charts + AI Tips
│   │   ├── pricing/page.tsx       # Pricing Plans (Free, Pro, Team, Enterprise)
│   │   ├── settings/page.tsx      # Brand Voice, Writing Style, Profile & Security
│   │   ├── admin/page.tsx         # Enterprise Admin Panel (Users, Credits, Security, System Health)
│   │   ├── blog/page.tsx          # SEO Blog Index & Post Viewer
│   │   ├── support/page.tsx       # Knowledge Base & Help Desk
│   │   └── api/
│   │       ├── ai/generate/       # Main AI Generation Route Handler (Master Prompt + Credit Enforcement)
│   │       ├── ai/action/         # AI Transformations (Rewrite, Expand, Humanize, etc.)
│   │       ├── admin/credits/     # Admin Credit Management API (Grant/Revoke/Set)
│   │       ├── admin/users/       # Admin User Management API (CRUD, Search, Pagination)
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
│   │   └── ui/                    # Reusable UI Elements (Button, Card, Input, ErrorBoundary, etc.)
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

## 🛡️ Enterprise Features

### Admin Panel (`/admin`)
The admin panel provides full platform control with **5 tabs**:
1. **Overview**: Stats dashboard (users, posts, revenue, credits), feature flags
2. **Users**: Full user management table with search, role changes, credit editing, suspend/ban/delete
3. **Credits**: Bulk credit operations, per-plan limit configuration
4. **Security**: IP whitelist, rate limiting, security alerts
5. **System**: API health monitoring, database status, AI provider status, uptime

### Credit System
- Server-side credit enforcement in `/api/ai/generate/`
- Credits deducted after successful generation
- Admin bypass for unlimited generation
- Real-time credit display in AI Studio
- Admin can grant/revoke/set credits via `/api/admin/credits/`

### Rate Limiting
- In-memory rate limiter: 30 requests/minute per user
- Returns HTTP 429 with clear error message when exceeded

### Security
- Audit logging for all admin actions
- Role-based access control (USER, PRO, ADMIN, BANNED)
- Admin-only API endpoints with session verification
- Error boundary component for production stability

---

## 🛢️ Database Schema (Prisma)

Key Models in `prisma/schema.prisma`:
- **`User`**: Core user entity (`id`, `email`, `name`, `password`, `brandVoice`, `writingStyle`, `industry`, `jobTitle`, `company`, `credits`, `role`).
- **`Session` & `Account`**: Authentication sessions & OAuth bindings for Better Auth.
- **`Post`**: Generated LinkedIn content (`id`, `type`, `title`, `content`, `status`, `likes`, `comments`, `impressions`, `scheduledFor`, `userId`).
- **`Workspace`**: Multi-tenant workspace management for teams and agencies.
- **`Subscription`**: Stripe billing record (`plan`, `status`, `stripeCustomerId`, `creditsMonthly`, `creditsUsed`).
- **`AuditLog`**: Admin action audit trail (`action`, `entity`, `entityId`, `metadata`, `ipAddress`).
- **`ApiKey`**: User API key management.
- **`BlogPost`**: SEO marketing articles.
- **`SupportTicket`**: Help desk tickets.

---

## 🧠 AI Generation Architecture

All AI calls use `src/app/api/ai/generate/route.ts` & `src/app/api/ai/action/route.ts`:
1. **Primary Provider**: Calls `https://api.hcnsec.cn/v1` with model `DeepSeek-V4-Pro`.
2. **Dual-Prompt System**: System message (MASTER_SYSTEM_PROMPT) + User message (topic/config).
3. **Supported Transformations**:
   - **Rewrite**: Viral formatting, high-engagement hook restructuring.
   - **Expand**: Strategic deep-dive & actionable bullet points.
   - **Shorten**: Condenses long posts into punchy 2-4 paragraph snippets.
   - **Humanize**: Removes corporate jargon and robotic tone.
   - **Grammar & Fact Check**: Fixes punctuation and checks claims.
   - **Repurpose**: Converts Blogs, Tweets, and YouTube transcripts into LinkedIn posts.
4. **Credit Enforcement**: Server-side credit check before generation, deduction after success.
5. **Rate Limiting**: 30 req/min per authenticated user.
6. **Resilient Fallback**: If the external API endpoint is temporarily non-responsive, the system automatically uses a structured fallback generator so users **never** experience errors.

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
