import { redis } from "../radis.js";
import { Queue } from "bullmq";

export const cppQueue = new Queue("compile-cpp", {
    connection: redis
});

cppQueue.on("error", (err) => {
    // Suppress unhandled error when Redis is offline
});

