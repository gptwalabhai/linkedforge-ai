"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Sparkles,
  FileText,
  CalendarDays,
  BarChart3,
  Settings,
  LifeBuoy,
  Image,
  Video,
  Mail,
  Shield,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  badge?: string | number;
}

const mainNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "AI Content Studio", icon: Sparkles, href: "/studio", badge: "Pro" },
  { label: "Post Library", icon: FileText, href: "/posts" },
  { label: "Content Calendar", icon: CalendarDays, href: "/calendar" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
];

const shortcutsNav: NavItem[] = [
  { label: "Post Creator", icon: FileText, href: "/studio?type=POST" },
  { label: "Carousel Builder", icon: Image, href: "/studio?type=CAROUSEL" },
  { label: "Video Scripts", icon: Video, href: "/studio?type=STORY" },
  { label: "Outreach Emails", icon: Mail, href: "/studio?type=COLD_OUTREACH" },
];

const systemNav: NavItem[] = [
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Admin Panel", icon: Shield, href: "/admin" },
  { label: "Support", icon: LifeBuoy, href: "/support" },
];

interface SidebarNavProps {
  collapsed?: boolean;
  className?: string;
}

function NavSection({ title, items, collapsed }: { title: string; items: NavItem[]; collapsed: boolean }) {
  const pathname = usePathname();

  return (
    <div className="mb-4">
      {!collapsed && (
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 block font-mono">
          {title}
        </span>
      )}
      <div className="space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href.includes("?") && pathname === item.href.split("?")[0]);
          const Icon = item.icon;

          const itemContent = (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2 text-xs font-medium transition-all duration-200",
                isActive
                  ? "bg-red-950/60 text-white font-bold border border-red-500/40 shadow-sm shadow-red-950"
                  : "text-slate-400 hover:text-white hover:bg-white/5",
                collapsed && "justify-center px-0 py-2.5"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-red-400" : "text-slate-400")} />
              {!collapsed && <span className="truncate">{item.label}</span>}
              {!collapsed && item.badge && (
                <span className="ml-auto inline-flex items-center rounded-full bg-red-950 px-2 py-0.5 text-[9px] font-bold font-mono text-red-300 border border-red-500/30">
                  {item.badge}
                </span>
              )}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.label} delayDuration={0}>
                <TooltipTrigger asChild>{itemContent}</TooltipTrigger>
                <TooltipContent side="right" className="bg-[#12121e] text-white border-red-900/40 font-medium">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          }

          return itemContent;
        })}
      </div>
    </div>
  );
}

export function SidebarNav({ collapsed = false, className }: SidebarNavProps) {
  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      <NavSection title="Core Workspace" items={mainNav} collapsed={collapsed} />
      <NavSection title="Quick Formats" items={shortcutsNav} collapsed={collapsed} />
      <NavSection title="System & Support" items={systemNav} collapsed={collapsed} />
    </nav>
  );
}
