import { redis } from "../radis.js";
import { Queue } from "bullmq";

export const jsQueue = new Queue("compile-js", {
    connection: redis
});

jsQueue.on("error", (err) => {
    // Suppress unhandled error when Redis is offline
});