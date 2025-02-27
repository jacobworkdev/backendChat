import jwt from "jsonwebtoken"
import User from '../models/user.model.js'

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt

        if (!token) {
            return res.status(401).json({ message: "Unauthorized - no token" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded)
        if(!decoded){
            return res.status(401).json({message:"Unauthorized - invalid token"})
        }

        const user = await User.findById(decoded.userID).select("-password")
        if(!user){
            return res.status(404).json({message:"User not found protect middleware flag"})
        }
        req.user = user
        next()
    } catch (err) {
        console.log("error in protect route middleware:", err)
        return res.status(500).json({message:"internal server error"})
    }
}