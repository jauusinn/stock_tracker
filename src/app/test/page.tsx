"use client";

import { useStockData } from "@/hooks/use-stock-data";
import { useWatchlist } from "@/hooks/use-watchlist";
import { useThemeStore } from "@/stores/theme-store";
import { useState, useEffect } from "react";

export default function TestPage() {
  const { data, loading, error } = useStockData("AAPL");
  const { symbols, addSymbol, removeSymbol, isHydrated } = useWatchlist();
  
  // Theme logic
  const toggleTheme = useThemeStore((state) => state.toggle);
  const isDarkState = useThemeStore((state) => state.isDark);
  // Avoid hydration mismatch for exactly what we render
  const [isDark, setIsDark] = useState(true);
  useEffect(() => setIsDark(isDarkState), [isDarkState]);

  return (
    <div className="p-8 font-mono min-h-screen text-slate-900 bg-white dark:bg-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Zustand & API Test</h1>
          <button 
            onClick={toggleTheme}
            className="px-4 py-2 bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 rounded transition-colors"
          >
            Toggle Theme ({isDark ? "Dark" : "Light"})
          </button>
        </div>
        
        <div className="mb-8 p-4 bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded transition-colors">
          <h2 className="text-xl font-bold mb-4">Watchlist Store</h2>
          {!isHydrated ? (
            <p className="text-slate-500">Loading watchlist from localStorage...</p>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {symbols.map(sym => (
                  <div key={sym} className="flex gap-2 items-center px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full">
                    <span>{sym}</span>
                    <button onClick={() => removeSymbol(sym)} className="hover:text-red-500 font-bold transition-colors">×</button>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => addSymbol("NVDA")}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors mr-2 flex-inline"
              >
                Add NVDA
              </button>
              <button 
                onClick={() => addSymbol("TSLA")}
                className="px-4 py-2 bg-slate-500 text-white rounded hover:bg-slate-600 transition-colors"
              >
                Add TSLA
              </button>
            </>
          )}
        </div>

        <h2 className="text-xl font-bold mb-4 border-t pt-8 border-slate-200 dark:border-slate-700">Provider & API Hook (AAPL)</h2>
        {loading && (
          <div className="p-4 bg-blue-50 text-blue-700 rounded-md dark:bg-blue-900/20 dark:text-blue-400">
            Loading data from Finnhub...
          </div>
        )}
        
        {error && (
          <div className="text-red-700 bg-red-50 p-4 rounded-md dark:bg-red-900/20 dark:text-red-400">
            <p className="font-bold">Error:</p>
            <pre className="text-sm mt-2 whitespace-pre-wrap">{error.message}</pre>
          </div>
        )}
        
        {data && (
          <div className="space-y-4">
            <div className="bg-slate-100 p-4 rounded-md dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 transition-colors">
              <pre className="text-xs overflow-auto">{JSON.stringify(data, null, 2)}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
