import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {User} from '../models/user.model.js'
import {uploadonCloudinary} from "../utils/cloudinary.js"
const registerUser = asyncHandler( async (req, res) => {
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







} )


export {registerUser};