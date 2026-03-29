import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WatchlistState {
  symbols: string[];
  addSymbol: (symbol: string) => void;
  removeSymbol: (symbol: string) => void;
}

export const useWatchlistStore = create<WatchlistState>()(
  persist(
    (set) => ({
      symbols: ["AAPL", "MSFT", "GOOGL"], // Default initial watchlist
      addSymbol: (symbol) =>
        set((state) => ({
          // Only add if it doesn't already exist
          symbols: state.symbols.includes(symbol)
            ? state.symbols
            : [...state.symbols, symbol],
        })),
      removeSymbol: (symbol) =>
        set((state) => ({
          symbols: state.symbols.filter((s) => s !== symbol),
        })),
    }),
    {
      name: "stocks-tracker-watchlist",
    }
  )
);
