import express from "express"
// import { Router } from "express"
import router from "./routes/run.js"
import cors from 'cors'
const app = express()
const port = 3000
app.use(cors())
app.use(express.json())
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })
app.use("/run",router)
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})