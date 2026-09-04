import { redis } from "../radis";
import { Queue } from "bullmq";

export const  jsQueue = new Queue("compile-js",{
    connection:redis
});