"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SearchBar } from "@/components/search/search-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { SettingsButton } from "@/components/settings-button";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center font-bold text-white shrink-0 shadow-sm shadow-blue-500/20">
              ST
            </div>
            <span className="font-bold text-lg hidden sm:inline-block tracking-tight">Stocks<span className="text-blue-600 dark:text-blue-500">Tracker</span></span>
          </Link>

          <nav className="hidden md:flex items-center gap-4 text-sm font-medium">
            <Link 
              href="/" 
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/" ? "text-foreground" : "text-foreground/50"
              )}
            >
              Dashboard
            </Link>
            <Link 
              href="/screener" 
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/screener" ? "text-foreground" : "text-foreground/50"
              )}
            >
              Screener
            </Link>
            <Link 
              href="/sector-rotation" 
              className={cn(
                "transition-colors hover:text-foreground/80",
                pathname === "/sector-rotation" ? "text-foreground" : "text-foreground/50"
              )}
            >
              Sector Rotation
            </Link>
          </nav>
        </div>
        
        <div className="flex-1 max-w-xl flex justify-center px-4">
          <SearchBar />
        </div>
        
        <div className="flex items-center gap-2 shrink-0">
          <SettingsButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
