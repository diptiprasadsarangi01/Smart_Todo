// middleware/cacheMiddleware.js
import { getRedisClient } from "../config/redis.js";

export const cacheMiddleware = (keyPrefix) => async (req, res, next) => {
  try {
    const redisClient = getRedisClient();
    if (!redisClient) return next();

    const userId = req.user?._id || "guest";
    const cacheKey = `${keyPrefix}:${userId}`;

    const cachedData = await redisClient.get(cacheKey);

    if (cachedData) {
      return res.json(JSON.parse(cachedData));
    }

    res.locals.cacheKey = cacheKey;
    next();
  } catch (err) {
    console.error("Redis cache error:", err);
    next();
  }
};

export const setCache = async (key, data, expiry = 300) => {
  try {
    const redisClient = getRedisClient();
    if (!redisClient) return;

    await redisClient.setEx(key, expiry, JSON.stringify(data));
  } catch (err) {
    console.error("Redis setCache error:", err);
  }
};
