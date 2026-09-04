import { redis } from "../radis";
import { Queue } from "bullmq";

export const cppQueue = new Queue("compile-cpp",{
    connection:redis
});
