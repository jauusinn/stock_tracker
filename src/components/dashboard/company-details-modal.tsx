"use client";

import { useState, useEffect } from "react";
import { finnhubService } from "@/services/FinnhubService";
import { CompanyProfile } from "@/types/stock";
import { useRatingEngine } from "@/hooks/use-rating-engine";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Globe, Building2, CircleDollarSign, Hash, LineChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CompanyDetailsModalProps {
  ticker: string | null;
  isOpen: boolean;
  onClose: () => void;
  rsRating?: number | string | null;
  epsRating?: number | string | null;
  smrRating?: string | null;
  accDisRating?: string | null;
}

export function CompanyDetailsModal({ ticker, isOpen, onClose, rsRating, epsRating, smrRating, accDisRating }: CompanyDetailsModalProps) {
  const [profile, setProfile] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const shouldFetchRatings = isOpen && rsRating === undefined && !!ticker;
  const engineResult = useRatingEngine(shouldFetchRatings ? ticker || "" : "");

  const displayRs = rsRating !== undefined ? rsRating : engineResult.rsRating;
  const displayEps = epsRating !== undefined ? epsRating : engineResult.epsRating;
  const displaySmr = smrRating !== undefined ? smrRating : engineResult.smrRating;
  const displayAccDis = accDisRating !== undefined ? accDisRating : engineResult.accDisRating;
  const isEngineLoading = shouldFetchRatings && engineResult.loading;

  useEffect(() => {
    if (!ticker || !isOpen) return;
    
    let isMounted = true;
    const fetchProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await finnhubService.getCompanyProfile(ticker);
        if (isMounted) setProfile(data);
      } catch (err: any) {
        if (isMounted) setError(err.message || "Failed to fetch company profile");
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    
    fetchProfile();
    
    return () => { isMounted = false; };
  }, [ticker, isOpen]);

  const getScoreColor = (score: number | string | null | undefined) => {
    if (!score || score === "N/A") return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:border-slate-700";
    if (typeof score === 'number') {
      if (score >= 80) return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800";
      if (score >= 50) return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800";
    }
    return "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800";
  };

  const getGradeColor = (grade: string | null | undefined) => {
    if (!grade || grade === "N/A") return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:border-slate-700";
    if (grade === "A" || grade === "B") return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800";
    if (grade === "C") return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800";
    return "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-800";
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800">
        <DialogHeader>
          {loading ? (
            <div className="flex items-center gap-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div>
                <Skeleton className="h-6 w-32 mb-2" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          ) : error ? (
            <DialogTitle className="text-rose-600 dark:text-rose-400">Error Loading Profile</DialogTitle>
          ) : profile ? (
            <div className="flex items-center gap-4">
              {profile.logo ? (
                 <img src={profile.logo} alt={profile.name} className="w-12 h-12 rounded-full object-contain border border-slate-200 dark:border-slate-800 bg-white" />
              ) : (
                 <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                    <Building2 className="w-6 h-6 text-slate-400" />
                 </div>
              )}
              <div className="flex flex-col items-start overflow-hidden">
                 <DialogTitle className="text-xl font-bold tracking-tight truncate w-full">{profile.name}</DialogTitle>
                 <DialogDescription className="text-sm font-medium text-slate-500 dark:text-slate-400">{profile.ticker}</DialogDescription>
              </div>
            </div>
          ) : (
             <DialogTitle>Loading Profile...</DialogTitle>
          )}
        </DialogHeader>

        <div className="py-4">
          {loading ? (
            <div className="grid grid-cols-2 gap-4">
               {[1,2,3].map(i => <Skeleton key={i} className={`h-16 w-full rounded-xl ${i === 3 ? 'col-span-2' : ''}`} />)}
            </div>
          ) : error ? (
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 text-center py-4">{error}</p>
          ) : profile ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50">
                <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Industry Mapping</p>
                <p className="text-sm font-semibold truncate tracking-tight text-slate-900 dark:text-slate-100" title={profile.finnhubIndustry || profile.industry}>
                   {profile.finnhubIndustry || profile.industry || "Unknown"}
                </p>
              </div>
              
              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-1 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50">
                <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><CircleDollarSign className="w-3.5 h-3.5" /> Market Cap</p>
                <p className="text-sm font-semibold tracking-tight text-slate-900 dark:text-slate-100 flex items-baseline">
                   ${profile.marketCapitalization ? (profile.marketCapitalization / 1000).toFixed(2) + "B" : ((profile.marketCap || 0) / 1000).toFixed(2) + "B"}
                </p>
              </div>

              <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-1 col-span-2 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800/50">
                <p className="text-xs font-semibold text-slate-500 flex items-center gap-1.5"><Hash className="w-3.5 h-3.5" /> Shares Outstanding</p>
                <p className="text-sm font-semibold font-mono text-slate-900 dark:text-slate-100">
                   {profile.shareOutstanding ? profile.shareOutstanding.toLocaleString() + "M" : "Data N/A"}
                </p>
              </div>
              
              {/* Ratings 2x2 Grid */}
              {(displayRs !== undefined || displayEps !== undefined || displaySmr !== undefined || displayAccDis !== undefined || isEngineLoading) && (
                <div className="col-span-2 grid grid-cols-2 gap-3 mt-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  {isEngineLoading ? (
                    <>
                      {[1,2,3,4].map(i => <Skeleton key={`rs-skel-${i}`} className="h-[62px] w-full rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950" />)}
                    </>
                  ) : (
                    <>
                      <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <p className="text-xs font-semibold text-slate-500">Relative Strength</p>
                        <div className="flex items-center gap-2">
                           <Badge variant="outline" className={`${getScoreColor(displayRs)} font-mono text-xs px-2 py-0.5 whitespace-nowrap`}>
                              {displayRs || "N/A"}
                           </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <p className="text-xs font-semibold text-slate-500">EPS Growth</p>
                        <div className="flex items-center gap-2">
                           <Badge variant="outline" className={`${getScoreColor(displayEps)} font-mono text-xs px-2 py-0.5 whitespace-nowrap`}>
                              {displayEps || "N/A"}
                           </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <p className="text-xs font-semibold text-slate-500">Sales, Margins & ROE</p>
                        <div className="flex items-center gap-2">
                           <Badge variant="outline" className={`${getGradeColor(displaySmr)} font-mono text-xs px-2 py-0.5 whitespace-nowrap`}>
                              {displaySmr || "N/A"}
                           </Badge>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50">
                        <p className="text-xs font-semibold text-slate-500">Accumulation/Dist</p>
                        <div className="flex items-center gap-2">
                           <Badge variant="outline" className={`${getGradeColor(displayAccDis)} font-mono text-xs px-2 py-0.5 whitespace-nowrap`}>
                              {displayAccDis || "N/A"}
                           </Badge>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          ) : null}
        </div>

        {(!loading && (profile || ticker)) && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-col gap-2">
             {profile?.weburl && (
               <a href={profile.weburl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors py-2.5 bg-white dark:bg-slate-950 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-700 shadow-sm">
                  <Globe className="w-4 h-4" /> View Official Website
               </a>
             )}
             <a href={`https://www.tradingview.com/chart/?symbol=${ticker}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center w-full gap-2 text-sm font-bold text-white transition-colors py-2.5 bg-blue-600 dark:bg-blue-600 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500 shadow-md">
                <LineChart className="w-4 h-4" /> View Chart on TradingView
             </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
