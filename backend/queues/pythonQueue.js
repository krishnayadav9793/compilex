import { redis } from "../radis";
import { Queue } from "bullmq";

export const pythonQueue = new Queue("compile-python",{
    connection:redis
});