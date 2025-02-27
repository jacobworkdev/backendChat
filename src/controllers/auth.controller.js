import { generateToken } from "../lib/utils.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"
import cloudinary from "../lib/cloudinary.js"

export const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        //hashing password
        if(!email || !fullName || !password){
            return res.status(400).json({ message: "all fields must be filled" })

        }
        if (password.length < 8) {
            return res.status(400).json({ message: "Password length must be at least 8 characters" })
        }
        const user = await User.findOne({email})
        if (user){
            return res.status(400).json({message:"User already exists"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password, salt)
        const newUser= new User({
            fullName:fullName,
            email:email,
            password:hashedPassword
        })
        if(newUser){
            //JWT token generation
            generateToken(newUser._id, res)
            await newUser.save()
            res.status(201).json({
                _id:newUser._id,
                fullName:newUser.fullName,
                email:newUser.email,
                profilePic:newUser.profilePic
            })
        }else{
            res.status(400).json({message:"Invalid input"})
        }
    } catch (err) {
        console.log("error in signup controller:",err)
        res.status(500).json({message:"internal error"})
    }
}

export const login = async (req, res) => {
    const {email,password}=req.body
    try{
        const user = await User.findOne({email})

        if(!user){
            return res.status(400).json({message:"invalid credentials"})
        }

        const isCorrectPassword = await bcrypt.compare(password, user.password)
        if(!isCorrectPassword){
            return res.status(400).json({message:"invalid credentials"})
        }

        generateToken(user._id,res)

        res.status(200).json({
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic,
            message:'logged in successfully '
        })

    }catch(err){
        console.log("error in login controller: ",err)
        res.status(500).json({message:"Internal server error:",err})
    }
}

export const logout = (req, res) => {
    try{
        res.cookie("jwt",'',{maxAge:0})//resetting the cookie for logging out and setting cookie to null and the expiration is 0 milliseconds
        res.status(200).json({message:"Logged out"})
    }catch(err){
        console.log("error in logout controller: ",err)
        res.status(500).json({message:"internal server error"})
    }

}

export const updateProfile = async  (req,res) =>{
try{
    const {profilePic}=req.body
    const userId=req.user._id
    if(!profilePic){
        res.status(400).json({message:"Profile picture is required"})
    }

    const uploadRes=await cloudinary.uploader.upload(profilePic)
    const updatedUser = await User.findByIdAndUpdate(userId,{profilePic:uploadRes.secure_url},{new:true})
    res.status(200).json(updatedUser)
}catch(err){
    console.log('error in update profile:',err)
    res.status(500).json({message:"internal server error"})
}
}

export const checkAuth = (req,res)=>{
    try{
        res.status(200).json(req.user)
    }catch(err){
        console.log('error in check auth controller',err.message)
        res.status(500).json({message:"internal server error"})
    }
}