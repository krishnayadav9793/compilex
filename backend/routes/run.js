import express from "express";
import { QueueEvents } from "bullmq";
import { redisConnectionOptions, isRedisAvailable } from "../radis.js";
import { cppQueue } from "../queues/cppQueue.js";
import { cQueue } from "../queues/cQueue.js";
import { pythonQueue } from "../queues/pythonQueue.js";
import { jsQueue } from "../queues/jsQueue.js";
import { javaQueue } from "../queues/javaQueue.js";
import { executeCode } from "../executor.js";

const runRouter = express.Router();

const queueMap = {
  cpp: { queue: cppQueue, name: "compile-cpp" },
  "c++": { queue: cppQueue, name: "compile-cpp" },
  c: { queue: cQueue, name: "compile-c" },
  python: { queue: pythonQueue, name: "compile-python" },
  python3: { queue: pythonQueue, name: "compile-python" },
  javascript: { queue: jsQueue, name: "compile-js" },
  js: { queue: jsQueue, name: "compile-js" },
  java: { queue: javaQueue, name: "compile-java" }
};

const queueEventsMap = new Map();

function getQueueEvents(name) {
  if (!queueEventsMap.has(name)) {
    const events = new QueueEvents(name, { connection: redisConnectionOptions });
    events.on("error", () => {
      // Handled to suppress unhandled error events when Redis reconnects
    });
    queueEventsMap.set(name, events);
  }
  return queueEventsMap.get(name);
}

runRouter.get("/", (req, res) => {
  res.send("CompileX Code Execution Engine Online");
});

runRouter.post("/", async (req, res) => {
  const { code, language, input } = req.body;
  const langKey = (language || "").toLowerCase().trim();
  const queueEntry = queueMap[langKey];

  // If a corresponding queue exists and Redis is active, attempt execution via BullMQ
  if (queueEntry && isRedisAvailable()) {
    try {
      const { queue, name } = queueEntry;
      const queueEvents = getQueueEvents(name);

      console.log(`[Queue] Adding execution job to queue "${name}" for language "${language}"...`);

      const job = await queue.add(
        "run-job",
        { code, language: langKey, input },
        {
          removeOnComplete: true,
          removeOnFail: 50,
          timeout: 25000
        }
      );

      console.log(`[Queue] Job ${job.id} queued in "${name}". Waiting for worker result...`);
      const result = await job.waitUntilFinished(queueEvents, 20000);
      console.log(`[Queue] Job ${job.id} completed via worker:`, result.status || (result.success ? "Accepted" : "Failed"));
      return res.json(result);
    } catch (queueErr) {
      console.warn(`[Queue] Notice: Queue execution failed (${queueErr.message}). Routing to direct sandbox execution.`);
    }
  } else if (queueEntry) {
    console.log(`[Queue] Redis is offline. Routing language "${language}" to direct sandbox execution engine.`);
  }

  // Fallback to direct sandbox compiler/interpreter execution
  try {
    const response = await executeCode(code, language, input);
    console.log(`[Sandbox Executor] Execution completed: ${response.status} (${response.executionTime}) [${response.sandbox || 'sandbox'}]`);
    return res.json(response);
  } catch (err) {
    console.error("[Sandbox Executor] Execution error:", err);
    return res.status(500).json({
      output: `Execution failed: ${err.message}`,
      error: err.message,
      success: false
    });
  }
});

export default runRouter;
