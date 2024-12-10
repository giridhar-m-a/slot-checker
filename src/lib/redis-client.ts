import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://localhost:6379", // Update URL if hosted remotely
});

redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

(async () => {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
})();

export default redisClient;
