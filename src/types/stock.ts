// ─── Stock Quote (real-time / latest price data) ─────────────────────
export interface Quote {
  /** Current price */
  current: number;
  /** Highest price of the day */
  high: number;
  /** Lowest price of the day */
  low: number;
  /** Open price of the day */
  open: number;
  /** Previous close price */
  previousClose: number;
  /** Percentage change from previous close */
  changePercent: number;
  /** Absolute change from previous close */
  change: number;
  /** Unix timestamp of last update */
  timestamp: number;
}

// ─── Company Profile ─────────────────────────────────────────────────
export interface CompanyProfile {
  /** Stock ticker symbol (e.g. "AAPL") */
  ticker: string;
  /** Full company name */
  name: string;
  /** Company logo URL */
  logo: string;
  /** Industry sector */
  industry: string;
  /** 2-letter country code */
  country: string;
  /** Market capitalization */
  marketCap: number;
  /** Primary exchange (e.g. "NASDAQ") */
  exchange: string;
  /** Company website URL */
  weburl: string;
  /** Primary Finnhub industry */
  finnhubIndustry?: string;
  /** Specific Finnhub market cap format */
  marketCapitalization?: number;
  /** Specific Finnhub shares outstanding */
  shareOutstanding?: number;
}

// ─── Stock Candles (OHLCV historical data) ───────────────────────────
export interface StockCandle {
  /** Open prices */
  open: number[];
  /** High prices */
  high: number[];
  /** Low prices */
  low: number[];
  /** Close prices */
  close: number[];
  /** Volume */
  volume: number[];
  /** Unix timestamps */
  timestamps: number[];
  /** API response status ("ok" | "no_data") */
  status: string;
}

// ─── Stock Fundamentals & Metrics ──────────────────────────────────────
export interface StockMetrics {
  epsGrowthQuarterlyYoy?: number;
  epsGrowth3Y?: number;
  salesGrowthQuarterlyYoy?: number;
  netMarginTTM?: number; 
  netProfitMargin?: number;
  roeTTM?: number;
  [key: string]: any;
}

// ─── Aggregated Stock Data (used by UI components) ───────────────────
export interface StockData {
  /** Stock ticker symbol */
  symbol: string;
  /** Real-time quote data */
  quote: Quote;
  /** Company profile info */
  profile: CompanyProfile;
  /** RS Score (1–99 percentile), undefined until calculated */
  rsScore?: number;
  /** EPS Rating (1–99) */
  epsRating?: number;
  /** SMR Rating (A, B, or C) */
  smrRating?: string;
  /** Accumulation/Distribution Rating (A–E) */
  accDisRating?: string;
  /** Sparkline close prices for mini-chart */
  sparklineData?: number[];
}

// ─── Search API Data ──────────────────────────────────────────────────
export interface SymbolLookupInfo {
  /** Company Name */
  description: string;
  /** Display Symbol */
  displaySymbol: string;
  /** Actual Ticker Symbol */
  symbol: string;
  /** Type (e.g. "Common Stock") */
  type: string;
}
