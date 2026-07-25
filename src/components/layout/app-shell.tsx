"use client";

import * as React from "react";
import { Menu, Bell, Search, Flame, Zap, User, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { SidebarNav } from "./sidebar-nav";
import { CommandMenu } from "./command-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useSession } from "@/lib/auth-client";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface AppShellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/studio": "AI Content Studio",
  "/posts": "Post Library",
  "/calendar": "Content Calendar",
  "/analytics": "Growth Analytics",
  "/settings": "Settings",
  "/support": "Help & Support",
  "/admin": "Admin Control Panel",
};

export function AppShell({ children, className, ...props }: AppShellProps) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = React.useState(true);
  const [commandMenuOpen, setCommandMenuOpen] = React.useState(false);

  // Keyboard shortcut Ctrl+K / Cmd+K
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandMenuOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // Collapse sidebar on small screens
  React.useEffect(() => {
    const checkMobile = () => {
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const user = session?.user;
  const userName = user?.name || "Professional";
  const userEmail = user?.email || "user@linkedforge.ai";
  const userCredits = typeof (user as any)?.credits === "number" ? (user as any).credits : 50;
  const userRole = (user as any)?.role || "PRO";

  const currentPageTitle = pageTitles[pathname] || "Workspace";

  return (
    <TooltipProvider delayDuration={0}>
      <div className={cn("flex min-h-screen bg-[#050508] text-slate-100 font-sans selection:bg-red-600 selection:text-white", className)} {...props}>
        {/* Sidebar */}
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-40 lg:static glass-strong border-r border-red-900/20 flex flex-col transition-all duration-300 bg-[#08080e]/95",
            sidebarOpen ? "w-64 translate-x-0" : "w-[72px] -translate-x-full lg:translate-x-0"
          )}
        >
          {/* Logo */}
          <div className="flex h-16 items-center px-4 border-b border-red-900/20 justify-between">
            <Link href="/dashboard" className="flex items-center gap-3 group">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-900/40 group-hover:scale-105 transition-transform duration-300">
                <Flame className="h-5 w-5 text-white" />
              </div>
              {sidebarOpen && (
                <div className="flex flex-col">
                  <span className="font-bold text-lg leading-none tracking-tight text-white">
                    Linked<span className="text-red-500">Forge</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-widest mt-0.5 uppercase">AI ENGINE</span>
                </div>
              )}
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4 px-3">
            <SidebarNav collapsed={!sidebarOpen} />
          </ScrollArea>

          {/* User profile section */}
          <div className="border-t border-red-900/20 p-3 mt-auto bg-[#050508]/60">
            <Link href="/settings">
              <div
                className={cn(
                  "flex items-center gap-3 rounded-xl p-2 hover:bg-red-950/40 border border-transparent hover:border-red-500/20 transition-all duration-200 cursor-pointer",
                  !sidebarOpen && "justify-center"
                )}
              >
                <Avatar className="h-9 w-9 border border-red-500/30 shadow-md">
                  <AvatarImage src={user?.image || undefined} />
                  <AvatarFallback className="bg-red-950 text-red-400 font-bold text-xs">
                    {userName.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {sidebarOpen && (
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-white truncate">{userName}</p>
                    <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
                  </div>
                )}
                {sidebarOpen && (
                  <Badge variant="outline" className="text-[10px] bg-red-950/80 text-red-400 border-red-500/30 shrink-0 font-mono">
                    {userRole}
                  </Badge>
                )}
              </div>
            </Link>
          </div>
        </aside>

        {/* Backdrop for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header Bar */}
          <header className="glass-strong border-b border-red-900/20 h-16 flex items-center justify-between px-6 shrink-0 bg-[#08080e]/90">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="text-slate-300 hover:text-white hover:bg-red-950/40"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-slate-400">Workspace</span>
                <span className="text-slate-600">/</span>
                <span className="text-white font-bold tracking-tight">{currentPageTitle}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Command palette search */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCommandMenuOpen(true)}
                className="hidden md:flex items-center gap-2 border-red-900/30 bg-[#10101a] hover:bg-red-950/30 text-slate-400 hover:text-white w-60 justify-start h-9 rounded-xl"
              >
                <Search className="h-4 w-4 text-red-500" />
                <span className="text-xs">Search tools & content...</span>
                <kbd className="ml-auto pointer-events-none inline-flex h-5 items-center gap-0.5 rounded border border-red-900/40 bg-black px-1.5 font-mono text-[10px] font-medium text-slate-400">
                  Ctrl+K
                </kbd>
              </Button>

              {/* Live Credits Pill */}
              <Link href="/pricing">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 shadow-sm shadow-red-950 hover:border-red-500/70 transition-colors cursor-pointer">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-bold text-red-300 font-mono">{userCredits} Credits</span>
                  <Zap className="h-3 w-3 text-red-400" />
                </div>
              </Link>

              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative text-slate-300 hover:text-white hover:bg-red-950/40">
                <Bell className="h-5 w-5" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-ping" />
                <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500" />
              </Button>
            </div>
          </header>

          {/* Main Workspace Page View */}
          <main className="flex-1 overflow-auto p-4 md:p-8 bg-gradient-to-b from-[#050508] via-[#08080f] to-[#050508]">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>

        {/* Command Menu Modal */}
        <CommandMenu open={commandMenuOpen} onOpenChange={setCommandMenuOpen} />
      </div>
    </TooltipProvider>
  );
}
