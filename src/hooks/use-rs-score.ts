import { useState, useEffect } from "react";
import { finnhub } from "@/providers/finnhub-provider";
import { calculateRSScore } from "@/utils/rs-score";

export function useRsScore(symbol: string) {
  const [rsScore, setRsScore] = useState<number | null>(null);
  const [sparklineData, setSparklineData] = useState<number[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchRsData() {
      if (!symbol) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      // We want ~1 year of data timeframe bounds
      const to = Math.floor(Date.now() / 1000); // Current unix timestamp in seconds
      const from = to - (365 * 24 * 60 * 60); // Exactly 1 year ago

      try {
        // Fetch historical daily candles (resolution "D") for exactly the past year
        const [tickerCandles, spyCandles] = await Promise.all([
          finnhub.getCandles(symbol, from, to, "D"),
          finnhub.getCandles("SPY", from, to, "D")
        ]);

        if (isMounted) {
          const score = calculateRSScore(tickerCandles, spyCandles);
          setRsScore(score);
          // Intercept the final array to derive 30-day sparkline closes!
          setSparklineData(tickerCandles.close ? tickerCandles.close.slice(-30) : []);
        }
      } catch (err: any) {
        if (isMounted) {
          console.error(`Error calculating RS Score for ${symbol}:`, err);
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchRsData();

    return () => {
      isMounted = false;
    };
  }, [symbol]);

  return { rsScore, sparklineData, loading, error };
}
