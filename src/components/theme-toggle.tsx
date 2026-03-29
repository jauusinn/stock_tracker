"use client";

import { useThemeStore } from "@/stores/theme-store";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { isDark, toggle } = useThemeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled aria-label="Toggle theme" className="border-slate-200 dark:border-slate-800 opacity-50">
        <Sun className="h-[1.2rem] w-[1.2rem] text-transparent" aria-hidden="true" />
        <span className="sr-only">Toggle theme placeholder</span>
      </Button>
    );
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={toggle} 
      title="Toggle Theme" 
      aria-label="Toggle Theme"
      className="transition-colors border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      {isDark ? (
        <Sun className="h-[1.2rem] w-[1.2rem] text-slate-100" aria-hidden="true" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] text-slate-900" aria-hidden="true" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
