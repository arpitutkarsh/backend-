import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from '../models/user.model.js'
import {uploadonCloudinary} from "../utils/cloudinary.js"
import { response } from "express";
//we can also use asynch handler for below codes like
/*
const registerUser = asyncHandler(async(req, res) => {

})
*/

const generateAccessandRefreshToken = async (userId) => {
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({validateBeforeSave: false})  //so before saving it will also require all the data again to disable this we need validateBeforeSave to be false

        return {accessToken, refreshToken}


    }
    catch(error){
        throw new ApiError(501, "Smething went wrong")
    }
}
const registerUser =  async (req, res) => {
    //get user details from frontend
    //validation like if any field is empty, user inputs the data in correct format etc etc
    //check if user already exists: CHeck using username and email also
    //check for images
    //check if avatar is present or not
    //upload them to cloudinary
    //create user object
    //create entry in db
    //remove password and refreshToken feed from response
    //check for user creation 
    //return response else if user is not created return error


    //to get the data we use req.body but it is not necessary that everytime data comes from the body, it may come from url, from form
    //if the data is coming from form we can get it in req.body
    const {fullname, email, username, password} = await req.body
    //console.log("Body is", await req);

    //now check for validation
    if([fullname, email, username].some((field) => field?.trim === "")){
        throw new ApiError(400, "Fields are Required")
    }

    //checking if user already exists or not we need userModel
    const existingUser = await User.findOne({
        $or: [{username}, {email}]
    })

    //we can also use below code t0 find if the user exists or not
    /*
    User.findOne({email})
    */

    if(existingUser){
        throw new ApiError(409, "Email, Username already exists")
    }
    //console.log(req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path
    //const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;
    if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    //upload them to cloudinary
    const avatar = await uploadonCloudinary(avatarLocalPath)
    const coverImage = await uploadonCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar required")
    }
    

    const user = await User.create({
        fullname,
        avatar : avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )


    if(!createdUser){
        throw new ApiError(500, "Something went wrong, Register Again")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Created")
    )







}

const loginUser = async(req, res) => {
    //take input from user - use req body to get data
    //check validation
    //find the user
    //if user exists check for password
    //if password is correct generate accessToken and refreshToken
    //send cookies
    //response

    const {email, username, password} = req.body
    if(!username || !email){
        throw new ApiError(400, "Username or Email is required")
    }

    //now find the user
    const user = await User.findOne({ //instead of findOne we can also use find
        $or: [{username}, {email}]  //we are using $or because we want to find either username or email
    })

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    //now checking for password
    const validPassword = await user.isPasswordCorrect(password)  //to access methods defined by us in our userModel we use user (with small u)
    //to access the methods available in MONGODB we use User(with capital U)

    if(!validPassword){
        throw new ApiError(401, "Passwrod is Incorrect")
    }
    //create access and refresh token
    const {accessToken, refreshToken} = await generateAccessandRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken") //as we dont want to send password and refreshToken to the user

    //send accessToken and refreshToken via cookies
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse
        (200,
            {
            user: loggedInUser, accessToken, refreshToken
            },
            "User logged in successfully"
        )
    )
}

const logoutUser = async(req, res) => {
    //first of all clear all the cookies for the user
    //as we dont have any data present through which we can access user so we will use middleware here
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new : true
        }
    )

    //now we have to work on cookies
    //therefore we need options
    const options = {
        httpOnly: true,
        secure: true
    }
    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"))
}


export {registerUser, loginUser, logoutUser};