import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function Navbar({ transparent = false }: { transparent?: boolean }) {
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 ${transparent ? "bg-transparent" : "glass-strong"} border-b border-white/5`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-pink-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-lg">LinkedForge AI</span>
        </Link>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/signup">
            <Button variant="gradient" size="sm">Get Started</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
