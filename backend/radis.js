import Redis from "ioredis";

export const redisConnectionOptions = {
    host: process.env.REDIS_HOST || "127.0.0.1",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
    enableOfflineQueue: false,
    retryStrategy(times) {
        return Math.min(times * 1000, 10000);
    }
};

export const redis = new Redis(redisConnectionOptions);

let isRedisConnected = false;

redis.on("connect", () => {
    isRedisConnected = true;
    console.log(`[Redis] Connected to Redis server at ${process.env.REDIS_HOST || "127.0.0.1"}:${process.env.REDIS_PORT || 6379}`);
});

redis.on("ready", () => {
    isRedisConnected = true;
    console.log("[Redis] Ready to accept queue tasks.");
});

redis.on("error", (err) => {
    isRedisConnected = false;
    // Handled error event prevents unhandled exceptions from crashing Node
});

redis.on("close", () => {
    isRedisConnected = false;
});

export const isRedisAvailable = () => isRedisConnected;


