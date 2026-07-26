import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, Flame, Zap, Shield, BarChart3, Users, Layers, MessageSquare, 
  Lock, Globe, Award, CheckCircle2, XCircle, Sparkles, TrendingUp, Cpu, 
  ChevronRight, ArrowUpRight, ShieldCheck, Terminal, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { PorscheHero3D } from "@/components/landing/porsche-hero-3d";

const painPoints = [
  {
    before: "Generic AI tools write robotic fluff like 'In today's fast-paced world...'",
    after: "LinkedForge uses 20-year executive ghostwriting frameworks (AIDA/PAS/BAB) that sound 100% human.",
  },
  {
    before: "Spending 15+ hours a week staring at a blank screen trying to write hooks",
    after: "Generate high-converting posts, carousels, and hooks in under 30 seconds with 1-click execution.",
  },
  {
    before: "LinkedIn algorithm penalizing low-dwell time and unformatted text walls",
    after: "Built-in mobile readability math, line spacing, and pattern-interrupt hooks for maximum dwell time.",
  },
  {
    before: "Zero leads or inbound meetings despite consistent posting",
    after: "Conversion-engineered CTAs that turn casual impressions into high-ticket inbound pipeline.",
  },
];

const features = [
  { icon: Flame, title: "20-Year Strategist Engine", desc: "Engineered around DeepSeek V4 Pro with a custom master prompt system that eliminates robotic AI phrases and corporate jargon." },
  { icon: Zap, title: "20+ Executive Formats", desc: "Thought leadership posts, carousels, contrarian hooks, founder updates, teardowns, and case studies at your fingertips." },
  { icon: Shield, title: "Brand Voice DNA", desc: "Train the AI on your exact tone, writing style, and industry expertise. Every post sounds authentically you." },
  { icon: BarChart3, title: "Impression & Engagement Analytics", desc: "Track performance trends, dwell time indicators, and conversion metrics with enterprise analytics dashboards." },
  { icon: Users, title: "Multi-Member Workspaces", desc: "Built for agencies and marketing teams with client workspaces, approval workflows, and role-based permissions." },
  { icon: Layers, title: "Drag-and-Drop Calendar", desc: "Schedule posts across global timezones with AI-suggested peak posting windows for maximum reach." },
  { icon: Lock, title: "Enterprise Access Controls", desc: "Rate limiting, IP whitelisting, SOC-level security audit logs, and granular credit management." },
  { icon: Globe, title: "Multi-Language Expansion", desc: "Generate and translate high-impact posts across 15+ global languages while preserving your brand voice." },
  { icon: Award, title: "Conversion CTA Psychology", desc: "Frictionless calls-to-action designed to generate meaningful comment loops and direct message inquiries." },
];

const testimonials = [
  { 
    name: "Alexander Vance", 
    role: "Founder & CEO @ CloudPulse", 
    metric: "+340% Inbound Pipeline",
    text: "Before LinkedForge, our executive team wasted hours on posts that got 12 likes. Last month, our LinkedIn content generated $85k in qualified pipeline without a single paid ad.",
    avatar: "AV" 
  },
  { 
    name: "Samantha Wright", 
    role: "VP Marketing @ Enterprise Scale", 
    metric: "Saved 18 hrs/week",
    text: "Most AI writing tools sound like a college textbook. LinkedForge is the first platform that actually understands executive tone. The carousel generator alone paid for itself 10x over.",
    avatar: "SW" 
  },
  { 
    name: "Marcus Thorne", 
    role: "Managing Partner @ Growth Capital", 
    metric: "52K New Followers",
    text: "The hook psychology is scary good. We transformed raw bullet points from internal meetings into viral authority posts in literally 2 minutes.",
    avatar: "MT" 
  },
];

const pricingTiers = [
  {
    name: "Free Trial",
    price: 0,
    period: "/month",
    desc: "For leaders testing the engine",
    features: [
      "10 AI Credits included",
      "5 Core Content Types",
      "Standard DeepSeek V4 Pro",
      "1 Brand Voice Profile",
      "Basic Performance Analytics",
    ],
    cta: "Start Free Now",
    popular: false,
  },
  {
    name: "Pro Strategist",
    price: 29,
    period: "/month",
    desc: "For founders, executives & creators",
    features: [
      "200 AI Credits / Month",
      "All 20+ Executive Content Formats",
      "Full Brand Voice DNA Training",
      "AI Post Transformations (Humanize/Expand)",
      "Smart Content Calendar & Scheduler",
      "Priority API Access",
    ],
    cta: "Get Pro Access",
    popular: true,
  },
  {
    name: "Team Agency",
    price: 79,
    period: "/month",
    desc: "For agencies & marketing teams",
    features: [
      "1,000 AI Credits / Month",
      "Everything in Pro",
      "5 Team Member Seats",
      "Client Workspace Management",
      "Approval Workflows & Shared Templates",
      "Dedicated Support Manager",
    ],
    cta: "Start Team Trial",
    popular: false,
  },
  {
    name: "Enterprise",
    price: 199,
    period: "/month",
    desc: "For high-scale organizations",
    features: [
      "Unlimited AI Credits",
      "Everything in Team",
      "Unlimited Seats & Workspaces",
      "Custom Fine-Tuned Model Persona",
      "IP Whitelisting & Audit Logs",
      "99.9% Uptime SLA Guarantee",
    ],
    cta: "Contact Enterprise",
    popular: false,
  },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#050508] text-white selection:bg-red-600 selection:text-white">
      <Navbar />

      {/* Hero Section with 3D Perspective Visuals */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Grids and Crimson Glow Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
        <div className="absolute inset-0 dot-map opacity-40 pointer-events-none" />
        <div className="absolute inset-0 grid-map opacity-20 pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Urgency Badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-red-950/60 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-wider mb-8 shadow-lg shadow-red-950/50">
            <Flame className="w-4 h-4 text-red-500 animate-pulse" />
            <span>Built for Founders, Executives & Elite Content Teams</span>
          </div>

          {/* Copywriter Pain Point Title */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
            Stop Wasting 20 Hours a Week on <br />
            <span className="gradient-text">LinkedIn Posts That Get Zero Reach.</span>
          </h1>

          {/* Solution Paragraph */}
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            Most AI tools produce generic, robotic text walls that destroy your brand authority. 
            <strong className="text-white"> LinkedForge AI</strong> uses a 20-year executive ghostwriting engine to turn raw ideas into viral, high-converting LinkedIn content in under 30 seconds.
          </p>

          {/* CTAs & Social Auth */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto mb-12">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button variant="gradient" size="xl" className="w-full sm:w-auto group text-lg px-8">
                Generate Your First Post Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          {/* Social Sign-In Buttons on Hero */}
          <div className="flex flex-wrap justify-center items-center gap-4 max-w-lg mx-auto p-4 rounded-2xl glass border border-red-900/30 mb-16">
            <span className="text-xs font-medium text-slate-400 uppercase tracking-wider w-full mb-1">Instant 1-Click Social Access:</span>
            <Link href="/signup" className="flex-1 min-w-[140px]">
              <Button variant="outline" size="sm" className="w-full border-red-900/40 bg-card hover:bg-red-950/40 text-white gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.2 1.6l3.1-3.1C17.4 1.7 15 1 12 1 7.7 1 4 3.5 2.2 7.1l3.7 2.8C6.8 7.3 9.2 5 12 5z"/>
                  <path fill="#4285F4" d="M22.6 12.3c0-.8-.1-1.5-.2-2.3H12v4.3h5.9c-.3 1.4-1 2.5-2.2 3.3l3.6 2.8c2.1-1.9 3.3-4.7 3.3-8.1z"/>
                  <path fill="#FBBC05" d="M5.8 14.1c-.2-.7-.3-1.4-.3-2.1s.1-1.4.3-2.1L2.2 7.1C1.4 8.6 1 10.2 1 12s.4 3.4 1.2 4.9l3.6-2.8z"/>
                  <path fill="#34A853" d="M12 23c3 0 5.5-1 7.3-2.7l-3.6-2.8c-1 .7-2.2 1.1-3.7 1.1-2.8 0-5.2-1.9-6.1-4.5L2.2 16.9C4 20.5 7.7 23 12 23z"/>
                </svg>
                Google Sign In
              </Button>
            </Link>
            <Link href="/signup" className="flex-1 min-w-[140px]">
              <Button variant="outline" size="sm" className="w-full border-red-900/40 bg-card hover:bg-red-950/40 text-white gap-2">
                <svg className="w-4 h-4 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/>
                </svg>
                GitHub Sign In
              </Button>
            </Link>
          </div>

          {/* 3D Porsche Supercar Visualizer & Scroll Physics */}
          <PorscheHero3D />

          {/* 3D Perspective Card Mockup Showcase */}
          <div className="relative max-w-5xl mx-auto perspective-1000 mt-12">
            <div className="transform-3d animate-float-3d transition-all duration-700 hover:rotate-x-0">
              <div className="gradient-border p-1 shadow-2xl shadow-red-950/80">
                <div className="rounded-2xl overflow-hidden bg-[#0c0c14] border border-red-900/30">
                  {/* Browser Header Bar */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-red-900/20 bg-[#08080f]">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      <span className="ml-4 text-xs font-mono text-slate-400">linkedforge.ai/studio</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-red-950 border border-red-500/40 text-red-400 font-mono flex items-center gap-1.5">
                        <Cpu className="w-3 h-3 text-red-500" /> DeepSeek V4 Pro Engine Active
                      </span>
                    </div>
                  </div>

                  {/* 3D Dashboard Content Simulation */}
                  <div className="p-6 md:p-10 bg-gradient-to-b from-[#0e0e18] via-[#090912] to-[#050508] text-left">
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Left: Input */}
                      <div className="p-4 rounded-xl bg-[#12121e] border border-red-900/20 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">AI Strategist Input</span>
                          <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded">AIDA Framework</span>
                        </div>
                        <div className="text-sm font-medium text-slate-200">Topic: Why 90% of B2B SaaS Founders fail at LinkedIn lead gen</div>
                        <div className="text-xs text-slate-400 bg-[#090910] p-2.5 rounded border border-white/5 font-mono">
                          Tone: Executive & Vulnerable<br />
                          Format: Scroll-Stopping Hook Post
                        </div>
                        <div className="text-xs text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> 100% Zero Jargon Guarantee Enabled
                        </div>
                      </div>

                      {/* Middle & Right: Generated Output */}
                      <div className="md:col-span-2 p-5 rounded-xl bg-[#12121e] border border-red-900/40 space-y-3 shadow-xl">
                        <div className="flex items-center justify-between pb-2 border-b border-white/10">
                          <span className="text-xs font-bold text-white flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-red-500" /> Generated LinkedIn Post (Ready to Upload)
                          </span>
                          <span className="text-xs text-slate-400 font-mono">Word Count: 184 • Dwell Score: 98%</span>
                        </div>
                        <div className="space-y-2 text-sm text-slate-200 font-sans leading-relaxed">
                          <p className="font-semibold text-white">Stop telling your audience what your product does.</p>
                          <p>In 2024, we burned $40,000 on LinkedIn ads. Results? 3 sales calls.</p>
                          <p>Then we changed ONE strategic variable:</p>
                          <p className="text-red-400 font-medium pl-3 border-l-2 border-red-500">We stopped pitching features and started sharing hard-learned operational mistakes.</p>
                          <p>Here are the 3 content shifts that generated $140,000 in inbound revenue without spending a single dollar on ads:</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Copywriter Pain vs Solution Section */}
      <section className="py-24 px-6 border-y border-red-900/20 bg-gradient-to-b from-[#08080f] to-[#050508]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3 block">Why Traditional Methods Fail</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
              The Hard Reality of <span className="gradient-text">LinkedIn Growth in 2026</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {painPoints.map((item, idx) => (
              <div key={idx} className="p-6 rounded-2xl stitch-card border border-red-900/30 rounded-3xl hover:border-red-500/40 transition-all duration-300 space-y-4">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-red-950/30 border border-red-500/20 text-red-300 text-sm">
                  <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-red-400 block mb-1">Old Frustrating Way:</span>
                    {item.before}
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-slate-200 text-sm">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-emerald-400 block mb-1">The LinkedForge System:</span>
                    {item.after}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Grid Features */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3 block">Enterprise Capabilities</span>
            <h2 className="text-3xl md:text-5xl font-extrabold">
              Engineered for <span className="gradient-text">Authority & Conversion</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group p-6 rounded-2xl stitch-card border border-red-900/30 rounded-3xl hover:border-red-500/50 hover:bg-[#12121c] transition-all duration-300 hover:-translate-y-1.5 shadow-lg hover:shadow-red-950/50">
                <div className="w-12 h-12 rounded-xl bg-red-950/80 border border-red-500/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                  <f.icon className="w-6 h-6 text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* High-Impact Proof & Testimonials */}
      <section className="py-24 px-6 border-y border-red-900/20 bg-[#08080e]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3 block">Real Results From Real Leaders</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
              Trusted by 10,000+ Founders & Executives
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-2xl bg-[#0c0c14] border border-red-900/30 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="inline-block px-3 py-1 rounded-full bg-red-950 text-red-400 border border-red-500/30 text-xs font-bold font-mono">
                    {t.metric}
                  </div>
                  <p className="text-slate-300 text-sm leading-relaxed">&quot;{t.text}&quot;</p>
                </div>
                <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center font-bold text-xs text-white">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{t.name}</div>
                    <div className="text-xs text-slate-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3 block">Transparent Investment</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
              Simple Pricing. <span className="gradient-text">Massive ROI.</span>
            </h2>
            <p className="text-slate-400">Cancel anytime. Start free without entering a credit card.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, i) => (
              <div key={i} className={`relative p-6 rounded-2xl flex flex-col justify-between ${tier.popular ? "bg-[#140c12] border-2 border-red-500 shadow-2xl shadow-red-950/80 glow-border" : "bg-[#0c0c14] border border-red-900/30"}`}>
                {tier.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-red-600 to-rose-600 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-md">
                    Most Popular
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-white">{tier.name}</h3>
                  <div className="mt-3 mb-2 flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-white">${tier.price}</span>
                    <span className="text-slate-400 text-sm">{tier.period}</span>
                  </div>
                  <p className="text-xs text-slate-400 mb-6">{tier.desc}</p>
                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feat, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href="/signup">
                  <Button variant={tier.popular ? "gradient" : "outline"} className="w-full">
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative rounded-3xl p-12 md:p-16 border border-red-500/40 bg-gradient-to-r from-red-950 via-[#12080e] to-black text-center shadow-2xl shadow-red-950">
          <div className="relative z-10 space-y-6">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white">
              Ready to Turn Your LinkedIn Profile into a <span className="gradient-text">Revenue Engine?</span>
            </h2>
            <p className="text-slate-300 max-w-2xl mx-auto text-base">
              Join 10,000+ executives generating high-leverage content every single day. Start free in under 60 seconds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button variant="gradient" size="xl" className="px-8 text-base">
                  Start Free Trial Now <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
