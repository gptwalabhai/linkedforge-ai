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
  type LucideIcon,
} from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandInput } from "@/components/ui/command";
import { useRouter } from "next/navigation";

interface CommandMenuItem {
  label: string;
  icon: LucideIcon;
  href?: string;
  shortcut?: string;
  action?: () => void;
}

const navigationCommands: CommandMenuItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard", shortcut: "G D" },
  { label: "AI Studio", icon: Sparkles, href: "/ai-studio", shortcut: "G A" },
  { label: "Posts", icon: FileText, href: "/posts", shortcut: "G P" },
  { label: "Calendar", icon: CalendarDays, href: "/calendar", shortcut: "G C" },
  { label: "Analytics", icon: BarChart3, href: "/analytics", shortcut: "G N" },
  { label: "Settings", icon: Settings, href: "/settings", shortcut: "G S" },
  { label: "Support", icon: LifeBuoy, href: "/support", shortcut: "G H" },
];

const contentCommands: CommandMenuItem[] = [
  { label: "New Post", icon: FileText, action: () => console.log("New Post") },
  { label: "New Carousel", icon: Image, action: () => console.log("New Carousel") },
  { label: "New Video Script", icon: Video, action: () => console.log("New Video Script") },
  { label: "New Email", icon: Mail, action: () => console.log("New Email") },
];

interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
  const router = useRouter();

  const handleNavigation = (href?: string, action?: () => void) => {
    onOpenChange(false);
    if (href) {
      router.push(href);
    } else if (action) {
      action();
    }
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        {/* Navigation group */}
        <CommandGroup heading="Navigation">
          {navigationCommands.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={() => handleNavigation(item.href, item.action)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
              {item.shortcut && (
                <span className="ml-auto text-xs tracking-widest text-muted-foreground">
                  {item.shortcut}
                </span>
              )}
            </CommandItem>
          ))}
        </CommandGroup>

        {/* Content Types group */}
        <CommandGroup heading="Content Types">
          {contentCommands.map((item) => (
            <CommandItem
              key={item.label}
              onSelect={() => handleNavigation(item.href, item.action)}
            >
              <item.icon className="mr-2 h-4 w-4" />
              <span>{item.label}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
