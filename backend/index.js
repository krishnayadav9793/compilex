import "dotenv/config";
import express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import runRouter from "./routes/run.js"
import answerRouter from "./routes/answer.js"
import cors from 'cors'
import { socketInit } from "./sockets/index.js"


const app = express()
const server = createServer(app)
const port = 3000
const io = new Server(server,{
    cors: {
        origin: "http://localhost:5173"
    }
}) 


app.use(cors())
app.use(express.json())

app.use("/run",runRouter)
app.use("/answer", answerRouter)

socketInit(io);



server.listen(port ,()=>{
  console.log(`Socket  and server is connected on ${port}`);
})