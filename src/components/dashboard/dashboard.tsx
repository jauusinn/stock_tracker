"use client";

import { useWatchlist } from "@/hooks/use-watchlist";
import { StockCard } from "./stock-card";
import { AlertCircle } from "lucide-react";
import { ErrorBoundary } from "@/components/error-boundary";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { CompanyDetailsModal } from "./company-details-modal";
import { useState } from "react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 350, damping: 25 } }
};

export function Dashboard() {
  const { symbols, isHydrated, removeSymbol } = useWatchlist();
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRatings, setSelectedRatings] = useState<Record<string, any>>({});

  const handleCardClick = (symbol: string, ratings: any) => {
    setSelectedTicker(symbol);
    setSelectedRatings(ratings);
    setIsModalOpen(true);
  };

  const handleRemoveFromWatchlist = (sym: string) => {
    removeSymbol(sym);
    setIsModalOpen(false);
  };

  if (!isHydrated) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((n) => (
          <div key={`skeleton-${n}`} className="w-full h-48 bg-slate-100 dark:bg-slate-800 animate-pulse rounded-xl border border-slate-200 dark:border-slate-700" />
        ))}
      </div>
    );
  }

  if (symbols.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col items-center justify-center py-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl bg-slate-50 dark:bg-slate-900/50"
      >
        <div className="bg-white dark:bg-slate-800 p-4 rounded-full shadow-sm mb-4">
          <AlertCircle className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No stocks tracked yet</h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
          Use the search bar above to find and add your first stock to the tracking dashboard.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      <AnimatePresence mode="popLayout">
        {symbols.map((symbol) => (
          <motion.div 
            key={symbol} 
            variants={itemVariants}
            layout
            initial="hidden"
            animate="show"
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <ErrorBoundary symbol={symbol}>
              <StockCard symbol={symbol} onClick={(sym, ratings) => handleCardClick(sym, ratings)} />
            </ErrorBoundary>
          </motion.div>
        ))}
      </AnimatePresence>

      <CompanyDetailsModal 
        ticker={selectedTicker} 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onRemoveFromWatchlist={handleRemoveFromWatchlist}
        {...selectedRatings}
      />
    </motion.div>
  );
}
