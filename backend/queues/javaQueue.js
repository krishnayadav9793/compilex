import { redis } from "../radis.js";
import { Queue } from "bullmq";

export const javaQueue = new Queue("compile-java", {
    connection: redis
});

javaQueue.on("error", (err) => {
    // Suppress unhandled error when Redis is offline
});

