import { redis } from "../radis.js";
import { Queue } from "bullmq";

export const pythonQueue = new Queue("compile-python", {
    connection: redis
});

pythonQueue.on("error", (err) => {
    // Suppress unhandled error when Redis is offline
});