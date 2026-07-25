import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Flame } from "lucide-react";

export function Navbar({ transparent = false }: { transparent?: boolean }) {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${transparent ? "bg-transparent" : "glass-strong"} border-b border-red-900/20`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 flex items-center justify-center shadow-lg shadow-red-900/30 group-hover:scale-105 transition-transform duration-300">
            <Flame className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight text-white">
            Linked<span className="text-red-500">Forge</span> <span className="text-xs px-2 py-0.5 rounded-full bg-red-950/80 border border-red-500/30 text-red-400 font-mono">AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-white/5">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button variant="gradient" size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
