"use client";

import * as React from "react";
import { Menu, Bell, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarNav } from "./sidebar-nav";
import { CommandMenu } from "./command-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AppShell({ children, className, ...props }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [commandMenuOpen, setCommandMenuOpen] = React.useState(false);

  // Toggle command menu with keyboard shortcut
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey))) {
        e.preventDefault();
        setCommandMenuOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Collapse sidebar on mobile by default
  React.useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <TooltipProvider delayDuration={0}>
      <div className={cn("flex min-h-screen bg-background", className)} {...props}>
        {/* Sidebar */}
        <aside
          className={cn(
            "glass-strong border-r border-border flex flex-col transition-all duration-300",
            sidebarOpen ? "w-60" : "w-[70px]"
          )}
        >
          {/* Logo */}
          <div className="flex h-14 items-center px-4 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">A</span>
              </div>
              {sidebarOpen && (
                <span className="font-semibold text-lg">AIMS</span>
              )}
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4 px-3">
            <SidebarNav collapsed={!sidebarOpen} />
          </ScrollArea>

          {/* User section */}
          <div className="border-t border-border p-3 mt-auto">
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg p-2 hover:bg-accent transition-colors cursor-pointer",
                !sidebarOpen && "justify-center"
              )}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="https://avatar.vercel.sh/aims" />
                <AvatarFallback>AM</AvatarFallback>
              </Avatar>
              {sidebarOpen && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">Aisha Mwangi</p>
                  <p className="text-xs text-muted-foreground truncate">aisha@aims.com</p>
                </div>
              )}
              {sidebarOpen && (
                <Badge variant="secondary" className="text-[10px] shrink-0">
                  Pro
                </Badge>
              )}
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top bar */}
          <header className="glass-strong border-b border-border h-14 flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="hidden md:flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Workspace</span>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium">Dashboard</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Command palette trigger */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCommandMenuOpen(true)}
                className="hidden md:flex items-center gap-2 text-muted-foreground w-56 justify-start h-9"
              >
                <Search className="h-4 w-4" />
                <span className="text-sm">Search anything...</span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                  <span className="text-xs">Ctrl</span>+K
                </kbd>
              </Button>

              {/* Credits display */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs font-medium">2,450 credits</span>
              </div>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-destructive" />
              </Button>
            </div>
          </header>

          {/* Page content */}
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>

        {/* Command Menu */}
        <CommandMenu open={commandMenuOpen} onOpenChange={setCommandMenuOpen} />
      </div>
    </TooltipProvider>
  );
}
