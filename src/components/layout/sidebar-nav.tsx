"use client";

import * as React from "react";
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
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface NavItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  badge?: string | number;
  children?: NavItem[];
}

const workspaceNav: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "AI Studio", icon: Sparkles, href: "/ai-studio", badge: "New" },
  { label: "Posts", icon: FileText, href: "/posts" },
  { label: "Calendar", icon: CalendarDays, href: "/calendar" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
];

const contentTypesNav: NavItem[] = [
  { label: "Posts", icon: FileText, href: "/content/posts" },
  { label: "Carousels", icon: Image, href: "/content/carousels" },
  { label: "Videos", icon: Video, href: "/content/videos" },
  { label: "Emails", icon: Mail, href: "/content/emails" },
];

const moreNav: NavItem[] = [
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Support", icon: LifeBuoy, href: "/support" },
];

interface SidebarNavProps {
  collapsed?: boolean;
  className?: string;
}

interface NavGroupProps {
  title: string;
  items: NavItem[];
  collapsed: boolean;
}

function NavGroup({ title, items, collapsed }: NavGroupProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = React.useState(true);

  if (collapsed) {
    return (
      <div className="mb-2">
        {items.map((item) => (
          <Tooltip key={item.label} delayDuration={0}>
            <TooltipTrigger asChild>
              <a
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                  pathname === item.href
                    ? "bg-accent text-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
              </a>
            </TooltipTrigger>
            <TooltipContent side="right" className="flex items-center gap-2">
              <span>{item.label}</span>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  }

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between px-3 mb-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        {items.length > 1 && (
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <button className="rounded p-0.5 hover:bg-accent transition-colors">
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 text-muted-foreground transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {items.map((item) => (
                <NavItemLink
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  collapsed={collapsed}
                />
              ))}
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
      {items.length <= 1 &&
        items.map((item) => (
          <NavItemLink
            key={item.label}
            item={item}
            pathname={pathname}
            collapsed={collapsed}
          />
        ))}
    </div>
  );
}

function NavItemLink({
  item,
  pathname,
  collapsed,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
}) {
  const isActive = pathname === item.href;

  const content = (
    <a
      href={item.href}
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm transition-all duration-200",
        isActive
          ? "bg-accent text-foreground font-medium shadow-sm"
          : "text-muted-foreground hover:text-foreground hover:bg-accent/50",
        collapsed && "justify-center"
      )}
    >
      <div className="flex items-center gap-3">
        <item.icon
          className={cn(
            "h-5 w-5 shrink-0 transition-colors",
            isActive && "text-primary"
          )}
        />
        {!collapsed && <span>{item.label}</span>}
      </div>
      {!collapsed && item.badge && (
        <span
          className={cn(
            "ml-auto inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium",
            isActive ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          )}
        >
          {item.badge}
        </span>
      )}
    </a>
  );

  if (collapsed) {
    return (
      <Tooltip key={item.label} delayDuration={0}>
        <TooltipTrigger asChild>{content}</TooltipTrigger>
        <TooltipContent side="right" className="flex items-center gap-2">
          <span>{item.label}</span>
          {item.badge && (
            <span className="ml-1 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-medium text-primary-foreground">
              {item.badge}
            </span>
          )}
        </TooltipContent>
      </Tooltip>
    );
  }

  return content;
}

export function SidebarNav({ collapsed = false, className }: SidebarNavProps) {
  return (
    <nav className={cn("flex flex-col gap-1", className)}>
      <NavGroup title="Workspace" items={workspaceNav} collapsed={collapsed} />

      {!collapsed && (
        <div className="my-2 border-t border-border" />
      )}

      <NavGroup title="Content Types" items={contentTypesNav} collapsed={collapsed} />

      {!collapsed && (
        <div className="my-2 border-t border-border" />
      )}

      <NavGroup title="More" items={moreNav} collapsed={collapsed} />
    </nav>
  );
}
