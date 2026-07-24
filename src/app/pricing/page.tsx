"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

const plans = [
  {
    name: "Free",
    price: 0,
    desc: "Perfect for getting started",
    features: ["10 AI credits/month", "5 content types", "Basic analytics", "1 workspace", "Email support"],
    cta: "Start Free",
    popular: false,
    planKey: "FREE",
  },
  {
    name: "Pro",
    price: 29,
    desc: "For serious professionals",
    features: ["200 AI credits/month", "All 20+ content types", "Advanced analytics", "Brand voice training", "Content calendar", "Priority support", "API access"],
    cta: "Start Pro Trial",
    popular: true,
    planKey: "PRO",
  },
  {
    name: "Team",
    price: 79,
    desc: "For growing teams",
    features: ["1,000 AI credits/month", "Everything in Pro", "5 team members", "Approval workflows", "Shared templates", "SSO support", "Dedicated support"],
    cta: "Start Team Trial",
    popular: false,
    planKey: "TEAM",
  },
];

const comparison = [
  { feature: "AI Credits", free: "10/mo", pro: "200/mo", team: "1,000/mo" },
  { feature: "Content Types", free: "5", pro: "20+", team: "20+" },
  { feature: "Analytics", free: "Basic", pro: "Advanced", team: "Advanced" },
  { feature: "Brand Voice", free: false, pro: true, team: true },
  { feature: "Content Calendar", free: false, pro: true, team: true },
  { feature: "Team Members", free: "1", pro: "1", team: "5+" },
  { feature: "Approval Workflows", free: false, pro: false, team: true },
  { feature: "API Access", free: false, pro: true, team: true },
  { feature: "SSO", free: false, pro: false, team: true },
  { feature: "Support", free: "Email", pro: "Priority", team: "Dedicated" },
];

const billingPeriods = [
  { label: "Monthly", value: "monthly", discount: 0 },
  { label: "Yearly", value: "yearly", discount: 20 },
];

export default function PricingPage() {
  const [period, setPeriod] = useState("monthly");
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const checkout = async (planKey: string) => {
    if (planKey === "FREE") {
      router.push("/signup");
      return;
    }
    setLoading(planKey);
    try {
      const res = await fetch("/api/billing/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, period }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        toast.error(data.error || "Failed to create checkout session");
      }
    } catch {
      toast.error("Failed to start checkout");
    } finally {
      setLoading(null);
    }
  };

  const getPrice = (base: number) => {
    if (period === "yearly" && base > 0) {
      return Math.round(base * 0.8);
    }
    return base;
  };

  return (
    <AppShell>
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Simple, transparent <span className="gradient-text">pricing</span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Start free. Upgrade when you&apos;re ready. No hidden fees.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-sm ${period === "monthly" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Monthly
            </span>
            <button
              onClick={() => setPeriod(period === "monthly" ? "yearly" : "monthly")}
              className="relative w-12 h-6 rounded-full bg-primary transition-colors"
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${period === "yearly" ? "left-7" : "left-1"}`} />
            </button>
            <span className={`text-sm ${period === "yearly" ? "text-foreground font-medium" : "text-muted-foreground"}`}>
              Yearly <span className="text-success text-xs ml-1">(Save 20%)</span>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative border ${plan.popular ? "border-primary bg-primary/5 glow-border" : "border-border bg-card"}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-indigo-500 to-pink-500 rounded-full text-xs font-medium text-white flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </div>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <div className="mt-2">
                  <span className="text-4xl font-bold">${getPrice(plan.price)}</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription>{plan.desc}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-success shrink-0" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <Button
                  variant={plan.popular ? "gradient" : "outline"}
                  className="w-full"
                  onClick={() => checkout(plan.planKey)}
                  loading={loading === plan.planKey}
                >
                  {plan.cta}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-xl font-semibold text-center mb-6">Feature Comparison</h2>
          <div className="border border-border rounded-lg overflow-hidden">
            <div className="grid grid-cols-4 bg-card border-b border-border">
              <div className="p-3 font-medium text-sm text-muted-foreground">Feature</div>
              <div className="p-3 font-medium text-sm text-center">Free</div>
              <div className="p-3 font-medium text-sm text-center text-primary">Pro</div>
              <div className="p-3 font-medium text-sm text-center">Team</div>
            </div>
            {comparison.map((row, i) => (
              <div key={i} className={`grid grid-cols-4 ${i !== comparison.length - 1 ? "border-b border-border" : ""} bg-card`}>
                <div className="p-3 text-sm font-medium">{row.feature}</div>
                <div className="p-3 text-sm text-center text-muted-foreground">
                  {typeof row.free === "boolean" ? (row.free ? <Check className="w-4 h-4 text-success mx-auto" /> : <span className="text-muted">—</span>) : row.free}
                </div>
                <div className="p-3 text-sm text-center text-primary font-medium">
                  {typeof row.pro === "boolean" ? (row.pro ? <Check className="w-4 h-4 text-success mx-auto" /> : <span className="text-muted">—</span>) : row.pro}
                </div>
                <div className="p-3 text-sm text-center text-muted-foreground">
                  {typeof row.team === "boolean" ? (row.team ? <Check className="w-4 h-4 text-success mx-auto" /> : <span className="text-muted">—</span>) : row.team}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-center mb-6">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {[
              { q: "Is there a free trial?", a: "Yes! The Free plan gives you 10 credits to try the platform. Pro and Team plans come with a 14-day free trial." },
              { q: "Can I change plans later?", a: "Absolutely. You can upgrade or downgrade at any time. Changes take effect at the start of your next billing cycle." },
              { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, MasterCard, American Express) via Stripe." },
              { q: "Do credits roll over?", a: "Yes! For Pro and Team plans, unused credits roll over to the next month. Free plan credits reset monthly." },
            ].map((faq, i) => (
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
      </div>
    </AppShell>
  );
}
