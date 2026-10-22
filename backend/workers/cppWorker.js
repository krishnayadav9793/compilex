import { Worker } from "bullmq";
import { redis } from "../radis.js";
import { executeCode, isDockerAvailable } from "../executor.js";

/**
 * Backward-compatible helper to check if Docker is running
 */
export const isDockerRunning = async () => {
  const status = await isDockerAvailable();
  return status.active;
};

/**
 * Backward-compatible wrapper for executing C++ in Docker/Sandbox
 */
export const executeCppInDocker = async ({ code, input = "" }) => {
  return await executeCode(code, "cpp", input);
};

/**
 * BullMQ Worker for C++ compilation and execution jobs.
 * Uses the unified, secure Docker Sandbox Engine with automatic host fallback.
 */
export const cppWorker = new Worker(
  "compile-cpp",
  async (job) => {
    console.log(`\n========================================`);
    console.log(`[cppWorker] Processing Job ID: ${job.id}`);
    console.log(`========================================`);

    const { code, input = "" } = job.data;

    if (!code || typeof code !== "string") {
      throw new Error("Invalid or empty source code provided in job data.");
    }

    const result = await executeCode(code, "cpp", input);
    console.log(`[cppWorker] Job ${job.id} finished with status: ${result.status} (${result.executionTime})`);
    return result;
  },
  {
    connection: redis,
    concurrency: 4
  }
);

// Worker Lifecycle Listeners
cppWorker.on("completed", (job) => {
  console.log(`[cppWorker] Job ${job.id} completed successfully.`);
});

cppWorker.on("failed", (job, err) => {
  console.error(`[cppWorker] Job ${job?.id} failed:`, err?.message || err);
});

cppWorker.on("error", () => {
  // Suppress unhandled error on reconnect
});
