interface CachedEntry<T> {
  data: T;
  timestamp: number;
}

export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlHours: number
): Promise<T> {
  if (typeof window === "undefined") {
    // Cannot access localStorage during SSR, skip cache
    return fetcher();
  }

  const ttlMs = ttlHours * 60 * 60 * 1000;
  const now = Date.now();
  const cacheKey = `st_cache_${key}`;

  try {
    const cachedItem = localStorage.getItem(cacheKey);
    if (cachedItem) {
      const entry: CachedEntry<T> = JSON.parse(cachedItem);
      // Check if cache is still valid
      if (now - entry.timestamp < ttlMs) {
        return entry.data;
      }
    }
  } catch (err) {
    console.warn(`Failed to parse cache for ${key}`, err);
    // On parse error, just fetch fresh data
  }

  // Cache miss, expired, or error -> fetch fresh
  const freshData = await fetcher();

  // Store in cache
  try {
    localStorage.setItem(
      cacheKey,
      JSON.stringify({
        data: freshData,
        timestamp: now,
      } as CachedEntry<T>)
    );
  } catch (err) {
    console.warn(`Failed to save cache for ${key}`, err);
    // Ignore quota errors or other storage issues gracefully
  }

  return freshData;
}
