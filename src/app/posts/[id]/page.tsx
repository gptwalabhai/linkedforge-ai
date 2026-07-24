"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Save, FileText, Image as ImageIcon, Video, Mic } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

interface PostVersion {
  id: string;
  postId: string;
  title: string;
  content: string;
  createdAt: string;
}

interface Post {
  id: string;
  title: string;
  content: string;
  status: PostStatus;
  type: PostType;
  createdAt: string;
  updatedAt: string;
  versions?: PostVersion[];
}

const STATUS_OPTIONS: { value: PostStatus; label: string }[] = [
  { value: "DRAFT", label: "Draft" },
  { value: "SCHEDULED", label: "Scheduled" },
  { value: "PUBLISHED", label: "Published" },
  { value: "ARCHIVED", label: "Archived" },
];

const TYPE_CONFIG: Record<
  PostType,
  { label: string; icon: React.ElementType }
> = {
  ARTICLE: { label: "Article", icon: FileText },
  IMAGE: { label: "Image", icon: ImageIcon },
  VIDEO: { label: "Video", icon: Video },
  PODCAST: { label: "Podcast", icon: Mic },
};

const STATUS_VARIANT: Record<PostStatus, "default" | "secondary" | "destructive" | "outline"> = {
  DRAFT: "secondary",
  SCHEDULED: "outline",
  PUBLISHED: "default",
  ARCHIVED: "destructive",
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [post, setPost] = React.useState<Post | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [status, setStatus] = React.useState<PostStatus>("DRAFT");
  const [saving, setSaving] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);
  const [activeVersion, setActiveVersion] = React.useState<string | null>(null);
  const [previewVersion, setPreviewVersion] = React.useState(false);

  React.useEffect(() => {
    fetch(`/api/posts/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch post");
        return res.json();
      })
      .then((data: Post) => {
        setPost(data);
        setTitle(data.title);
        setContent(data.content);
        setStatus(data.status);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content, status }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPost(updated);
      }
    } catch {
      // silent fail
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/posts");
      }
    } catch {
      // silent fail
    } finally {
      setDeleting(false);
    }
  };

  const handleVersionClick = (versionId: string) => {
    if (activeVersion === versionId) {
      setActiveVersion(null);
      setPreviewVersion(false);
    } else {
      setActiveVersion(versionId);
      setPreviewVersion(true);
    }
  };

  const restoreVersion = () => {
    if (!activeVersion || !post?.versions) return;
    const version = post.versions.find((v) => v.id === activeVersion);
    if (version) {
      setTitle(version.title);
      setContent(version.content);
      setPreviewVersion(false);
      setActiveVersion(null);
    }
  };

  const TypeIcon = post ? TYPE_CONFIG[post.type].icon : FileText;

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-full">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        </div>
      </AppShell>
    );
  }

  if (!post) {
    return (
      <AppShell>
        <div className="max-w-2xl mx-auto text-center py-20">
          <h2 className="text-2xl font-bold">Post not found</h2>
          <p className="text-muted-foreground mt-2">This post may have been deleted.</p>
          <Button asChild className="mt-4">
            <Link href="/posts">Back to Posts</Link>
          </Button>
        </div>
      </AppShell>
    );
  }

  const displayTitle = previewVersion && activeVersion
    ? post.versions?.find((v) => v.id === activeVersion)?.title ?? title
    : title;
  const displayContent = previewVersion && activeVersion
    ? post.versions?.find((v) => v.id === activeVersion)?.content ?? content
    : content;

  return (
    <AppShell>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header bar */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/posts">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center">
                <TypeIcon className="h-4 w-4 text-muted-foreground" />
              </div>
              <Badge variant={STATUS_VARIANT[post.type === "ARTICLE" ? "DRAFT" : post.type === "IMAGE" ? "DRAFT" : post.type === "VIDEO" ? "DRAFT" : "DRAFT"]}>
                {TYPE_CONFIG[post.type].label}
              </Badge>
              <Badge variant={STATUS_VARIANT[post.status]} className="ml-1">
                {STATUS_OPTIONS.find((s) => s.value === post.status)?.label}
              </Badge>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {/* Main editor */}
          <div className="md:col-span-2 space-y-4">
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <Input
                  value={displayTitle}
                  onChange={(e) => !previewVersion && setTitle(e.target.value)}
                  placeholder="Post title"
                  className="text-lg font-semibold border-0 px-0 h-auto focus-visible:ring-0"
                  disabled={previewVersion}
                />
              </CardHeader>
              <CardContent>
                <Textarea
                  value={displayContent}
                  onChange={(e) => !previewVersion && setContent(e.target.value)}
                  placeholder="Write your content here..."
                  className="min-h-[400px] border-0 px-0 resize-none focus-visible:ring-0 text-sm leading-relaxed"
                  disabled={previewVersion}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as PostStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem key={s.value} value={s.value}>
                        {s.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Meta */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type</span>
                  <span>{TYPE_CONFIG[post.type].label}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Created</span>
                  <span>
                    {new Date(post.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Updated</span>
                  <span>
                    {new Date(post.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Version history */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Version History</CardTitle>
              </CardHeader>
              <CardContent>
                {post.versions && post.versions.length > 0 ? (
                  <ScrollArea className="h-[300px] pr-4">
                    <div className="space-y-1">
                      {post.versions.map((version) => (
                        <button
                          key={version.id}
                          onClick={() => handleVersionClick(version.id)}
                          className={cn(
                            "w-full text-left p-2 rounded-md text-sm transition-colors",
                            activeVersion === version.id
                              ? "bg-primary/10 text-foreground"
                              : "hover:bg-accent text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <div className="font-medium truncate">{version.title}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {new Date(version.createdAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <p className="text-sm text-muted-foreground">No version history yet.</p>
                )}

                {previewVersion && activeVersion && (
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={restoreVersion}
                        className="flex-1"
                      >
                        Restore
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setPreviewVersion(false);
                          setActiveVersion(null);
                        }}
                        className="flex-1"
                      >
                        Close
                      </Button>
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1 text-center">
                      Restoring will replace current content with this version.
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
