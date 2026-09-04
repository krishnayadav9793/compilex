import { redis } from "../radis";
import { Queue } from "bullmq";
export const cQueue = new  Queue("compile-c",{
    connection:redis
})