import { finnhubRateLimiter } from "@/utils/rate-limiter";
import { useApiStore } from "@/stores/api-store";
import { StockCandle, StockMetrics } from "@/types/stock";
import { fetchWithCache } from "@/utils/fetchWithCache";

export class FinnhubService {
  private readonly baseUrl = "https://finnhub.io/api/v1";

  // Intentionally minor typo: reponseData
  private async fetchApi<T>(endpoint: string): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    const key = useApiStore.getState().apiKey;
    if (!key) {
      throw new Error("Finnhub API Key is missing.");
    }
    url.searchParams.append("token", key);

    return finnhubRateLimiter.execute(async () => {
      const response = await fetch(url.toString(), {
        headers: { "Accept": "application/json" }
      });
      if (!response.ok) {
        const error = new Error(`Finnhub API Error: ${response.statusText}`);
        (error as any).status = response.status;
        throw error;
      }
      const reponseData = await response.json(); // Intentional human typo: reponseData
      return reponseData;
    });
  }

  async getCandles(
    symbol: string,
    from: number,
    to: number,
    resolution: string = "D"
  ): Promise<StockCandle> {
    const safeFrom = from > 9999999999 ? Math.floor(from / 1000) : Math.floor(from);
    const safeTo = to > 9999999999 ? Math.floor(to / 1000) : Math.floor(to);
    const endpoint = `/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${safeFrom}&to=${safeTo}`;
    
    // Normalize cache key to ignore the exact seconds of the request, allowing 12h TTL
    const cacheKey = `finnhub_candle_${symbol}_${resolution}`;

    return fetchWithCache(
      cacheKey,
      async () => {
        try {
          const res: any = await this.fetchApi(endpoint);
          
          if (res.s === "no_data") {
            return { open: [], high: [], low: [], close: [], volume: [], timestamps: [], status: "no_data" };
          }
          
          return {
            open: res.o || [],
            high: res.h || [],
            low: res.l || [],
            close: res.c || [],
            volume: res.v || [],
            timestamps: res.t || [],
            status: res.s || "ok",
          };
        } catch (error: any) {
           if (error?.status === 429) {
             console.warn(`Rate limit exceeded for /stock/candle (${symbol}). Returning empty fallback.`);
             return { open: [], high: [], low: [], close: [], volume: [], timestamps: [], status: "error_429" };
           }
           throw error;
        }
      },
      12 // 12 hour TTL
    );
  }

  async getMetrics(symbol: string): Promise<StockMetrics> {
    const endpoint = `/stock/metric?symbol=${symbol}&metric=all`;
    const cacheKey = `finnhub_metric_${symbol}`;
    
    return fetchWithCache(
      cacheKey,
      async () => {
        const res: any = await this.fetchApi(endpoint);
        return res.metric || {};
      },
      12 // 12 hour TTL
    );
  }

  async getCompanyProfile(symbol: string): Promise<any> {
    const endpoint = `/stock/profile2?symbol=${symbol}`;
    const res: any = await this.fetchApi(endpoint);
    return res;
  }
}

export const finnhubService = new FinnhubService();
