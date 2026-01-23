import express from "express"
import runCpp from "../compilers/cpp.js";
const router = express.Router();

router.get("/",(req,res)=>{
    res.send("hello from run")
})
router.post("/",async (req,res)=>{
    const {code,language}=req.body;
    const response =await runCpp(code)
    console.log(response)
    res.status(200).send(response)
})
export default router