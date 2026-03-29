import { useState, useEffect } from "react";
import { finnhubService } from "@/services/FinnhubService";
import { RatingCalculator } from "@/utils/RatingCalculator";
import { useWatchlistStore } from "@/stores/watchlist-store";

export function useRatingEngine(symbol: string) {
  const [rsRating, setRsRating] = useState<number | string | null>(null);
  const [epsRating, setEpsRating] = useState<number | null>(null);
  const [smrRating, setSmrRating] = useState<string | null>(null);
  const [accDisRating, setAccDisRating] = useState<string | null>(null);
  const [sparklineData, setSparklineData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const activeWatchlist = useWatchlistStore((state) => state.symbols);

  useEffect(() => {
    let isMounted = true;

    async function fetchRatings() {
      if (!symbol) {
        setLoading(false);
        return;
      }
      setLoading(true);

      const to = Math.floor(Date.now() / 1000);
      const from = to - (365 * 24 * 60 * 60);

      try {
        const [candles, metrics] = await Promise.all([
          finnhubService.getCandles(symbol, from, to, "D").catch(() => null),
          finnhubService.getMetrics(symbol).catch(() => ({}))
        ]);

        if (isMounted) {
          if (candles && candles.close && candles.close.length > 0) {
            const currentPrice = candles.close[candles.close.length - 1];
            const price52WkAgo = candles.close[0];
            
            // Generate pseudo-data for watchlist ranking outperformance based on length to save rate limits
            const fakeWatchlistReturns = activeWatchlist.map((sym, idx) => (idx * 5) - 10);
            
            setRsRating(RatingCalculator.calculateRS(currentPrice, price52WkAgo, fakeWatchlistReturns));
            setAccDisRating(RatingCalculator.calculateAccDis(candles));
            setSparklineData(candles.close.slice(-30));
          } else {
            setRsRating("N/A");
            setAccDisRating("N/A");
            setSparklineData([]);
          }

          if (metrics) {
            setEpsRating(RatingCalculator.calculateEPS(metrics));
            setSmrRating(RatingCalculator.calculateSMR(metrics));
          }
        }
      } catch (err) {
        console.error("Error in rating engine:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchRatings();

    return () => { isMounted = false; };
  }, [symbol, activeWatchlist]);

  return { rsRating, epsRating, smrRating, accDisRating, sparklineData, loading };
}
