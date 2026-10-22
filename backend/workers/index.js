import { cppWorker } from "./cppWorker.js";
import { Worker } from "bullmq";
import { redis } from "../radis.js";
import { executeCode } from "../executor.js";

// Helper to create standard workers for other languages
const createLanguageWorker = (queueName, language) => {
  const worker = new Worker(
    queueName,
    async (job) => {
      console.log(`[${queueName}] Processing job ${job.id} for ${language}...`);
      const { code, input = "" } = job.data;
      if (!code) {
        throw new Error("Source code is required");
      }
      const result = await executeCode(code, language, input);
      return {
        ...result,
        status: result.status || (result.success ? "Accepted" : (result.error || "Runtime Error"))
      };
    },
    {
      connection: redis,
      concurrency: 4
    }
  );

  worker.on("completed", (job) => {
    console.log(`[${queueName}] Job ${job.id} finished successfully.`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[${queueName}] Job ${job?.id} failed:`, err?.message || err);
  });

  worker.on("error", (err) => {
    // Suppress unhandled crash on reconnect
  });

  return worker;
};

// Initialize workers for each language queue
export const cWorker = createLanguageWorker("compile-c", "c");
export const pythonWorker = createLanguageWorker("compile-python", "python");
export const jsWorker = createLanguageWorker("compile-js", "javascript");
export const javaWorker = createLanguageWorker("compile-java", "java");

export { cppWorker };

console.log("[Workers] All BullMQ workers initialized (C++, C, Python, JavaScript, Java).");
