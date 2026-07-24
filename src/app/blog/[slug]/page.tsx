"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CalendarDays, Eye, Clock, User, Tag } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";

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
  tags: string[];
}

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [related, setRelated] = useState<BlogPost[]>([]);

  useEffect(() => {
    async function fetchPost() {
      try {
        const res = await fetch(`/api/blog?slug=${slug}`);
        if (res.ok) {
          const data = await res.json();
          setPost(data);
          setRelated(data.related || []);
        }
      } catch {
        // Use mock
        setPost(MOCK_POST);
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <AppShell>
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-64 w-full rounded-lg mb-6" />
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-4 w-1/2 mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </AppShell>
    );
  }

  if (!post) {
    return (
      <AppShell>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold mb-2">Post not found</h1>
          <Link href="/blog" className="text-primary hover:underline">
            Back to blog
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="max-w-3xl mx-auto">
        <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground mb-6 inline-block">
          ← Back to blog
        </Link>

        {/* Cover */}
        <div className="relative h-64 md:h-80 w-full rounded-lg overflow-hidden mb-6">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Header */}
        <div className="mb-8">
          <Badge variant="outline" className="mb-3">{post.category}</Badge>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{post.title}</h1>
          <p className="text-lg text-muted-foreground mb-4">{post.excerpt}</p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
            <div className="flex items-center gap-2">
              <Image src={post.authorAvatar} alt={post.author} width={24} height={24} className="rounded-full" />
              <span>{post.author}</span>
            </div>
            <span className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              {formatDate(post.publishedAt)}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {post.views.toLocaleString()} views
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {post.readTime} min read
            </span>
          </div>
        </div>

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex gap-2 mb-6 flex-wrap">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                <Tag className="h-3 w-3" /> {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-invert prose-lg max-w-none mb-12">
          {post.content.split("\n").map((para, i) => (
            <p key={i} className="text-foreground/80 leading-relaxed mb-4">{para}</p>
          ))}
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="border-t border-border pt-8">
            <h2 className="text-xl font-semibold mb-4">Related Posts</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {related.map((r) => (
                <Link key={r.id} href={`/blog/${r.slug}`}>
                  <Card className="border-border bg-card hover:border-primary/30 transition-all cursor-pointer">
                    <CardContent className="p-4">
                      <Badge variant="outline" className="text-xs mb-2">{r.category}</Badge>
                      <h3 className="font-medium text-sm line-clamp-2">{r.title}</h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}

const MOCK_POST: BlogPost = {
  id: "1",
  slug: "building-scalable-ai-pipelines",
  title: "Building Scalable AI Pipelines for Production",
  excerpt: "Learn how to design and deploy AI pipelines that scale from prototype to millions of requests per day.",
  content: `In today's fast-paced AI landscape, building scalable pipelines is no longer optional — it's a competitive necessity.

The journey from a Jupyter notebook prototype to a production-grade AI system involves multiple critical decisions around infrastructure, monitoring, and deployment strategy.

## Key Considerations

1. **Model Serving**: Choose between real-time inference, batch processing, or a hybrid approach based on your use case.

2. **Data Pipeline**: Ensure your data flows seamlessly from collection to preprocessing to feature storage.

3. **Monitoring & Observability**: Track model drift, latency, and resource utilization in real-time.

## Best Practices

- Start with a simple architecture and iterate
- Implement comprehensive logging from day one
- Use feature stores to avoid training-serving skew
- Automate retraining pipelines with CI/CD

## Conclusion

Building scalable AI pipelines requires careful planning, but the payoff in reliability and maintainability is well worth the investment. Start small, measure everything, and scale incrementally.`,
  coverImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
  category: "AI",
  author: "Sarah Chen",
  authorAvatar: "https://avatar.vercel.sh/sarah",
  publishedAt: "2024-01-15",
  views: 12400,
  readTime: 8,
  tags: ["AI", "MLOps", "Infrastructure"],
};
