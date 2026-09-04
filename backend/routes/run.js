import express from "express"
import { executeCode } from "../executor.js";
const runRouter = express.Router();

runRouter.get("/",(req,res)=>{
    res.send("hello from run")
})
runRouter.post("/",async (req,res)=>{
    const {code,language,input}=req.body;
    try {
        const response = await executeCode(code, language, input);
        console.log("Job execution completed:", response);
        res.send(response);
    } catch (err) {
        console.error("Execution error:", err);
        res.status(500).send({
            output: `Execution failed: ${err.message}`,
            error: err.message
        });
    }
})
export default runRouter