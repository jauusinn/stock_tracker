import { SiteHeader } from "@/components/layout/site-header";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
           <h1 className="text-3xl font-bold tracking-tight">Top-Down Sector Rotation</h1>
           <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
             Identifies the leading macroeconomic sector by absolute momentum inherently and sequentially queries the most resilient constituent stocks independently.
           </p>
        </div>

        <div className="space-y-6">
           <Card className="p-6 border-indigo-200 dark:border-indigo-900 shadow-sm bg-indigo-50/50 dark:bg-indigo-950/20 flex flex-col items-center justify-center gap-4 py-12">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent"></div>
              <p className="text-indigo-800 dark:text-indigo-300 font-medium animate-pulse text-center">
                Running top-down ETF macro evaluations extensively... <br />
                <span className="text-xs text-indigo-600/70 dark:text-indigo-400/70">Executing Yahoo Finance API logic recursively (This typically takes 5-10 seconds accurately)</span>
              </p>
           </Card>

           <div>
               <h2 className="text-xl font-bold mb-4 tracking-tight"><Skeleton className="h-7 w-64" /></h2>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {[1, 2, 3, 4].map(i => (
                   <Skeleton key={i} className="h-[148px] w-full rounded-xl" />
                 ))}
               </div>
           </div>
        </div>
      </main>
    </div>
  );
}
