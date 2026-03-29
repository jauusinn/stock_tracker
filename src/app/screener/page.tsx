import { SiteHeader } from "@/components/layout/site-header";
import { ApiModal } from "@/components/api-modal";
import { ScreenerDashboard } from "@/components/screener/screener-dashboard";

export default function ScreenerPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <SiteHeader />
      
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="mb-8">
           <h1 className="text-3xl font-bold tracking-tight">Stock Screener</h1>
           <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
             Discover high-momentum and value opportunities generated securely from your active watchlists.
           </p>
        </div>
        
        <ScreenerDashboard />
      </main>
      
      <ApiModal />
    </div>
  );
}
