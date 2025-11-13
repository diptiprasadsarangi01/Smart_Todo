import redisClient from "../config/redis.js";

export const cacheMiddleware = (keyPrefix) => async (req, res, next) => {
  try {
    const userId = req.user?._id || "guest";
    const cacheKey = `${keyPrefix}:${userId}`;

    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("📦 Cache Hit:", cacheKey);
      return res.json(JSON.parse(cachedData));
    }

    // attach key to res for later caching
    res.locals.cacheKey = cacheKey;
    next();
  } catch (error) {
    console.error("Redis cache error:", error);
    next(); // continue without breaking
  }
};

// Helper to store response in cache after fetching
export const setCache = async (key, data, expiry = 300) => {
  try {
    await redisClient.setEx(key, expiry, JSON.stringify(data));
  } catch (error) {
    console.error("Redis setCache error:", error);
  }
};
