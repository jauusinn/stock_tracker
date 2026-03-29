"use client";

import { useEffect, useState } from "react";
import { useWatchlistStore } from "@/stores/watchlist-store";
import { screenStocks } from "@/utils/StockScreener";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { CompanyDetailsModal } from "@/components/dashboard/company-details-modal";

export function ScreenerDashboard() {
  const activeWatchlist = useWatchlistStore((state) => state.symbols);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (symbol: string) => {
    setSelectedTicker(symbol);
    setIsModalOpen(true);
  };

  useEffect(() => {
    let isMounted = true;
    async function runScreener() {
      setLoading(true);
      try {
        const ranked = await screenStocks(activeWatchlist);
        if (isMounted) {
          setResults(ranked);
        }
      } catch (err) {
        console.error("Screener error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }
    
    if (activeWatchlist.length > 0) {
      runScreener();
    } else {
      setLoading(false);
    }

    return () => { isMounted = false; };
  }, [activeWatchlist]);

  if (activeWatchlist.length === 0) {
    return (
      <Card className="p-8 text-center text-slate-500 border-dashed">
        <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Your watchlist is empty.</p>
        <p className="text-sm mt-2">Search and add stocks from your Dashboard to see live screener rankings.</p>
      </Card>
    );
  }

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Skeleton key={i} className="h-32 w-full rounded-xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {results.map((item, idx) => {
        const { symbol, score, data } = item;
        return (
          <Card 
            key={symbol} 
            onClick={() => handleCardClick(symbol)} 
            className="overflow-hidden transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/50 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer"
          >
            <CardHeader className="py-4 bg-slate-50 dark:bg-slate-900/50 flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-400 font-bold text-sm shrink-0">
                  #{idx + 1}
                </div>
                <CardTitle className="text-xl font-bold tracking-tight">{symbol}</CardTitle>
              </div>
              <Badge variant={score >= 10 ? "default" : "secondary"} className={`text-sm px-3 py-1 ${score >= 10 ? 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-600 dark:hover:bg-indigo-700' : ''}`}>
                Total Score: {score}
              </Badge>
            </CardHeader>
            <CardContent className="py-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Current Price</p>
                  <p className="font-mono text-xl tracking-tight">${data.currentPrice.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">50-Day Moving Avg</p>
                  <div className="flex flex-col">
                    <p className="font-mono text-xl tracking-tight">${data.avg50Day.toFixed(2)}</p>
                    <p className="text-xs font-semibold mt-1">
                      {data.currentPrice > data.avg50Day ? (
                        <span className="text-emerald-600 dark:text-emerald-400">Trading Above (+10pt)</span>
                      ) : (
                        <span className="text-rose-600 dark:text-rose-400">Trading Below</span>
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">EPS Growth Target</p>
                  <div className="flex flex-col">
                    <p className="font-mono text-xl tracking-tight text-emerald-600 dark:text-emerald-400 capitalize">
                      {data.epsGrowth > 0 ? "Positive Growth" : "Negative Growth"}
                    </p>
                    {data.epsGrowth > 0 && <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-1">+5pt (Value Signal)</p>}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
      
      <CompanyDetailsModal 
        ticker={selectedTicker} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
