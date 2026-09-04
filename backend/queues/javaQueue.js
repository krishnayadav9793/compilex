import { redis } from "../radis";
import { Queue } from "bullmq";

export const javaQueue = new Queue("compile-java",{
    connection:redis
})
