import { mongoose } from 'mongoose'
import 'dotenv/config';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`connected successfully to: ${conn.connection.host}`)
    } catch (err) {
        console.log("MongoDB Error:", err)
    }
}