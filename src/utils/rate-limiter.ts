export class RateLimiter {
  private tokens: number;
  private lastRefillTime: number;
  private readonly maxTokens: number;
  private readonly refillRatePerMs: number;

  constructor(maxTokens = 60, refillIntervalMs = 60000) {
    this.maxTokens = maxTokens;
    this.tokens = maxTokens;
    this.refillRatePerMs = maxTokens / refillIntervalMs;
    this.lastRefillTime = Date.now();
  }

  private refill() {
    const now = Date.now();
    const timePassed = now - this.lastRefillTime;
    const tokensToAdd = timePassed * this.refillRatePerMs;
    
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
    this.lastRefillTime = now;
  }

  private async waitForToken(): Promise<void> {
    while (true) {
      this.refill();
      if (this.tokens >= 1) {
        this.tokens -= 1;
        return;
      }
      // Wait for at least 1 token to be ready
      const timeToWait = Math.max(10, Math.ceil((1 - this.tokens) / this.refillRatePerMs));
      await new Promise((resolve) => setTimeout(resolve, timeToWait));
    }
  }

  /**
   * Executes the given async function, respecting the rate limit.
   * Also automatically retries on 429 errors with exponential backoff.
   */
  async execute<T>(fn: () => Promise<T>, retries = 3, backoffTime = 2000): Promise<T> {
    await this.waitForToken();
    try {
      return await fn();
    } catch (error: any) {
      if (error?.status === 429 && retries > 0) {
        if (typeof window !== "undefined") {
           import("sonner").then((mod) => {
             mod.toast.warning("API Payload Overload", {
               description: `Finnhub 429 limit reached. Retrying natively in ${backoffTime}ms...`,
               duration: 4000,
             });
           });
        }
        console.warn(`Rate limit hit! Retrying in ${backoffTime}ms...`);
        await new Promise((resolve) => setTimeout(resolve, backoffTime));
        return this.execute(fn, retries - 1, backoffTime * 2);
      }
      throw error;
    }
  }
}

// Global default rate limiter instance for the app
// Finnhub Free Tier allows 60 api calls/minute
export const finnhubRateLimiter = new RateLimiter(60, 60000);
