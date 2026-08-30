import { Queue, QueueEvents } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = parseInt(process.env.REDIS_PORT || "6379");

export const redisConnection = new Redis({
    host: redisHost,
    port: redisPort,
    maxRetriesPerRequest: null
});

redisConnection.on("error", (err) => {
    // Suppress and log connection errors cleanly
    console.warn(`[Redis] Connection error to ${redisHost}:${redisPort} - ${err.message}`);
});

export const codeQueue = new Queue("codeExecutionQueue", {
    connection: redisConnection
});

export const queueEvents = new QueueEvents("codeExecutionQueue", {
    connection: redisConnection
});

queueEvents.on("error", (err) => {
    console.warn(`[BullMQ] QueueEvents error - ${err.message}`);
});