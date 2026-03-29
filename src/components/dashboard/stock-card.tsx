"use client";

import { useStockData } from "@/hooks/use-stock-data";
import { useRatingEngine } from "@/hooks/use-rating-engine";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Sparkline } from "./sparkline";
import { motion } from "framer-motion";

export function StockCard({ symbol, onClick }: { symbol: string; onClick?: (symbol: string, ratings: any) => void }) {
  // Concurrent fetching explicitly abstracting Finnhub rate limits cleanly
  const { data, loading: quoteLoading, error: quoteError } = useStockData(symbol);
  const { rsRating, epsRating, smrRating, accDisRating, sparklineData, loading: rsLoading } = useRatingEngine(symbol);

  if (quoteLoading) {
    return (
      <Card className="w-full h-48 flex flex-col justify-between border-slate-200 dark:border-slate-800">
        <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
          <div>
            <Skeleton className="h-6 w-16 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-5 w-14 rounded-full" />
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-end mt-4">
            <div>
              <Skeleton className="h-8 w-24 mb-2" />
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-10 w-24" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (quoteError || !data) {
    return (
      <Card className="w-full h-48 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10">
        <CardHeader>
          <CardTitle className="text-red-700 dark:text-red-400">{symbol}</CardTitle>
          <CardDescription className="text-red-600 dark:text-red-500">Failed to load data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const { quote, profile } = data;
  const isPositive = quote.changePercent >= 0;

  // Render Badges Dynamically Colored
  const renderBadges = () => {
    if (rsLoading) {
      return (
        <div className="flex flex-wrap gap-1 justify-end max-w-[60%]">
          <Skeleton className="h-5 w-12 rounded-full" />
          <Skeleton className="h-5 w-12 rounded-full" />
        </div>
      );
    }
    
    // IBD Percentile Color Logic Configuration
    const getScoreColor = (score: number | string | null | undefined) => {
      if (!score || score === "N/A") return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:border-slate-700";
      if (typeof score === 'number') {
        if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800";
        if (score >= 50) return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800";
      }
      return "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800";
    };

    const getGradeColor = (grade: string | null | undefined) => {
      if (!grade) return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:border-slate-700";
      if (grade === "A" || grade === "B") return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800";
      if (grade === "C") return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800";
      return "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800";
    };

    return (
      <div className="flex flex-wrap gap-1 justify-end max-w-[65%] shrink-0">
        <Badge variant="outline" className={`${getScoreColor(rsRating)} font-mono text-[10px] px-1.5 py-0 h-5 whitespace-nowrap cursor-help`} title="RS Rating">
          RS: {rsRating || "--"}
        </Badge>
        <Badge variant="outline" className={`${getScoreColor(epsRating)} font-mono text-[10px] px-1.5 py-0 h-5 whitespace-nowrap cursor-help`} title="EPS Rating">
          EPS: {epsRating || "--"}
        </Badge>
        <Badge variant="outline" className={`${getGradeColor(smrRating)} font-mono text-[10px] px-1.5 py-0 h-5 whitespace-nowrap cursor-help`} title="SMR Rating">
          SMR: {smrRating || "-"}
        </Badge>
        <Badge variant="outline" className={`${getGradeColor(accDisRating)} font-mono text-[10px] px-1.5 py-0 h-5 whitespace-nowrap cursor-help`} title="Acc/Dis Rating">
          A/D: {accDisRating || "-"}
        </Badge>
      </div>
    );
  };

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ type: "spring", stiffness: 400, damping: 25 }} className="h-full" onClick={() => onClick && onClick(symbol, { rsRating, epsRating, smrRating, accDisRating })} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <Card className="w-full h-full overflow-hidden transition-all duration-200 hover:shadow-md dark:hover:shadow-slate-800/50 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <CardHeader className="pb-2 flex flex-row items-start justify-between space-y-0">
          <div className="flex-1 min-w-0 pr-2">
            <CardTitle className="text-xl font-bold tracking-tight">{symbol}</CardTitle>
            <CardDescription className="text-xs truncate max-w-full mt-1" title={profile.name || "Unknown Company"}>
              {profile.name || "Unknown Company"}
            </CardDescription>
          </div>
          
          {renderBadges()}
        </CardHeader>
        
        <CardContent>
          <div className="flex justify-between items-end mt-4">
            <div>
              <div className="text-2xl font-bold tracking-tight font-mono">
                ${quote.current?.toFixed(2) || "0.00"}
              </div>
              <div className={`flex items-center text-sm font-medium mt-1 transition-colors ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {isPositive ? <TrendingUp className="w-3.5 h-3.5 mr-1" aria-hidden="true" /> : <TrendingDown className="w-3.5 h-3.5 mr-1" aria-hidden="true" />}
                {isPositive ? "+" : ""}{quote.changePercent?.toFixed(2) || "0.00"}%
              </div>
            </div>
            
            {/* Recharts Minimalist Sparkline Engine */}
            <div className="h-10 w-24 rounded flex items-center justify-center">
               {rsLoading ? (
                 <Skeleton className="h-10 w-24" />
               ) : (
                 <Sparkline data={sparklineData} isPositive={isPositive} />
               )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
