"use client";

import { useEffect, useState } from "react";
import { useApiStore } from "@/stores/api-store";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { KeyRound, ExternalLink, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

export function ApiModal() {
  const { apiKey, setApiKey, isModalOpen, setModalOpen } = useApiStore();
  const [inputValue, setInputValue] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setInputValue(apiKey);
    if (!apiKey) {
      setModalOpen(true);
    }
  }, [apiKey, setModalOpen]);

  if (!mounted) return null;

  const handleSave = () => {
    if (!inputValue.trim()) {
      toast.error("Please enter a valid API key.");
      return;
    }
    setApiKey(inputValue.trim());
    setModalOpen(false);
    toast.success("API Key saved securely to your local storage!");
  };

  const isClosable = !!apiKey.trim();

  return (
    <Dialog open={isModalOpen} onOpenChange={(open) => {
      if (isClosable) setModalOpen(open);
    }}>
      <DialogContent className="sm:max-w-md border-slate-200 dark:border-slate-800">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="h-5 w-5 text-blue-500" />
            Finnhub API Key Required
          </DialogTitle>
          <DialogDescription>
            This decentralized dashboard connects continuously to live stock markets. You must provide your own completely free Data API Token to activate the engine natively.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900 border-dashed">
             <div className="flex flex-col gap-1 text-sm text-blue-800 dark:text-blue-300 pr-4">
               <span className="font-medium">Get a 100% Free API Key</span>
               <span>No credit card required. Permits 60 rapid backend requests per minute safely.</span>
             </div>
             <a href="https://finnhub.io/register" target="_blank" rel="noreferrer">
               <Button variant="outline" size="sm" className="shrink-0 bg-white dark:bg-slate-900 hover:text-blue-600 transition-colors border-slate-200 dark:border-slate-800 shadow-sm">
                 Register <ExternalLink className="ml-2 h-3 w-3" />
               </Button>
             </a>
          </div>

          <div className="space-y-2">
            <label htmlFor="apiKey" className="text-sm font-medium text-slate-700 dark:text-slate-300">
              Paste Finnhub Token String
            </label>
            <Input
              id="apiKey"
              type="password"
              placeholder="Paste your 64-bit Finnhub token here..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSave()}
              className="bg-slate-50 dark:bg-slate-900 focus-visible:ring-blue-500 border-slate-200 dark:border-slate-800"
            />
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2">
            <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />
            <p>Your API key executes strictly on your DOM local storage safely protecting your entire device hierarchy from centralized telemetry structures.</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-2">
          {isClosable && (
            <Button variant="ghost" className="hover:bg-slate-100 dark:hover:bg-slate-800" onClick={() => setModalOpen(false)}>Cancel</Button>
          )}
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors cursor-pointer">
            {isClosable ? "Update Dashboard Node" : "Activate Live UI System"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
