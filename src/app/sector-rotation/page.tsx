import { SiteHeader } from "@/components/layout/site-header";
import { SectorScanner } from "@/utils/SectorScanner";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectorCardsList } from "@/components/sector-rotation/sector-cards-list";

// Enforce strict runtime execution dynamically to prevent build-time Yahoo Finance failures 
export const dynamic = 'force-dynamic'; 

export default async function SectorRotationPage() {
  const etfs = ['XLK', 'XLE', 'XLF', 'XLV', 'SOXX'];
  const sectorMomentumArray = await SectorScanner.getSectorMomentum(etfs);

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

        {sectorMomentumArray.length === 0 ? (
          <Card className="p-8 text-center text-slate-500 border-dashed">
             <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Analysis Failed</p>
             <p className="text-sm mt-2">Could not evaluate momentum calculations correctly across standard inputs.</p>
          </Card>
        ) : (
          <SectorCardsList sectorMomentumArray={sectorMomentumArray} />
        )}
      </main>
    </div>
  );
}
