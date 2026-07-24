"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  Trash2,
  Pencil,
  Plus,
  Search,
  Inbox,
  Eye,
  Heart,
  MessageSquare,
} from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

type PostStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
type PostType = "ARTICLE" | "IMAGE" | "VIDEO" | "PODCAST";

interface Post {
  id: string;
  title: string;
  content: string;
  status: PostStatus;
  type: PostType;
  createdAt: string;
  updatedAt: string;
  views?: number;
  likes?: number;
  comments?: number;
}

const STATUS_CONFIG: Record<
  PostStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  DRAFT: { label: "Draft", variant: "secondary" },
  SCHEDULED: { label: "Scheduled", variant: "outline" },
  PUBLISHED: { label: "Published", variant: "default" },
  ARCHIVED: { label: "Archived", variant: "destructive" },
};

const TYPE_CONFIG: Record<
  PostType,
  { label: string; icon: React.ElementType }
> = {
  ARTICLE: { label: "Article", icon: FileText },
  IMAGE: { label: "Image", icon: ImageIcon },
  VIDEO: { label: "Video", icon: Video },
  PODCAST: { label: "Podcast", icon: Mic },
};

const STATUS_TABS: { value: PostStatus | "ALL"; label: string }[] = [
  { value: "ALL", label: "All" },
  { value: "DRAFT", label: "Draft" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

const CONTENT_TYPES: { value: PostType | "ALL"; label: string }[] = [
  { value: "ALL", label: "All Types" },
  { value: "ARTICLE", label: "Article" },
  { value: "IMAGE", label: "Image" },
  { value: "VIDEO", label: "Video" },
  { value: "PODCAST", label: "Podcast" },
];

function getPreview(content: string, length: number = 120): string {
  const plain = content.replace(/<[^>]*>/g, "").trim();
  if (plain.length <= length) return plain;
  return plain.slice(0, length).trim() + "...";
}

export default function PostsPage() {
  const router = useRouter();
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<PostStatus | "ALL">("ALL");
  const [typeFilter, setTypeFilter] = React.useState<PostType | "ALL">("ALL");
  const [deleting, setDeleting] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetch("/api/posts")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch posts");
        return res.json();
      })
      .then((data: Post[]) => {
        setPosts(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id: string) => {
    setDeleting(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
      }
    } catch {
      // silent fail
    } finally {
      setDeleting(null);
    }
  };

  const filtered = posts.filter((post) => {
    const matchesSearch =
      search === "" ||
      post.title.toLowerCase().includes(search.toLowerCase()) ||
      post.content.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "ALL" || post.status === statusFilter;
    const matchesType = typeFilter === "ALL" || post.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Posts</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage and organize your content
            </p>
          </div>
          <Button asChild>
            <Link href="/studio">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Link>
          </Button>
        </div>

        {/* Search and filters */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search posts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={typeFilter}
            onValueChange={(v) => setTypeFilter(v as PostType | "ALL")}
          >
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Content Type" />
            </SelectTrigger>
            <SelectContent>
              {CONTENT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status tabs */}
        <div className="flex border-b border-border">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={cn(
                "px-4 py-2 text-sm font-medium border-b-2 transition-colors",
                statusFilter === tab.value
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : filtered.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center py-20">
              <Inbox className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold">No posts found</h3>
              <p className="text-sm text-muted-foreground mt-1 text-center max-w-sm">
                {search || statusFilter !== "ALL" || typeFilter !== "ALL"
                  ? "Try adjusting your filters to find what you are looking for."
                  : "Get started by creating your first post."}
              </p>
              {!search && statusFilter === "ALL" && typeFilter === "ALL" && (
                <Button asChild className="mt-4">
                  <Link href="/studio">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Post
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <ScrollArea className="h-[calc(100vh-280px)]">
            <div className="grid gap-4 md:grid-cols-2">
              {filtered.map((post) => {
                const TypeIcon = TYPE_CONFIG[post.type].icon;
                const statusCfg = STATUS_CONFIG[post.status];
                return (
                  <Card
                    key={post.id}
                    className="bg-card border-border hover:border-primary/50 transition-colors group"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                            <TypeIcon className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <div>
                            <Badge variant={statusCfg.variant} className="text-[10px]">
                              {statusCfg.label}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            asChild
                          >
                            <Link href={`/posts/${post.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDelete(post.id)}
                            disabled={deleting === post.id}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <CardTitle className="text-base font-semibold leading-snug mt-2">
                        {post.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {getPreview(post.content)}
                      </p>
                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-xs text-muted-foreground">
                          {new Date(post.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {post.views ?? 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {post.likes ?? 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <MessageSquare className="h-3 w-3" />
                            {post.comments ?? 0}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </div>
    </AppShell>
  );
}
