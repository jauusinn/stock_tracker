"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { finnhub } from "@/providers/finnhub-provider";
import { SymbolLookupInfo } from "@/types/stock";
import { useWatchlist } from "@/hooks/use-watchlist";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SymbolLookupInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { addSymbol } = useWatchlist();
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Debounced Finnhub search hook inline
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await finnhub.searchSymbols(query);
        // Filter out non-US stocks (ones containing dots) and limit to top 6
        const stocks = res.filter(r => !r.symbol.includes(".")).slice(0, 6);
        setResults(stocks);
        setIsOpen(true);
      } catch (err) {
        console.error("Finnhub search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 500); // 500ms debounce to protect rate limits

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (symbol: string) => {
    addSymbol(symbol);
    setQuery("");
    setIsOpen(false);
  };

  return (
    <div className="relative w-full max-w-md" ref={dropdownRef}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" aria-hidden="true" />
        <Input
          placeholder="Search for a ticker (e.g. AAPL)..."
          aria-label="Search for a stock ticker"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setIsOpen(true); }}
          className="pl-9 pr-4 bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 focus-visible:ring-1 focus-visible:ring-blue-500 h-10 shadow-sm transition-all"
        />
        {loading && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-slate-400" aria-hidden="true" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-lg overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <ul className="max-h-[300px] overflow-auto">
            {results.map((result) => (
              <li key={result.symbol}>
                <button
                  onClick={() => handleSelect(result.symbol)}
                  className="w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100 dark:border-slate-800/50 last:border-0 transition-colors flex justify-between items-center group"
                >
                  <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{result.symbol}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 truncate ml-4 max-w-[60%] text-right">
                    {result.description}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {isOpen && !loading && query && results.length === 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-lg p-4 text-center text-sm text-slate-500 z-50 animate-in fade-in">
          No matches found for "<span className="font-semibold text-slate-900 dark:text-white">{query}</span>"
        </div>
      )}
    </div>
  );
}
