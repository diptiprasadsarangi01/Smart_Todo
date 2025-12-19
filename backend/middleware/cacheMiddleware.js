import redisClient from "../config/redis.js";

export const cacheMiddleware = (keyPrefix) => async (req, res, next) => {
  try {
    if (!redisClient) {
      console.warn("⚠ Redis client not initialized");
      return next();
    }

    const userId = req.user?._id || "guest";
    const cacheKey = `${keyPrefix}:${userId}`;

    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {

      return res.json(JSON.parse(cachedData));
    }

    // store key for later use
    res.locals.cacheKey = cacheKey;
    next();

  } catch (error) {
    console.error("Redis cache error:", error);
    next();
  }
};

// Helper to store response in cache
export const setCache = async (key, data, expiry = 300) => {
  try {
    if (!redisClient) {
      console.warn("⚠ Redis client not initialized (setCache skipped)");
      return;
    }

    await redisClient.setEx(key, expiry, JSON.stringify(data));
  } catch (error) {
    console.error("Redis setCache error:", error);
  }
};
