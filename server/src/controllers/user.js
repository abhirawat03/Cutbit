import {User} from "../models/user.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const generateAccessAndRefreshTokens = async(userId)=>{
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        const hashedRefreshToken = crypto
            .createHash("sha256")
            .update(refreshToken)
            .digest("hex")
        user.refreshToken = hashedRefreshToken
        await user.save({validateBeforeSave:false})

        return {accessToken,refreshToken}
    }catch(err){
        throw new ApiError(500,"Something went wrong while generating access and refresh token")
    }
}

const registerUser = async(req,res)=>{
    const {fullName, email, password} = req.body

    if(
        [fullName, email, password].some((field)=>
        field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = await User.findOne({
        email
    })

    if(existedUser){
        throw new ApiError(409,"User with email already exists")
    }
    
    const user = await User.create({
        fullName,
        email,
        password,
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser) throw new ApiError(500,"Something wen wrong while registering the user")

    return res
    .status(201)
    .json(
        new ApiResponse(
            200,
            createdUser,
            "User Registered Successfully"
        )
    )
}

const loginUser = async(req,res)=>{
    const {email, password} = req.body

    if(!email) throw new ApiError(400,"Email is required")
    
    const user = await User.findOne({
        email
    })

    if(!user) throw new ApiError(404,"User does not exist")
    
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid) throw new ApiError(401,"Invalid user credentials")

    const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly:true,
        secure:true
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,
            },
            "User logged in successfully"
        )
    )
} 

const logoutUser = async(req,res)=>{
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset:{
                refreshToken:1
            }
        },
        {
            new:true
        }
    )
    const options = {
        httpOnly:true,
        secure:true,
    }

    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200, {}, "User logged Out"))
}

const refreshAccessToken = async(req, res)=>{
    const incomingRefreshToken = req.cookies.refreshToken

    if(!incomingRefreshToken) throw new ApiError(401,"unauthorized request")
    
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
    
        const user = await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid refresh token")
        }
        
        // 🔐 Hash incoming token before comparing
        const hashedIncomingToken = crypto
            .createHash("sha256")
            .update(incomingRefreshToken)
            .digest("hex")

    
        if(hashedIncomingToken !== user?.refreshToken){
            throw new ApiError(401,"Refresh token is expired or used")
        }
    
        const options={
            httpOnly:true,
            secure:true,
            sameSite:'strict'
        }
    
        const {accessToken, newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
    
        return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(
            new ApiResponse(
                200,
                {accessToken, refreshToken:newRefreshToken},
                "Access token refreshed"
            )
        )
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
    }
}

const changeCurrentPassword = async(req,res)=>{
    const {oldPassword, newPassword} = req.body

    const user = await User.findById(req.user?._id)
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid old password")
    }

    user.password = newPassword;
    await user.save({validateBeforeSave:false})

    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password changes Successfully"))

}

const getCurrentUser = async(req,res)=>{
    return res
    .status(200)
    .json(new ApiResponse(
        200, 
        req.user,
        "current user fetched Successfully"
    ))
}

const updateAccountDetails = async(req,res)=>{
    const {fullName,email} = req.body

    if(!fullName || !email){
        throw new ApiError(400,"All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email:email,
            }
        },
        {new:true}
    ).select("-password")

    return res
    .status(200)
    .json(new ApiError(200,user,"Account details updated successfully"))
}

const updateUserAvatar = async(req,res)=>{
    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath) throw new ApiError(400,"Avatar file is missing")

    const exisitingUser = await User.findById(req.user?._id)
    if(!exisitingUser) throw new ApiError(404,"User not found");

    //upload new avatar First
    const oldAvatar = exisitingUser?.avatar;
    let avatar = await uploadOnCloudinary(avatarLocalPath);
    if(!avatar.url) throw new ApiError(400,"Error uploading an avatar")
    //update DB
    let user;
    try {
        user = await User.findByIdAndUpdate(
            req.user?._id,
            {
                $set:{
                    avatar:avatar.url
                }
            },
            {new:true}
        ).select("-password")
        if (!user) throw new Error("DB update failed");
    } catch (error) {
        if (avatar?.url) {
            const publicId = avatar.url.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId).catch(()=>{});
        }
        throw new ApiError(500, "Avatar update failed");
    }

    // 4️⃣ delete old thumbnail (cleanup)
    // only after DB success
    // ==============================
    if (oldAvatar) {
        const publicId = oldAvatar.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId).catch(()=>{});
    }

    return res
    .status(200)
    .json(
        new ApiResponse(200,user,"avatar updated successfully")
    )
}

export {
    generateAccessAndRefreshTokens,
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
}