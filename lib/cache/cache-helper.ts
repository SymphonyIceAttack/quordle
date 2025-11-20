// Helper wrapper that mimics unstable_cache behavior but works with Cloudflare

import { type CacheAdapter, createCacheAdapter } from "./cloudflare-adapter";

let adapter: CacheAdapter | null = null;

function getAdapter(): CacheAdapter {
  if (!adapter) {
    adapter = createCacheAdapter();
  }
  return adapter;
}

export async function cachedFunction<T>(
  fn: () => Promise<T>,
  keys: string[],
  options?: {
    revalidate?: number;
    tags?: string[];
  },
): Promise<T> {
  const cacheKey = keys.join(":");
  const ttl = options?.revalidate || 86400;

  // Try to get from cache first
  const cached = await getAdapter().get<T>(cacheKey);
  if (cached !== null) {
    return cached;
  }

  // Cache miss, execute function
  const result = await fn();

  // Store in cache
  await getAdapter().set(cacheKey, result, ttl);

  return result;
}

export async function revalidateCache(tag: string): Promise<void> {
  // For Cloudflare, we'd need to iterate and delete matching keys
  // This is a simplified version - in production, you'd maintain a tag->keys mapping
  console.log(`Cache revalidation requested for tag: ${tag}`);
}
