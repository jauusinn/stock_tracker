"use client";

import { useState, useEffect } from "react";
import { SectorStockPerformance } from "@/utils/SectorScanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CompanyDetailsModal } from "@/components/dashboard/company-details-modal";
import { fetchTopPerformers } from "@/app/actions/sector-actions";

interface SectorCardsListProps {
  sectorMomentumArray: Array<{ ticker: string; momentum: number }>;
}

export function SectorCardsList({ sectorMomentumArray }: SectorCardsListProps) {
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeSector, setActiveSector] = useState(sectorMomentumArray[0]?.ticker || "");
  const [topPerformers, setTopPerformers] = useState<SectorStockPerformance[]>([]);
  const [loadingStocks, setLoadingStocks] = useState(false);

  useEffect(() => {
    if (!activeSector) return;
    let isMounted = true;
    const fetchStocks = async () => {
      setLoadingStocks(true);
      try {
        const results = await fetchTopPerformers(activeSector);
        if (isMounted) setTopPerformers(results);
      } catch (err) {
        console.error("Failed to fetch top performers action", err);
      } finally {
        if (isMounted) setLoadingStocks(false);
      }
    };
    fetchStocks();
    return () => { isMounted = false; };
  }, [activeSector]);

  const handleCardClick = (symbol: string) => {
    setSelectedTicker(symbol);
    setIsModalOpen(true);
  };

  const getMomentumColor = (momentum: number) => {
    if (momentum >= 10) return "bg-emerald-700 text-white border-emerald-800";
    if (momentum >= 5) return "bg-emerald-500 text-white border-emerald-600";
    if (momentum > 0) return "bg-emerald-300 text-emerald-900 border-emerald-400";
    if (momentum === 0) return "bg-slate-200 text-slate-900 border-slate-300";
    if (momentum < 0 && momentum > -5) return "bg-red-300 text-red-900 border-red-400";
    if (momentum <= -10) return "bg-red-700 text-white border-red-800";
    return "bg-red-500 text-white border-red-600"; // <= -5
  };

  return (
    <div className="space-y-6">
      <div className="flex space-x-4 overflow-x-auto p-4 -mx-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {sectorMomentumArray.map((sector) => {
          const isActive = sector.ticker === activeSector;
          return (
            <button
              key={sector.ticker}
              onClick={() => setActiveSector(sector.ticker)}
              className={`flex-shrink-0 px-4 py-3 rounded-xl border font-bold text-sm transition-all focus:outline-none 
                ${getMomentumColor(sector.momentum)}
                ${isActive ? "ring-2 ring-offset-2 ring-blue-500 dark:ring-offset-slate-950 shadow-md scale-105" : "opacity-80 hover:opacity-100 hover:scale-105"}`}
            >
              <div className="flex flex-col items-center gap-1">
                <span>{sector.ticker}</span>
                <span className="text-xs font-mono">{sector.momentum > 0 ? "+" : ""}{sector.momentum}%</span>
              </div>
            </button>
          );
        })}
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 tracking-tight">Top 5 Momentum Stocks Residing in {activeSector}</h2>
        
        {loadingStocks ? (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {[1,2,3,4,5].map(i => <Skeleton key={i} className="w-full h-36 rounded-xl border-slate-200 dark:border-slate-800" />)}
           </div>
        ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {topPerformers.map((stock, i) => (
               <Card 
                 key={stock.ticker} 
                 onClick={() => handleCardClick(stock.ticker)}
                 className="overflow-hidden transition-all duration-200 hover:shadow-md border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 cursor-pointer"
               >
                 <CardHeader className="py-4 bg-slate-50 dark:bg-slate-900/50 flex flex-row items-center justify-between border-b border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300 font-bold text-sm shrink-0">
                        #{i + 1}
                      </div>
                      <CardTitle className="text-lg font-bold tracking-tight">{stock.ticker}</CardTitle>
                    </div>
                    <Badge variant={stock["30DayMomentum"] > 0 ? "default" : "secondary"}>
                       {stock["30DayMomentum"]}% Mo.
                    </Badge>
                 </CardHeader>
                 <CardContent className="py-4">
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Company Entity</p>
                    <p className="truncate font-semibold mb-3 tracking-tight" title={stock.companyName}>{stock.companyName}</p>
                    
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">Current Trading Price</p>
                    <p className="font-mono text-xl tracking-tight text-emerald-600 dark:text-emerald-400 font-semibold">${stock.currentPrice.toFixed(2)}</p>
                 </CardContent>
               </Card>
             ))}
           </div>
        )}
      </div>
      
      <CompanyDetailsModal 
        ticker={selectedTicker} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
