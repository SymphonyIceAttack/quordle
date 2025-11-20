// Cloudflare KV cache adapter for Next.js deployment
// This replaces unstable_cache when deploying to Cloudflare Pages/Workers

import type { KVNamespace } from "@cloudflare/workers-types";

export interface CacheAdapter {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttl?: number): Promise<void>;
  delete(key: string): Promise<void>;
}

// Cloudflare KV implementation
export class CloudflareCacheAdapter implements CacheAdapter {
  private kv: KVNamespace | null = null;

  constructor() {
    // In Cloudflare Workers/Pages, KV is available via globalThis
    // @ts-expect-error - KV bindings are injected at runtime
    this.kv = globalThis.PUZZLE_CACHE || null;
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.kv) {
      console.warn("KV namespace not available, cache miss");
      return null;
    }

    try {
      const value = await this.kv.get(key, "json");
      return value as T | null;
    } catch (error) {
      console.error("KV get error:", error);
      return null;
    }
  }

  async set<T>(key: string, value: T, ttl = 86400): Promise<void> {
    if (!this.kv) {
      console.warn("KV namespace not available, skipping cache set");
      return;
    }

    try {
      await this.kv.put(key, JSON.stringify(value), {
        expirationTtl: ttl,
      });
    } catch (error) {
      console.error("KV set error:", error);
    }
  }

  async delete(key: string): Promise<void> {
    if (!this.kv) return;
    try {
      await this.kv.delete(key);
    } catch (error) {
      console.error("KV delete error:", error);
    }
  }
}

// Memory cache fallback for local development
export class MemoryCacheAdapter implements CacheAdapter {
  private cache = new Map<string, { value: unknown; expiry: number }>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value as T;
  }

  async set<T>(key: string, value: T, ttl = 86400): Promise<void> {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl * 1000,
    });
  }

  async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }
}

// Factory to choose the right adapter based on environment
export function createCacheAdapter(): CacheAdapter {
  // Check if running in Cloudflare environment
  // @ts-expect-error
  if (typeof globalThis.PUZZLE_CACHE !== "undefined") {
    return new CloudflareCacheAdapter();
  }

  // Fallback to memory cache for development
  return new MemoryCacheAdapter();
}
