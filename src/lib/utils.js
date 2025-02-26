import jwt from "jsonwebtoken"
export function generateToken(userID, res) {
    const token = jwt.sign({ userID }, process.env.PRIVATE_KEY, { expiresIn: "7d" })
    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000,// age in milliseconds
        httpOlny: true, //prevent XSS attacks cross-site scripting attacks
        sameSite: "strict",// CSRF attacks cross-stie requrest forgery attacks 
        secure: process.env.NODE_ENV !== "development"
    })
    return token;
}