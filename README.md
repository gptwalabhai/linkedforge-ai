# LinkedForge AI

> AI-powered LinkedIn Content Generator for Professionals.

A production-ready SaaS application that helps founders, agencies, marketers, executives, freelancers, and job seekers generate high-performing LinkedIn content in seconds.

## Features

- **AI Content Studio** — Generate 20+ content types (Posts, Carousels, Hooks, Threads, Polls, Stories, and more)
- **Multi-Provider AI** — OpenAI GPT-4o, Anthropic Claude, Google Gemini support
- **Brand Voice** — Train AI on your unique writing style
- **Content Organization** — Folders, tags, search, drafts, and version history
- **Content Calendar** — Schedule and organize posts with drag-and-drop
- **Analytics Dashboard** — Track engagement, impressions, and growth
- **Team Collaboration** — Invite members, assign roles, approval workflows
- **Stripe Subscriptions** — Free, Pro ($29/mo), Team ($79/mo) plans
- **Auth** — Email/password, Google OAuth, GitHub OAuth, 2FA, magic links
- **Admin Panel** — User management, feature flags, audit logs
- **Blog** — Built-in markdown blog with categories
- **Support Center** — FAQ, ticket system

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI | React 19 + Tailwind CSS v4 + Shadcn UI |
| Animations | Framer Motion |
| Auth | Better Auth |
| Database | PostgreSQL + Prisma ORM |
| Payments | Stripe |
| Email | Resend |
| AI | OpenAI, Anthropic, Google Gemini |
| State | Zustand + TanStack Query |
| Forms | React Hook Form + Zod |
| Deployment | Vercel / Docker |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16+
- npm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd linkedforge-ai

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env and add your API keys

# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `NEXTAUTH_URL` | Your app URL (e.g., `http://localhost:3000`) |
| `NEXTAUTH_SECRET` | Random 32+ character secret |
| `BETTER_AUTH_SECRET` | Random secret for Better Auth |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `GITHUB_CLIENT_ID` | GitHub OAuth client ID |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth client secret |
| `OPENAI_API_KEY` | OpenAI API key |
| `ANTHROPIC_API_KEY` | Anthropic API key |
| `GOOGLE_API_KEY` | Google Gemini API key |
| `AI_PROVIDER` | Default AI provider (`openai`, `anthropic`, `google`) |
| `STRIPE_SECRET_KEY` | Stripe secret key |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `STRIPE_PRO_PRICE_ID` | Stripe Price ID for Pro plan |
| `STRIPE_TEAM_PRICE_ID` | Stripe Price ID for Team plan |
| `STRIPE_ENTERPRISE_PRICE_ID` | Stripe Price ID for Enterprise plan |
| `RESEND_API_KEY` | Resend API key |
| `EMAIL_FROM` | Sender email address |

## Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:generate  # Generate Prisma client
npm run db:push      # Push schema to database
npm run db:migrate   # Run migrations
npm run db:studio    # Open Prisma Studio
```

## Docker

```bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f app
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── ai/             # AI generation endpoints
│   │   ├── posts/          # Post CRUD endpoints
│   │   ├── blog/           # Blog endpoints
│   │   ├── billing/        # Stripe endpoints
│   │   ├── support/        # Support ticket endpoints
│   │   └── settings/       # Settings endpoints
│   ├── dashboard/          # Dashboard page
│   ├── studio/             # AI Content Studio
│   ├── posts/              # Posts management
│   ├── calendar/           # Content calendar
│   ├── analytics/          # Analytics page
│   ├── settings/           # Settings page
│   ├── admin/              # Admin panel
│   ├── blog/               # Blog pages
│   ├── pricing/            # Pricing page
│   ├── support/            # Support page
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Reusable UI components
│   ├── layout/             # Layout components (navbar, sidebar)
│   └── dashboard/          # Dashboard components
└── lib/
    ├── auth.ts             # Better Auth configuration
    ├── auth-client.ts      # Client-side auth
    ├── db.ts               # Prisma client
    └── utils.ts            # Utility functions

prisma/
└── schema.prisma           # Database schema
```

## Database Schema

The application uses the following main entities:

- **User** — Authentication and profile
- **Workspace** — Team workspaces
- **Post** — Generated content with versions
- **Template** — Reusable content templates
- **Folder / Tag** — Content organization
- **Subscription** — Stripe subscriptions
- **Invoice** — Billing history
- **Notification** — In-app notifications
- **ApiKey** — API access tokens
- **AuditLog** — Activity tracking
- **BlogPost** — Blog content
- **SupportTicket** — Support requests

## Deployment

### Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Docker

```bash
docker build -t linkedforge-ai .
docker run -p 3000:3000 --env-file .env linkedforge-ai
```

## License

ISC
