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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sparkles, Copy, Save, RefreshCw, Check, Loader2, FileText, Layers, Zap, MessageSquare,
  BarChart3, BookOpen, Crown, MousePointer, Mail, Megaphone, FileCheck, Lightbulb, Eye,
  Rocket, Users, DollarSign, Send, Reply, MessageCircle, Wand2, Minus, Plus,
} from "lucide-react";
import { toast } from "sonner";
import { POST_TYPES, TONES, FRAMEWORKS, READING_LEVELS, LANGUAGES, PLANS, getPlanCredits } from "@/lib/utils";

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
  const [credits, setCredits] = useState(10);

  const [form, setForm] = useState({
    type: (searchParams.get("type") as string) || "POST",
    topic: "",
    tone: "Professional",
    framework: "",
    audience: "",
    readingLevel: "College",
    emojiLevel: 1,
    hashtags: [] as string[],
    keywords: [] as string[],
    cta: "",
    language: "en",
    length: "medium" as "short" | "medium" | "long",
  });

  const [hashtagInput, setHashtagInput] = useState("");
  const [keywordInput, setKeywordInput] = useState("");

  useEffect(() => {
    if (session?.user) {
      setCredits((session.user as any).credits || 10);
    }
  }, [session]);

  const updateForm = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const addHashtag = () => {
    if (hashtagInput.trim() && !form.hashtags.includes(hashtagInput.trim())) {
      updateForm("hashtags", [...form.hashtags, hashtagInput.trim()]);
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
      toast.error("Please enter a topic");
      return;
    }
    if (credits <= 0) {
      toast.error("No credits remaining. Upgrade your plan.");
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

      if (!res.ok) throw new Error("Generation failed");
      const data = await res.json();
      setResult(data);
      setCredits((c) => c - 1);
      toast.success("Content generated!");
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
      toast.success(`Action applied!`);
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
      toast.success("Post saved to drafts");
    } catch {
      toast.error("Failed to save post");
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.content);
      toast.success("Copied to clipboard");
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

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">AI Content Studio</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {credits} credits remaining
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setForm({ ...form, topic: "", hashtags: [], keywords: [], cta: "" })}>
              <RefreshCw className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button variant="gradient" size="sm" onClick={generate} loading={loading} disabled={credits <= 0}>
              <Sparkles className="w-4 h-4 mr-2" /> Generate
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left: Configuration */}
          <div className="space-y-6">
            {/* Content Type */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Content Type</CardTitle>
                <CardDescription>Choose what you want to create.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[120px]">
                  <div className="flex flex-wrap gap-2">
                    {POST_TYPES.map((t) => {
                      const Icon = getTypeIcon(t.value);
                      return (
                        <button
                          key={t.value}
                          onClick={() => updateForm("type", t.value)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm border transition-all ${
                            form.type === t.value
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border bg-muted text-muted-foreground hover:border-primary/30"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {t.label}
                        </button>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Topic */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Topic & Context</CardTitle>
                <CardDescription>What should the content be about?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="topic">Topic / Source Content *</Label>
                  <Textarea
                    id="topic"
                    placeholder="Describe your topic or paste a blog post, tweet, or video transcript to repurpose..."
                    value={form.topic}
                    onChange={(e) => updateForm("topic", e.target.value)}
                    rows={4}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input
                    id="audience"
                    placeholder="e.g., Founders, marketers, developers..."
                    value={form.audience}
                    onChange={(e) => updateForm("audience", e.target.value)}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="cta">Call to Action</Label>
                  <Input
                    id="cta"
                    placeholder="e.g., Visit our website, Book a demo..."
                    value={form.cta}
                    onChange={(e) => updateForm("cta", e.target.value)}
                    className="mt-2"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Settings */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="text-lg">Style Settings</CardTitle>
                <CardDescription>Fine-tune the AI output.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tone</Label>
                    <Select value={form.tone} onValueChange={(v) => updateForm("tone", v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TONES.map((t) => (
                          <SelectItem key={t} value={t}>{t}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Framework</Label>
                    <Select value={form.framework} onValueChange={(v) => updateForm("framework", v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="None" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">None</SelectItem>
                        {FRAMEWORKS.map((f) => (
                          <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Reading Level</Label>
                    <Select value={form.readingLevel} onValueChange={(v) => updateForm("readingLevel", v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {READING_LEVELS.map((l) => (
                          <SelectItem key={l} value={l}>{l}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Language</Label>
                    <Select value={form.language} onValueChange={(v) => updateForm("language", v)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {LANGUAGES.map((l) => (
                          <SelectItem key={l.value} value={l.value}>{l.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label>Length</Label>
                  <div className="flex gap-2 mt-2">
                    {(["short", "medium", "long"] as const).map((l) => (
                      <Button
                        key={l}
                        variant={form.length === l ? "default" : "outline"}
                        size="sm"
                        onClick={() => updateForm("length", l)}
                        className="capitalize"
                      >
                        {l}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Emoji Level: {form.emojiLevel}</Label>
                  <Slider
                    value={[form.emojiLevel]}
                    min={0}
                    max={3}
                    step={1}
                    onValueChange={(v) => updateForm("emojiLevel", v[0])}
                    className="mt-2"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>None</span>
                    <span>Minimal</span>
                    <span>Moderate</span>
                    <span>Heavy</span>
                  </div>
                </div>

                {/* Hashtags */}
                <div>
                  <Label>Hashtags</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add hashtag..."
                      value={hashtagInput}
                      onChange={(e) => setHashtagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addHashtag())}
                    />
                    <Button variant="outline" size="icon" onClick={addHashtag}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.hashtags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => updateForm("hashtags", form.hashtags.filter(t => t !== tag))}>
                        #{tag} ×
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Keywords */}
                <div>
                  <Label>Keywords</Label>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Add keyword..."
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
                    />
                    <Button variant="outline" size="icon" onClick={addKeyword}>
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {form.keywords.map((kw) => (
                      <Badge key={kw} variant="outline" className="cursor-pointer" onClick={() => updateForm("keywords", form.keywords.filter(k => k !== kw))}>
                        {kw} ×
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right: Output */}
          <div className="space-y-6">
            <Card className="border-border bg-card h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <TypeIcon className="w-5 h-5 text-primary" />
                    {typeInfo.label} Output
                  </CardTitle>
                  <CardDescription>Generated content will appear here.</CardDescription>
                </div>
                {result && (
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={saved ? "default" : "outline"}
                      size="sm"
                      onClick={savePost}
                      disabled={saved}
                    >
                      {saved ? <Check className="w-4 h-4 text-success" /> : <Save className="w-4 h-4" />}
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent className="flex-1">
                {loading ? (
                  <div className="flex flex-col items-center justify-center h-[400px] gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <p className="text-muted-foreground">AI is crafting your content...</p>
                    <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-pulse" style={{ width: "60%" }} />
                    </div>
                  </div>
                ) : result ? (
                  <div className="relative">
                    <ScrollArea className="h-[480px] pr-4">
                      <div className="prose prose-invert prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                          {result.content}
                        </div>
                      </div>
                    </ScrollArea>
                    {/* AI Actions */}
                    <div className="mt-4 pt-4 border-t border-border flex flex-wrap gap-2">
                      <Button variant="outline" size="sm" onClick={() => runAiAction("rewrite")} disabled={loading}>
                        <RefreshCw className="w-3 h-3 mr-1" /> Rewrite
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => runAiAction("expand")} disabled={loading}>
                        <Plus className="w-3 h-3 mr-1" /> Expand
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => runAiAction("shorten")} disabled={loading}>
                        <Minus className="w-3 h-3 mr-1" /> Shorten
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => runAiAction("humanize")} disabled={loading}>
                        <Wand2 className="w-3 h-3 mr-1" /> Humanize
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => runAiAction("grammar")} disabled={loading}>
                        <Check className="w-3 h-3 mr-1" /> Grammar
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => runAiAction("factCheck")} disabled={loading}>
                        <FileCheck className="w-3 h-3 mr-1" /> Fact Check
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[500px] text-center">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-pink-500/20 flex items-center justify-center mb-6">
                      <Sparkles className="w-10 h-10 text-primary/60" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Ready to Create</h3>
                    <p className="text-sm text-muted-foreground max-w-xs">
                      Configure your content on the left and click Generate to create LinkedIn content powered by AI.
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
    <Suspense fallback={<div className="p-8 text-center text-muted-foreground">Loading Studio...</div>}>
      <AIStudioContent />
    </Suspense>
  );
}
