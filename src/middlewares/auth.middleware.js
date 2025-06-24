//this middleware will verify if the user is or not
import { jwt } from "jsonwebtoken"
import { ApiError } from "../utils/ApiError"
import {User} from "../models/user.model.js"
export const verifyJWT = async(req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
    
        if(!token){
            throw new ApiError(401, "Unauthorized Request")
        }
    
        //if there is token, we have to use JWT to check if the token is correct or not
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
    
        if(!user){
            throw new ApiError(401, "Invalid Access Token")
    
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "INVALID ACCESS TOKEN")
    }

}