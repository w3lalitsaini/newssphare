import { Redis } from "@upstash/redis";

let redisClient: Redis | null = null;

async function getRedis() {
  if (!redisClient) {
    redisClient = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    });
  }
  return redisClient;
}

/**
 * Cache Service (Upstash Redis)
 */
export async function getCache(key: string): Promise<any | null> {
  try {
    const redis = await getRedis();
    return await redis.get(key);
  } catch (err) {
    console.error("[CacheService] Get Error:", err);
    return null;
  }
}

export async function setCache(key: string, value: any, ttlSeconds: number = 86400): Promise<void> {
  try {
    const redis = await getRedis();
    await redis.set(key, value, { ex: ttlSeconds });
  } catch (err) {
    console.error("[CacheService] Set Error:", err);
  }
}

export async function deleteCache(key: string): Promise<void> {
  try {
    const redis = await getRedis();
    await redis.del(key);
  } catch (err) {
    console.error("[CacheService] Delete Error:", err);
  }
}
