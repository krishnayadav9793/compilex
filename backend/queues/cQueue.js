import { redis } from "../radis.js";
import { Queue } from "bullmq";
export const cQueue = new Queue("compile-c", {
    connection: redis
});

cQueue.on("error", (err) => {
    // Suppress unhandled error when Redis is offline
});