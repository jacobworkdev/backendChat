import authRoutes from './routes/auth.route.js'
import express from 'express'
import 'dotenv/config';
import { connectDB } from './lib/db.js';
const PORT=process.env.PORT

//EXPRESS
const app = express()

app.use("/api/auth",authRoutes)

app.listen(PORT, ()=>{
    console.log(`server is running on port:${PORT}`)
    connectDB()
})