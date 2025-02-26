import authRoutes from './routes/auth.route.js'

//EXPRESS
import express from 'express'
const app = express()

app.use("/api/auth",authRoutes)

app.listen(3000, ()=>{
    console.log("server is running on port 3000")
})