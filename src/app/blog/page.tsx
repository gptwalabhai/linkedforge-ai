"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { CalendarDays, Eye, User } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  author: string;
  authorAvatar: string;
  publishedAt: string;
  views: number;
  readTime: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  Engineering: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Product: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  Design: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  "Case Study": "bg-green-500/10 text-green-400 border-green-500/20",
  Tutorial: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  News: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

function categoryBadgeVariant(category: string) {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.News;
}

export default function BlogPage() {
  const router = useRouter();
  const [posts, setPosts] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [categories, setCategories] = React.useState<string[]>(["All"]);

  React.useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/blog");
        if (!res.ok) throw new Error("Failed to fetch posts");
        const data = await res.json();
        const postsList: BlogPost[] = Array.isArray(data) ? data : data.posts || [];
        setPosts(postsList);
        const cats = Array.from(new Set(postsList.map((p) => p.category))) as string[];
        setCategories(["All", ...cats]);
      } catch {
        // fallback mock data
        setPosts(MOCK_POSTS);
        setCategories(["All", ...Array.from(new Set(MOCK_POSTS.map((p) => p.category))) as string[]]);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const filtered =
    selectedCategory === "All" ? posts : posts.filter((p) => p.category === selectedCategory);

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Blog</h1>
          <p className="text-muted-foreground">
            Insights, tutorials, and updates from the AIMS team.
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="mb-8"
        >
          <TabsList className="bg-white/5 border border-white/10 p-1 flex flex-wrap gap-1 h-auto">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat}
                value={cat}
                className="data-[state=active]:bg-white/10 data-[state=active]:text-white text-muted-foreground rounded-md px-4 py-2 text-sm transition-all"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-white/5 border-white/10 overflow-hidden">
                <Skeleton className="h-40 w-full" />
                <CardContent className="p-4 space-y-3">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/2" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No posts found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((post) => (
              <BlogPostCard key={post.id} post={post} onClick={() => router.push(`/blog/${post.slug}`)} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}

function BlogPostCard({ post, onClick }: { post: BlogPost; onClick: () => void }) {
  return (
    <Card
      onClick={onClick}
      className="group bg-white/5 border-white/10 overflow-hidden cursor-pointer hover:border-white/20 transition-all duration-300 hover:-translate-y-1"
    >
      {/* Cover Image */}
      <div className="relative h-40 w-full overflow-hidden">
        <Image
          src={post.coverImage}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-3">
          <Badge
            variant="outline"
            className={`text-xs ${categoryBadgeVariant(post.category)}`}
          >
            {post.category}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4 space-y-3">
        <h3 className="text-base font-semibold text-white line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{post.excerpt}</p>

        <div className="flex items-center justify-between pt-2 border-t border-white/5">
          <div className="flex items-center gap-2">
            <Image
              src={post.authorAvatar}
              alt={post.author}
              width={20}
              height={20}
              className="rounded-full"
            />
            <span className="text-xs text-muted-foreground">{post.author}</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <CalendarDays className="h-3 w-3" />
              {new Date(post.publishedAt).toLocaleDateString("en", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              {post.views.toLocaleString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const MOCK_POSTS: BlogPost[] = [
  {
    id: "1",
    slug: "building-scalable-ai-pipelines",
    title: "Building Scalable AI Pipelines for Production",
    excerpt:
      "Learn how to design and deploy AI pipelines that scale from prototype to millions of requests per day.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    category: "Engineering",
    author: "Sarah Chen",
    authorAvatar: "https://avatar.vercel.sh/sarah",
    publishedAt: "2024-01-15",
    views: 12400,
    readTime: 8,
  },
  {
    id: "2",
    slug: "design-system-principles",
    title: "Design System Principles for AI Products",
    excerpt:
      "A deep dive into building design systems that work for AI-powered applications and data-heavy interfaces.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
    category: "Design",
    author: "Marcus Lee",
    authorAvatar: "https://avatar.vercel.sh/marcus",
    publishedAt: "2024-01-10",
    views: 8200,
    readTime: 6,
  },
  {
    id: "3",
    slug: "llm-fine-tuning-guide",
    title: "The Complete Guide to LLM Fine-Tuning",
    excerpt:
      "Everything you need to know about fine-tuning large language models for your specific use case.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80",
    category: "Tutorial",
    author: "David Park",
    authorAvatar: "https://avatar.vercel.sh/david",
    publishedAt: "2024-01-08",
    views: 24500,
    readTime: 12,
  },
  {
    id: "4",
    slug: "customer-success-story-fintech",
    title: "How FinFlow Reduced Churn by 34% with AIMS",
    excerpt:
      "A case study on how FinFlow leveraged predictive analytics to identify at-risk customers and take action.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=800&q=80",
    category: "Case Study",
    author: "Emma Wilson",
    authorAvatar: "https://avatar.vercel.sh/emma",
    publishedAt: "2024-01-05",
    views: 6700,
    readTime: 5,
  },
  {
    id: "5",
    slug: "product-roadmap-2024",
    title: "AIMS Product Roadmap: What's Coming in 2024",
    excerpt:
      "A sneak peek at the features and capabilities we are building this year to power your AI workflows.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80",
    category: "Product",
    author: "Alex Kim",
    authorAvatar: "https://avatar.vercel.sh/alex",
    publishedAt: "2024-01-02",
    views: 18900,
    readTime: 7,
  },
  {
    id: "6",
    slug: "vector-databases-explained",
    title: "Vector Databases Explained: A Practical Guide",
    excerpt:
      "Understanding vector databases, embeddings, and when to use them in your AI applications.",
    content: "",
    coverImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    category: "Tutorial",
    author: "Priya Sharma",
    authorAvatar: "https://avatar.vercel.sh/priya",
    publishedAt: "2023-12-28",
    views: 31200,
    readTime: 10,
  },
];
