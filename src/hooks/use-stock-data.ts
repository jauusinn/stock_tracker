import { useState, useEffect } from "react";
import { finnhub } from "@/providers/finnhub-provider";
import { StockData } from "@/types/stock";

export function useStockData(symbol: string) {
  const [data, setData] = useState<StockData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function fetchData() {
      if (!symbol) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        // Fetch quote and profile concurrently
        const [quote, profile] = await Promise.all([
          finnhub.getQuote(symbol),
          finnhub.getProfile(symbol)
        ]);

        if (isMounted) {
          setData({
            symbol,
            quote,
            profile,
          });
        }
      } catch (err: any) {
        if (isMounted) {
          console.error(`Error fetching stock data for ${symbol}:`, err);
          setError(err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
    };
  }, [symbol]);

  return { data, loading, error };
}
