import express from "express"
import { codeQueue, queueEvents } from "../queue.js";
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("hello from run")
})
router.post("/",async (req,res)=>{
    const {code,language,input}=req.body;
    try {
        const job = await codeQueue.add("executeCode", { code, language, input });
        const response = await job.waitUntilFinished(queueEvents);
        console.log("Job execution completed:", response);
        res.send(response);
    } catch (err) {
        console.error("Queue execution error:", err);
        res.status(500).send({
            output: `Execution failed: ${err.message}`,
            error: err.message
        });
    }
})
export default router