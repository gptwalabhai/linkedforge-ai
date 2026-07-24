import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles, Zap, Shield, BarChart3, Users, Layers, MessageSquare, Lock, Globe, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const features = [
  { icon: Sparkles, title: "AI-Powered Writing", desc: "Enterprise-grade AI content generation powered by DeepSeek V4 Pro. 20+ years of LinkedIn strategy distilled into every post." },
  { icon: Zap, title: "20+ Content Types", desc: "Posts, carousels, hooks, threads, polls, stories, thought leadership, case studies, and more — all optimized for maximum reach." },
  { icon: Shield, title: "Brand Voice DNA", desc: "Train AI on your unique voice, industry jargon, and writing style so every post is authentically you. No generic AI output." },
  { icon: BarChart3, title: "Deep Analytics", desc: "Track engagement, impressions, CTR, and growth with enterprise dashboards. AI-powered tips to improve performance." },
  { icon: Users, title: "Team Collaboration", desc: "Multi-member workspaces with role-based access, approval workflows, and shared content libraries for agencies and teams." },
  { icon: Layers, title: "Smart Scheduling", desc: "AI-optimized scheduling that posts at peak engagement times. Drag-and-drop content calendar with time zone support." },
  { icon: Lock, title: "Enterprise Security", desc: "Rate limiting, IP whitelisting, audit logging, and admin access controls built in. Your data stays protected." },
  { icon: Globe, title: "Multi-Language", desc: "Generate and translate content in 15+ languages while maintaining your brand voice and LinkedIn optimization." },
  { icon: Award, title: "Content Frameworks", desc: "Built-in AIDA, PAS, BAB, and StoryBrand frameworks. Every post uses proven psychological persuasion techniques." },
];

const testimonials = [
  { name: "Sarah Chen", role: "Founder @ TechFlow", text: "LinkedForge transformed our LinkedIn presence. We went from 0 to 50K followers in 3 months. The AI actually understands SaaS language.", avatar: "SC" },
  { name: "Marcus Johnson", role: "CEO @ GrowthLabs", text: "The AI actually understands our brand voice. It's like having a senior copywriter on demand. Our engagement rate tripled.", avatar: "MJ" },
  { name: "Elena Rodriguez", role: "VP Marketing @ Scale.io", text: "We save 15+ hours per week on content creation. The carousel generator alone ROI'd our subscription in the first week.", avatar: "ER" },
  { name: "David Kim", role: "Agency Owner @ ContentFirst", text: "Managing content for 12 clients was chaos. LinkedForge's team workspaces and brand voice training changed everything.", avatar: "DK" },
];

const pricingTiers = [
  {
    name: "Free",
    price: 0,
    desc: "Perfect for getting started",
    features: ["10 AI credits/month", "5 content types", "Basic analytics", "1 workspace", "Community support"],
    cta: "Start Free",
    popular: false,
  },
  {
    name: "Pro",
    price: 29,
    desc: "For serious professionals",
    features: ["200 AI credits/month", "All 20+ content types", "Advanced analytics", "Brand voice training", "Content calendar", "Priority support", "AI transformations"],
    cta: "Start Pro Trial",
    popular: true,
  },
  {
    name: "Team",
    price: 79,
    desc: "For growing teams & agencies",
    features: ["1,000 AI credits/month", "Everything in Pro", "5 team members", "Approval workflows", "Shared templates", "SSO support", "API access"],
    cta: "Start Team Trial",
    popular: false,
  },
  {
    name: "Enterprise",
    price: 199,
    desc: "For organizations at scale",
    features: ["Unlimited AI credits", "Everything in Team", "Unlimited team members", "Dedicated account manager", "Custom AI training", "SLA guarantee", "Priority API access"],
    cta: "Contact Sales",
    popular: false,
  },
];

const faqs = [
  { q: "How does the AI know my brand voice?", a: "You can train the AI by providing writing samples, your website content, or describing your tone and style. The AI learns your unique voice and applies it consistently across all generated content." },
  { q: "What AI model powers LinkedForge?", a: "We use DeepSeek V4 Pro with a custom-trained master prompt system that incorporates 20+ years of LinkedIn content strategy, algorithm optimization, and engagement psychology." },
  { q: "What happens if I run out of credits?", a: "You can purchase additional credits at any time, or upgrade to a higher plan. Unused credits roll over for Pro and Team plans. Enterprise plans include unlimited credits." },
  { q: "Is there a free trial?", a: "Yes! The Free plan gives you 10 credits to try the platform. Pro and Team plans come with a 14-day free trial with full feature access." },
  { q: "Can my team collaborate?", a: "Absolutely. Team plans include multi-member workspaces, role-based permissions, approval workflows, and shared templates." },
  { q: "Is my data secure?", a: "Yes. We use enterprise-grade encryption, rate limiting, IP whitelisting, and comprehensive audit logging. Your content and API keys are never shared with third parties." },
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        <div className="absolute inset-0 dot-map opacity-30" />
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-8 animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            <span>Trusted by 10,000+ professionals worldwide</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            Enterprise-Grade
            <br />
            <span className="gradient-text">LinkedIn AI Engine</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            Generate viral, high-converting LinkedIn content in seconds. Powered by a 20-year veteran strategist AI with built-in hook psychology, content frameworks, and algorithm optimization.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <Link href="/signup">
              <Button variant="gradient" size="xl" className="group">
                Start Free — No Credit Card
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button variant="outline" size="xl">
                See How It Works
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 flex flex-wrap gap-6 justify-center text-sm text-muted-foreground animate-fade-in-up" style={{ animationDelay: "0.35s" }}>
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-success" />
              <span>Enterprise Security</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-warning" />
              <span>DeepSeek V4 Pro</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-info" />
              <span>API Keys Never Exposed</span>
            </div>
          </div>

          {/* Demo Preview */}
          <div className="mt-16 relative max-w-4xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <div className="gradient-border p-1">
              <div className="rounded-lg overflow-hidden bg-card border border-border">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-card">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                  <div className="ml-4 text-xs text-muted-foreground font-mono">linkedforge.ai/studio</div>
                </div>
                <div className="p-6 md:p-10 bg-gradient-to-br from-background via-background to-primary/5 min-h-[300px] flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20 animate-float">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <p className="text-lg font-semibold mb-1">AI Content Studio</p>
                    <p className="text-sm text-muted-foreground">20+ content types • AIDA/PAS/BAB frameworks • Real-time generation</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Logos */}
      <section className="py-12 border-y border-border/50 bg-card/30">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-sm text-muted-foreground mb-8">TRUSTED BY TEAMS AT</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50">
            {["Google", "Microsoft", "Stripe", "Notion", "Vercel", "Figma"].map((brand) => (
              <div key={brand} className="text-xl font-bold text-muted-foreground">{brand}</div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything you need to <span className="gradient-text">dominate LinkedIn</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Enterprise-grade features that turn content creation from a chore into your competitive advantage.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group p-6 rounded-lg bg-card border border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/5">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
                <p className="text-muted-foreground text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 bg-card/30 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How it works</h2>
            <p className="text-muted-foreground">Three simple steps to LinkedIn greatness</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Connect & Configure", desc: "Set up your brand voice, industry, writing style, and target audience. The AI learns your DNA." },
              { step: "02", title: "Generate Content", desc: "Choose a content type, enter your topic, and let AI craft compelling posts using proven frameworks like AIDA, PAS, and BAB." },
              { step: "03", title: "Publish & Grow", desc: "Review, transform, and publish directly to LinkedIn. Track performance and iterate with AI-powered insights." },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-bold text-primary/20 mb-4">{item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Loved by professionals</h2>
            <p className="text-muted-foreground">See what our users are saying</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="p-6 rounded-lg bg-card border border-border hover:border-primary/20 transition-colors">
                <div className="flex gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <svg key={s} className="w-4 h-4 text-yellow-500 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                </div>
                <p className="text-sm mb-4">&quot;{t.text}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">{t.avatar}</div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-card/30 border-y border-border">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, transparent pricing</h2>
            <p className="text-muted-foreground">Start free. Upgrade when you&apos;re ready. No hidden fees.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {pricingTiers.map((tier, i) => (
              <div key={i} className={`relative p-6 rounded-lg border ${tier.popular ? "border-primary bg-primary/5 glow-border" : "bg-card border-border"}`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full text-xs font-medium text-white">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold">{tier.name}</h3>
                <div className="mt-2 mb-1">
                  <span className="text-4xl font-bold">${tier.price}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">{tier.desc}</p>
                <ul className="space-y-3 mb-6">
                  {tier.features.map((feat, fi) => (
                    <li key={fi} className="flex items-center gap-2 text-sm">
                      <svg className="w-4 h-4 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M20 6L9 17l-5-5" /></svg>
                      {feat}
                    </li>
                  ))}
                </ul>
                <Link href={`/signup?plan=${tier.name.toLowerCase()}`} className="block">
                  <Button variant={tier.popular ? "gradient" : "outline"} className="w-full">
                    {tier.cta}
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently asked questions</h2>
          </div>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <details key={i} className="group rounded-lg border border-border bg-card open:bg-card/80 transition-all">
                <summary className="flex items-center justify-between p-4 cursor-pointer list-none">
                  <span className="font-medium">{faq.q}</span>
                  <svg className="w-5 h-5 text-muted-foreground group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M6 9l6 6 6-6" /></svg>
                </summary>
                <div className="px-4 pb-4 text-muted-foreground text-sm">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative p-12 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 opacity-90" />
            <div className="absolute inset-0 dot-map opacity-20" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to transform your LinkedIn presence?</h2>
              <p className="text-white/70 mb-8 max-w-xl mx-auto">Join thousands of professionals who are growing their audience and authority with AI-powered content. Start free, no credit card required.</p>
              <Link href="/signup">
                <Button size="xl" className="bg-white text-primary hover:bg-white/90">
                  Start Free Trial <ArrowRight className="w-4 h-4" />
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
