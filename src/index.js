import authRoutes from './routes/auth.route.js'
import express from 'express'
import 'dotenv/config';
import { connectDB } from './lib/db.js';
import cookieParser from "cookie-parser"
import messageRoutes from "./routes/message.routes.js"

import cors from 'cors'
const PORT = process.env.PORT

//EXPRESS
const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors(
    { origin: "http://localhost:5173",credentials:true }
))
app.use("/api/auth", authRoutes)
app.use('/api/message', messageRoutes)

app.listen(PORT, () => {
    console.log(`server is running on port:${PORT}`)
    connectDB()
})