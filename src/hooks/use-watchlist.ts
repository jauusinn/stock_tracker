import { useState, useEffect } from "react";
import { useWatchlistStore } from "@/stores/watchlist-store";

export function useWatchlist() {
  const [isHydrated, setIsHydrated] = useState(false);
  
  const symbols = useWatchlistStore((state) => state.symbols);
  const addSymbol = useWatchlistStore((state) => state.addSymbol);
  const removeSymbol = useWatchlistStore((state) => state.removeSymbol);

  // Next.js (SSR) hydration mismatch fix
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return {
    symbols: isHydrated ? symbols : [], // Return empty array during SSR to match initial html
    addSymbol,
    removeSymbol,
    isHydrated,
  };
}
