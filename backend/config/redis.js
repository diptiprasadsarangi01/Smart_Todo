// config/redis.js
import { createClient } from "redis";

let redisClient;

export const connectRedis = async () => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL,
    });

    redisClient.on("connect", () => {
      console.log("✅ Redis connected");
    });

    redisClient.on("error", (err) => {
      console.error("❌ Redis error:", err);
    });

    await redisClient.connect();

    return redisClient;
  } catch (err) {
    console.error("❌ Redis connection failed:", err);
  }
};

export  const getRedisClient = () => redisClient;
