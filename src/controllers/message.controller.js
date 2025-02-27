import cloudinary from "../lib/cloudinary.js"
import Message from "../models/messaage.model.js"
import User from "../models/user.model.js"

export const getUsersForSidebar = async (req,res) =>{
    try{
        const loggedInUser=req.user._id
        const filteredUsers= await User.find({_id:{$ne:loggedInUser}}).select("-password")
        res.status(200).json(filteredUsers)
    }catch(err){
        console.log("err:",err)
        res.status(500).json({error:"message controller internal error"})
    }
}

export const getMessages = async (req,res) =>{

    try{
        const {id:userToChatId} = req.params
        const myId=req.user._id
        
        const messages = await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })

        res.status(200).json(messages)
    }catch(err){
        console.log("err in getmessage controller",err)
        res.status(500).json({message:"internal error getmessage controller"})
    }

}

export const sendMessage = async (req,res)=>{
    try{
        const {text,image} = req.body
        const{id:receiverId} = req.params
        const senderId=req.user._id

        let imageUrl;

        if(image){
            const uploadRes= await cloudinary.uploader.upload(image)
            imageUrl = uploadRes.secure_url
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })

        await newMessage.save()

        //socket.io code goes here

        res.status(200).json(newMessage)
    }catch(err){
        console.log("message controller sendmessage err:",err)
        res.status(500).json({message:"message controller sendmessage err"})
    }
}