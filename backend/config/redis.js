import { createClient } from "redis";

let redisClient;

export const connectRedis = async () => {
  try {
    redisClient = createClient({
      socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
      },
      password: process.env.REDIS_PASSWORD
    });

    redisClient.on("connect", () =>
      console.log("Redis Connected Successfully")
    );

    redisClient.on("error", (err) =>
      console.error("Redis Error:", err)
    );

    await redisClient.connect();
  } catch (err) {
    console.error("Redis Connection Failed:", err);
  }
};

// ✅ Default export so you can import redisClient directly
export default redisClient;
