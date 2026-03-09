/**
 * Redis-ready caching utility.
 * Uses in-memory Map cache for development, can swap to Redis/Upstash for production.
 * 
 * To switch to Redis, install ioredis and update this file:
 *   npm install ioredis
 *   const Redis = require('ioredis');
 *   const redis = new Redis(process.env.REDIS_URL);
 */

// In-memory cache (development fallback)
const memoryCache = new Map();

const cache = {
    /**
     * Get cached value by key.
     * @returns {Promise<any|null>} Parsed value or null if not found/expired
     */
    async get(key) {
        const entry = memoryCache.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expiresAt) {
            memoryCache.delete(key);
            return null;
        }
        return entry.value;
    },

    /**
     * Set a cached value with TTL in seconds.
     */
    async set(key, value, ttlSeconds = 300) {
        memoryCache.set(key, {
            value,
            expiresAt: Date.now() + (ttlSeconds * 1000)
        });
    },

    /**
     * Delete a specific cache key (for invalidation).
     */
    async del(key) {
        memoryCache.delete(key);
    },

    /**
     * Delete all keys matching a pattern (e.g., 'products:*').
     * For Redis, use SCAN + DEL.
     */
    async delPattern(pattern) {
        const regex = new RegExp('^' + pattern.replace(/\*/g, '.*'));
        for (const key of memoryCache.keys()) {
            if (regex.test(key)) {
                memoryCache.delete(key);
            }
        }
    },

    /**
     * Express middleware that caches GET responses.
     * @param {number} ttlSeconds - Cache TTL in seconds
     */
    middleware(ttlSeconds = 300) {
        return async (req, res, next) => {
            if (req.method !== 'GET') return next();

            const key = `cache:${req.originalUrl}`;
            const cached = await cache.get(key);

            if (cached) {
                return res.json(cached);
            }

            // Override res.json to cache the response
            const originalJson = res.json.bind(res);
            res.json = (data) => {
                cache.set(key, data, ttlSeconds);
                return originalJson(data);
            };

            next();
        };
    }
};

module.exports = cache;
