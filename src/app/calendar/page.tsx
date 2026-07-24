"use client";

import * as React from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type PostStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "ARCHIVED";
type PostType = "ARTICLE" | "IMAGE" | "VIDEO" | "PODCAST";

interface Post {
  id: string;
  title: string;
  content: string;
  status: PostStatus;
  type: PostType;
  scheduledDate?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_COLORS: Record<PostStatus, string> = {
  DRAFT: "bg-secondary text-secondary-foreground",
  SCHEDULED: "bg-primary/20 text-primary",
  PUBLISHED: "bg-green-500/20 text-green-500",
  ARCHIVED: "bg-muted text-muted-foreground",
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [posts, setPosts] = React.useState<Post[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [newTitle, setNewTitle] = React.useState("");
  const [newType, setNewType] = React.useState<PostType>("ARTICLE");
  const [newStatus, setNewStatus] = React.useState<PostStatus>("SCHEDULED");
  const [creating, setCreating] = React.useState(false);

  React.useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts?status=SCHEDULED");
        if (res.ok) {
          const data = await res.json();
          setPosts(data);
        }
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getPostsForDay = (day: Date) =>
    posts.filter((p) => p.scheduledDate && isSameDay(new Date(p.scheduledDate), day));

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const handleToday = () => setCurrentMonth(new Date());

  const handleDateClick = (day: Date) => {
    setSelectedDate(day);
    setNewTitle("");
    setNewType("ARTICLE");
    setNewStatus("SCHEDULED");
    setDialogOpen(true);
  };

  const handleCreatePost = async () => {
    if (!selectedDate || !newTitle.trim()) return;
    setCreating(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          content: "",
          type: newType,
          status: newStatus,
          scheduledDate: selectedDate.toISOString(),
        }),
      });
      if (res.ok) {
        const post = await res.json();
        setPosts((prev) => [...prev, post]);
        setDialogOpen(false);
      }
    } catch {
      // silent fail
    } finally {
      setCreating(false);
    }
  };

  return (
    <AppShell>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Content Calendar</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Plan and schedule your content
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleToday}>
              Today
            </Button>
            <div className="flex items-center border border-border rounded-md">
              <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-9 w-9 rounded-none">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-9 w-9 rounded-none">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Month label */}
        <div className="text-center">
          <h2 className="text-lg font-semibold">
            {format(currentMonth, "MMMM yyyy")}
          </h2>
        </div>

        {/* Calendar grid */}
        <Card className="bg-card border-border overflow-hidden">
          <CardContent className="p-0">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 border-b border-border">
              {WEEKDAYS.map((day) => (
                <div
                  key={day}
                  className="py-3 text-center text-xs font-medium text-muted-foreground border-r border-border last:border-r-0"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7">
              {days.map((day, idx) => {
                const dayPosts = getPostsForDay(day);
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const today = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => handleDateClick(day)}
                    className={cn(
                      "min-h-[100px] p-2 text-left border-r border-b border-border last:border-r-0 transition-colors hover:bg-accent/50 flex flex-col gap-1",
                      !isCurrentMonth && "text-muted-foreground bg-muted/30"
                    )}
                  >
                    <span
                      className={cn(
                        "inline-flex h-7 w-7 items-center justify-center rounded-full text-sm",
                        today
                          ? "bg-primary text-primary-foreground font-semibold"
                          : isCurrentMonth
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {format(day, "d")}
                    </span>
                    <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                      {loading ? (
                        <div className="h-5 w-16 bg-muted rounded animate-pulse" />
                      ) : dayPosts.length > 0 ? (
                        dayPosts.slice(0, 3).map((post) => (
                          <Badge
                            key={post.id}
                            variant="outline"
                            className={cn(
                              "text-[10px] justify-start truncate px-1.5 py-0 h-5",
                              STATUS_COLORS[post.status]
                            )}
                          >
                            {post.title}
                          </Badge>
                        ))
                      ) : null}
                      {dayPosts.length > 3 && (
                        <span className="text-[10px] text-muted-foreground pl-1">
                          +{dayPosts.length - 3} more
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Schedule post dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule Post</DialogTitle>
              <DialogDescription>
                {selectedDate && `Creating a post scheduled for ${format(selectedDate, "EEEE, MMMM d, yyyy")}`}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Enter post title"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Content Type</label>
                <Select value={newType} onValueChange={(v) => setNewType(v as PostType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ARTICLE">Article</SelectItem>
                    <SelectItem value="IMAGE">Image</SelectItem>
                    <SelectItem value="VIDEO">Video</SelectItem>
                    <SelectItem value="PODCAST">Podcast</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Status</label>
                <Select
                  value={newStatus}
                  onValueChange={(v) => setNewStatus(v as PostStatus)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                    <SelectItem value="PUBLISHED">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Notes (optional)</label>
                <Textarea
                  placeholder="Add a brief description or notes..."
                  className="resize-none h-20"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost} disabled={creating || !newTitle.trim()}>
                {creating ? "Creating..." : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Create
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}
