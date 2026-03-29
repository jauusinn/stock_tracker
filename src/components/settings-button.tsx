"use client";

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useApiStore } from "@/stores/api-store";

export function SettingsButton() {
  const { setModalOpen } = useApiStore();
  
  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={() => setModalOpen(true)} 
      title="API Settings" 
      aria-label="API Settings"
      className="transition-colors border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800"
    >
      <Settings className="h-[1.2rem] w-[1.2rem] text-slate-600 dark:text-slate-400" aria-hidden="true" />
      <span className="sr-only">API Settings</span>
    </Button>
  );
}
