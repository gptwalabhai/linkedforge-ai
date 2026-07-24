"use client";

import { useRouter } from "next/navigation";
import { Sparkles, FileText, Layers, Zap, MessageSquare } from "lucide-react";

const actions = [
  { label: "Generate Post", type: "POST", icon: FileText },
  { label: "Create Carousel", type: "CAROUSEL", icon: Layers },
  { label: "Generate Hook", type: "HOOK", icon: Zap },
  { label: "Create Thread", type: "THREAD", icon: MessageSquare },
];

export function QuickActions() {
  const router = useRouter();

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => (
        <button
          key={action.type}
          onClick={() => router.push(`/studio?type=${action.type}`)}
          className="flex items-center gap-2 px-4 py-2 rounded-md bg-card border border-border hover:border-primary/30 hover:bg-primary/5 transition-all duration-200 text-sm"
        >
          <action.icon className="w-4 h-4 text-primary" />
          <span>{action.label}</span>
          <Sparkles className="w-3 h-3 text-primary/60" />
        </button>
      ))}
    </div>
  );
}
