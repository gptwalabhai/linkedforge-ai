"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles, Copy, Save, RefreshCw, Check, Loader2, FileText, Layers, Zap, MessageSquare,
  BarChart3, BookOpen, Crown, MousePointer, Mail, Megaphone, FileCheck, Lightbulb, Eye,
  Rocket, Users, DollarSign, Send, Reply, MessageCircle, Wand2, Minus, Plus, Cpu, Flame, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { POST_TYPES, TONES, FRAMEWORKS, READING_LEVELS, LANGUAGES } from "@/lib/utils";

interface GenerationResult {
  content: string;
  provider: string;
}

function AIStudioContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [saved, setSaved] = useState(false);
  const [credits, setCredits] = useState(50);

  const [form, setForm] = useState({
    type: (searchParams.get("type") as string) || "POST",
    topic: "",
    tone: "Professional",
    framework: "AIDA",
    audience: "Founders, Marketers & Executives",
    readingLevel: "College",
    emojiLevel: 1,
    hashtags: ["LinkedInGrowth", "SaaS", "Leadership"] as string[],
    keywords: [] as string[],
    cta: "What is your perspective on this? Drop your thoughts below! 👇",
    language: "en",
    length: "medium" as "short" | "medium" | "long",
  });

  const [hashtagInput, setHashtagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  useEffect(() => {
    if (session?.user) {
      setCredits((session.user as any).credits || 50);
    }
  }, [session]);

  const updateForm = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !form.hashtags.includes(hashtagInput.trim())) {
      updateForm("hashtags", [...form.hashtags, hashtagInput.trim().replace(/^#/, "")]);
      setHashtagInput("");
    }
  };

  const addKeyword = () => {
    if (keywordInput.trim() && !form.keywords.includes(keywordInput.trim())) {
      updateForm("keywords", [...form.keywords, keywordInput.trim()]);
      setKeywordInput("");
    }
  };

  const generate = async () => {
    if (!form.topic.trim()) {
      toast.error("Please enter a topic or source content");
      return;
    }
    if (credits <= 0) {
      toast.error("No credits remaining. Please upgrade your plan.");
      return;
    }

    setLoading(true);
    setResult(null);
    setSaved(false);

    try {
      const res = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.status === 403) {
        const err = await res.json();
        toast.error(err.error || "No credits remaining.");
        setCredits(0);
        return;
      }
      if (res.status === 429) {
        toast.error("Rate limit exceeded. Please wait a moment.");
        return;
      }
      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setResult(data);
      if (typeof data.creditsRemaining === "number") {
        setCredits(data.creditsRemaining);
      } else {
        setCredits((c) => Math.max(0, c - 1));
      }
      toast.success("Content generated with DeepSeek V4 Pro!");
    } catch (err) {
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const runAiAction = async (action: string) => {
    if (!result?.content) return;
    setLoading(true);
    try {
      const res = await fetch("/api/ai/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          content: result.content,
          language: form.language,
        }),
      });
      if (!res.ok) throw new Error("Action failed");
      const data = await res.json();
      setResult({ content: data.content, provider: data.provider || result.provider });
      setSaved(false);
      toast.success(`Applied ${action} transformation!`);
    } catch {
      toast.error("Failed to perform AI action");
    } finally {
      setLoading(false);
    }
  };

  const savePost = async () => {
    if (!result) return;
    try {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: form.type,
          content: result.content,
          status: "DRAFT",
          tone: form.tone,
          framework: form.framework,
          audience: form.audience,
          readingLevel: form.readingLevel,
          emojiLevel: form.emojiLevel,
          hashtags: form.hashtags,
          keywords: form.keywords,
          cta: form.cta,
          language: form.language,
        }),
      });
      setSaved(true);
      toast.success("Saved to draft library!");
    } catch {
      toast.error("Failed to save draft");
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.content);
      toast.success("Copied post to clipboard!");
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, React.ElementType> = {
      POST: FileText, CAROUSEL: Layers, HOOK: Zap, THREAD: MessageSquare,
      POLL: BarChart3, STORY: BookOpen, THOUGHT_LEADERSHIP: Crown, CTA: MousePointer,
      COLD_OUTREACH: Mail, FOUNDER_UPDATE: Megaphone, CASE_STUDY: FileCheck,
      LESSONS_LEARNED: Lightbulb, BEHIND_THE_SCENES: Eye, PRODUCT_LAUNCH: Rocket,
      HIRING: Users, SALES: DollarSign, NEWSLETTER: Send, REPLY: Reply, COMMENT: MessageCircle,
    };
    return icons[type] || FileText;
  };

  const typeInfo = POST_TYPES.find((t) => t.value === form.type) || POST_TYPES[0];
  const TypeIcon = getTypeIcon(form.type);

  const wordCount = result?.content ? result.content.split(/\s+/).filter(Boolean).length : 0;
  const estimatedReadTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Studio Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-[#0f0c16] via-[#120a10] to-[#08080e] border border-red-900/30 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-[11px] font-mono flex items-center gap-1.5">
                <Cpu className="w-3 h-3 text-red-500 animate-pulse" /> DeepSeek V4 Pro Strategist
              </span>
              <span className="text-xs text-slate-400 font-mono">• {credits} Credits Remaining</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">AI Content Studio</h1>
            <p className="text-sm text-slate-400 mt-1">
              Craft high-performing, viral LinkedIn posts in seconds backed by 20 years of copywriting frameworks.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setForm({ ...form, topic: "", cta: "" })}
              className="border-red-900/30 bg-[#12121c] text-slate-300 hover:text-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" /> Clear Form
            </Button>
            <Button
              variant="gradient"
              size="default"
              onClick={generate}
              loading={loading}
              disabled={credits <= 0}
              className="px-6 shadow-lg shadow-red-900/40"
            >
              <Sparkles className="w-4 h-4 mr-2" /> Generate Content
            </Button>
          </div>
        </div>

        {/* 12-Column Responsive Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Form Configuration (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Format Selection */}
            <Card className="border border-red-900/30 stitch-card border border-red-900/30 rounded-2xl shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-red-500" /> Select Content Format
                </CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Choose the post structure optimized for your campaign goal.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {POST_TYPES.slice(0, 12).map((t) => {
                    const Icon = getTypeIcon(t.value);
                    const isSelected = form.type === t.value;
                    return (
                      <button
                        key={t.value}
                        type="button"
                        onClick={() => updateForm("type", t.value)}
                        className={`flex items-center gap-2.5 p-3 rounded-xl text-xs font-semibold border transition-all duration-200 text-left ${
                          isSelected
                            ? "border-red-500 bg-red-950/50 text-white shadow-md shadow-red-950 border-l-4 border-l-red-500"
                            : "border-white/5 bg-[#10101a] text-slate-300 hover:border-red-900/40 hover:bg-[#141422]"
                        }`}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isSelected ? "text-red-400" : "text-slate-400"}`} />
                        <span className="truncate">{t.label}</span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Topic & Context Input */}
            <Card className="border border-red-900/30 stitch-card border border-red-900/30 rounded-2xl shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white">Topic & Source Material *</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Paste raw notes, a blog link, tweet, YouTube transcript, or key insights to generate from.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Textarea
                    placeholder="e.g., Why 90% of B2B SaaS founders fail at LinkedIn content because they focus on product features instead of customer pain points..."
                    value={form.topic}
                    onChange={(e) => updateForm("topic", e.target.value)}
                    rows={4}
                    className="border-red-900/30 bg-[#10101a] text-white placeholder:text-slate-500 focus:border-red-500 focus:ring-1 focus:ring-red-500 text-sm leading-relaxed"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-slate-300">Target Audience</Label>
                    <Input
                      placeholder="e.g., SaaS Founders, VPs of Sales..."
                      value={form.audience}
                      onChange={(e) => updateForm("audience", e.target.value)}
                      className="mt-1.5 border-red-900/30 bg-[#10101a] text-white text-xs"
                    />
                  </div>
                  <div>
                    <Label className="text-xs text-slate-300">Call to Action (CTA)</Label>
                    <Input
                      placeholder="e.g., Drop your thoughts below! 👇"
                      value={form.cta}
                      onChange={(e) => updateForm("cta", e.target.value)}
                      className="mt-1.5 border-red-900/30 bg-[#10101a] text-white text-xs"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Advanced Tone & Framework Settings */}
            <Card className="border border-red-900/30 stitch-card border border-red-900/30 rounded-2xl shadow-xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-base text-white">Style & Copy Strategy</CardTitle>
                <CardDescription className="text-xs text-slate-400">
                  Fine-tune the voice, framework, and readability math.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-slate-300">Tone of Voice</Label>
                    <Select value={form.tone} onValueChange={(v) => updateForm("tone", v)}>
                      <SelectTrigger className="mt-1.5 border-red-900/30 bg-[#10101a] text-white text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#12121e] border-red-900/40 text-white">
                        {TONES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs text-slate-300">Copywriting Framework</Label>
                    <Select value={form.framework} onValueChange={(v) => updateForm("framework", v)}>
                      <SelectTrigger className="mt-1.5 border-red-900/30 bg-[#10101a] text-white text-xs">
                        <SelectValue placeholder="Select framework" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#12121e] border-red-900/40 text-white">
                        <SelectItem value="AIDA">AIDA (Attention, Interest, Desire, Action)</SelectItem>
                        <SelectItem value="PAS">PAS (Problem, Agitation, Solution)</SelectItem>
                        <SelectItem value="BAB">BAB (Before, After, Bridge)</SelectItem>
                        <SelectItem value="STORYBRAND">StoryBrand Framework</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-slate-300">Length Strategy</Label>
                    <div className="flex gap-2 mt-1.5">
                      {(["short", "medium", "long"] as const).map((l) => (
                        <Button
                          key={l}
                          type="button"
                          variant={form.length === l ? "gradient" : "outline"}
                          size="sm"
                          onClick={() => updateForm("length", l)}
                          className="capitalize text-xs flex-1"
                        >
                          {l}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-slate-300">Language</Label>
                    <Select value={form.language} onValueChange={(v) => updateForm("language", v)}>
                      <SelectTrigger className="mt-1.5 border-red-900/30 bg-[#10101a] text-white text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-[#12121e] border-red-900/40 text-white">
                        {LANGUAGES.map((l) => (
                          <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Hashtags & Keywords */}
                <div>
                  <Label className="text-xs text-slate-300">Hashtags</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      placeholder="Add hashtag..."
                      value={hashtagInput}
                      onChange={(e) => setHashtagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHashtag())}
                      className="border-red-900/30 bg-[#10101a] text-white text-xs"
                    />
                    <Button variant="outline" size="sm" onClick={addHashtag} type="button" className="border-red-900/30">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {form.hashtags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="bg-red-950/80 border border-red-500/30 text-red-300 text-[11px] cursor-pointer hover:bg-red-900"
                        onClick={() => updateForm("hashtags", form.hashtags.filter((t) => t !== tag))}
                      >
                        #{tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Output & AI Transformations (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="border border-red-900/30 stitch-card border border-red-900/30 rounded-2xl shadow-2xl h-full flex flex-col min-h-[580px]">
              <CardHeader className="pb-3 flex flex-row items-center justify-between border-b border-white/5">
                <div>
                  <CardTitle className="text-base text-white flex items-center gap-2">
                    <TypeIcon className="w-4 h-4 text-red-500" />
                    {typeInfo.label} Output
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    {wordCount > 0 ? `${wordCount} words • ~${estimatedReadTime} min read` : "AI generation preview"}
                  </CardDescription>
                </div>

                {result && (
                  <div className="flex items-center gap-1.5">
                    <Button variant="outline" size="sm" onClick={copyToClipboard} className="border-red-900/30 text-xs">
                      <Copy className="w-3.5 h-3.5 mr-1" /> Copy
                    </Button>
                    <Button
                      variant={saved ? "default" : "gradient"}
                      size="sm"
                      onClick={savePost}
                      disabled={saved}
                      className="text-xs"
                    >
                      {saved ? <Check className="w-3.5 h-3.5 mr-1 text-emerald-400" /> : <Save className="w-3.5 h-3.5 mr-1" />}
                      {saved ? "Saved" : "Save"}
                    </Button>
                  </div>
                )}
              </CardHeader>

              <CardContent className="flex-1 flex flex-col justify-between p-5">
                {loading ? (
                  <div className="flex flex-col items-center justify-center flex-1 min-h-[380px] gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-red-950/80 border border-red-500/40 flex items-center justify-center animate-bounce shadow-lg shadow-red-950">
                      <Sparkles className="w-7 h-7 text-red-500" />
                    </div>
                    <div className="text-center space-y-1">
                      <p className="text-sm font-bold text-white">DeepSeek V4 Pro is Crafting Copy...</p>
                      <p className="text-xs text-slate-400">Applying AIDA hook psychology & mobile line spacing...</p>
                    </div>
                    <div className="w-48 h-1.5 bg-[#12121e] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-red-600 to-rose-500 animate-pulse" style={{ width: "70%" }} />
                    </div>
                  </div>
                ) : result ? (
                  <div className="flex flex-col justify-between flex-1">
                    <ScrollArea className="h-[420px] pr-3">
                      <div className="prose prose-invert max-w-none text-sm leading-relaxed text-slate-100 whitespace-pre-wrap font-sans">
                        {result.content}
                      </div>
                    </ScrollArea>

                    {/* AI Transformations Toolbar */}
                    <div className="mt-4 pt-4 border-t border-white/5 space-y-2">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                        ⚡ 1-Click AI Transformations:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        <Button variant="outline" size="sm" onClick={() => runAiAction("rewrite")} className="border-red-900/30 text-xs text-slate-300 hover:text-white">
                          <RefreshCw className="w-3 h-3 mr-1 text-red-400" /> Rewrite
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => runAiAction("humanize")} className="border-red-900/30 text-xs text-slate-300 hover:text-white">
                          <Wand2 className="w-3 h-3 mr-1 text-red-400" /> Humanize
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => runAiAction("expand")} className="border-red-900/30 text-xs text-slate-300 hover:text-white">
                          <Plus className="w-3 h-3 mr-1 text-red-400" /> Expand
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => runAiAction("shorten")} className="border-red-900/30 text-xs text-slate-300 hover:text-white">
                          <Minus className="w-3 h-3 mr-1 text-red-400" /> Shorten
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => runAiAction("grammar")} className="border-red-900/30 text-xs text-slate-300 hover:text-white">
                          <Check className="w-3 h-3 mr-1 text-emerald-400" /> Polish
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center flex-1 min-h-[380px] text-center p-6">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-950 to-[#180a12] border border-red-500/30 flex items-center justify-center mb-4 shadow-xl shadow-red-950">
                      <Flame className="w-8 h-8 text-red-500" />
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">Ready to Generate</h3>
                    <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                      Enter your topic on the left and click <strong className="text-white">Generate Content</strong> to create viral LinkedIn copy with DeepSeek V4 Pro.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function AIStudioPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 font-mono">Loading Studio...</div>}>
      <AIStudioContent />
    </Suspense>
  );
}
