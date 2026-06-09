import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

//Generate Access and Refresh Tokens
const generateAccessAndRefreshToken= async(userId)=>{
    try{
        const user=await User.findById(userId)
        const accessToken=user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave: false})
        return {accessToken, refreshToken}
    }catch(error){
        throw new ApiError(500, "Something went wrong while generating access and refresh token")
    }
}

const registerUser= asyncHandler(async (req,res)=>{
    //Steps:
    //1. get user details from frontend
    //2. validate not empty
    //3. Check if user already exists using username & email
    //4. Check for images & avatar
    //5. Upload on Cloudinery
    //6. Create user object
    //7. Remove password and Refresh token field from response
    //8. Check for user creation
    //9. Return response if user created otherwise give error

    //Step 1
    const {fullName, email, username, password}= req.body
    //Step 2
 /* Check if all fields are empty one by one  
 if(fullName===""){
        throw new ApiError(400,"Full name is required!!")
    }*/
   //Check all fields at once
if([fullName,email,username,password].some((e)=> e?.trim() ==="")){
    throw new ApiError(400, "All fields are required")
}
const username2=username.toLowerCase()
//Step 3
// Return 1st recored of given username or email
const existedUser=await User.findOne({
    $or:[{username: username2},{email}]
})
if(existedUser){
    throw new ApiError(409,"User with email or usernaame already exists")
}

//Step 4
//Given by multer
const avatarLocalPath=req.files?.avatar[0]?.path;
//const coverImageLocalPath=req.files?.coverImage[0]?.path;

let coverImageLocalPath;
if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
    coverImageLocalPath=req.files.coverImage[0].path
}
if(!avatarLocalPath){
    throw new ApiError(400,"Avatar File is required")
}

//Step 5
const avatar=await uploadCloudinary(avatarLocalPath)
const coverImage=await uploadCloudinary(coverImageLocalPath)

if(!avatar){
    throw new ApiError(400,"Avatar file is required")
}

//Step 6
const user= await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase()
})

//Step 7
//Remove password and refreshToken from response
const a=await User.findById(user._id).select(
    "-password -refreshToken"
)

//Step 8
if(!a){
    throw new ApiError(500,"Something went wrong while registering a user")
}

//Step 9
return res.status(201).json(
    new ApiResponse(200,a,"User registered successfully")
)
})


//Login 
const loginUser=asyncHandler(async(req,res)=>{
    //1. Access the data
    //2. Check if username or password is empty
    //3. Find user
    //4. Password Check
    //5. Generate access and refresh token
    //6. Send cookies

    //Step 1
    const {email,username,password}=req.body
    
    //Step 2
    if(!username && !email){
        throw new ApiError(400, "Username or email is required")
    }
    //Step 3
    const user =await User.findOne({
        $or: [{username: username?.toLowerCase()}, {email}]
    })

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    //Step 4
    const isPasswordvalid= await user.isPasswordCorrect(password)
    if(!isPasswordvalid){
        throw new ApiError(401, "Password incorrect")
    }

    //Step 5
    const{accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)

    //Step 6
    const loggedInUser= await User.findById(user._id).select("-password -refreshToken")

    const options={
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24*60*60*1000
    }

    return res.status(200).cookie("accessToken",accessToken, options).cookie("refreshToken",refreshToken,{httpOnly:true, secure:true,samesite: "none", maxAge:10*24*60*60*1000}).json(new ApiResponse(200,{user: loggedInUser, accessToken, refreshToken},"User logged in successfully"))
})

//Logout
const logoutUser=asyncHandler(async(req,res)=>{
   await User.findByIdAndUpdate(req.user._id,{
        $unset:{
            refreshToken: 1
        }
    },
    {
            new : true
        }
    )
    const options={
        httpOnly: true,
        secure: true,
        sameSite:"none"
    }

    return res.status(200).clearCookie("accessToken",options).clearCookie("refreshToken",options).json(new ApiResponse(200,{},"User logged out"))
})

//Refresh access token
const refreshAccessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken || req.body.refreshToken
    
    if(!incomingRefreshToken){
        throw new ApiError(401,"Unauthorized request")
    }
    try {
        const decodedToken=jwt.verify(incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET)
        
        const user=await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid Refresh Token")
        }
    
        if(incomingRefreshToken !== user?.refreshToken){
            throw new ApiError(401, "Refresh token is expired or used")
        }
    
        const options={
            httpOnly: true,
            secure: true,
            sameSite:"none",
            maxAge: 24*60*60*1000
        }
        const {accessToken,newRefreshToken}=await generateAccessAndRefreshToken(user._id)
        
        return res.status(200).cookie("accessToken",accessToken,options).cookie("refreshToken", newRefreshToken, {httpOnly:true, secure:true,sameSite:"none" ,maxAge: 10*24*60*60*1000}).json(
            new ApiResponse(200,{accessToken, refreshToken: newRefreshToken},"Access token refreshed successfully")
        )
    } catch (error) {
        throw new ApiError(401,error?.message|| "Invalid refresh token")
    }
})


//Change current password
const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword, newPassword}= req.body
    const user=await User.findById( req.user?._id)
    const isPasswordCorrect= await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid old password")
    }
    user.password=newPassword;
    await user.save({validateBeforeSave: false})
    return res.status(200).json(new ApiResponse(200,{},"Password changed successfully"))
})

//Change account details

const updateAccountDetails=asyncHandler(async(req,res)=>{
    const {fullName,email}=req.body

    if(!fullName || !email){
        throw new ApiError(400,"All fields are required");
    }
    const user=await User.findByIdAndUpdate(req.user?._id,{$set:{
        fullName,email
    }},{new:true}).select("-password")
 return res.status(200).json(new ApiResponse(200,user,"Account details updated successfully"))
})

//Getting user
const getCurrentUser=asyncHandler(async(req,res)=>{
    return res.status(200).json( new ApiResponse(200,req.user,"current user fetched successfully"))
})

//Update files
const updateUserAvatar=asyncHandler(async(req,res)=>{
    const avatarLocalPath=req.file?.path //Since single file is being uploaded req.file is taken instead of req.files
    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is missing")
    }

    const avatar=await uploadCloudinary(avatarLocalPath)

    if(!avatar){
        throw new ApiError(400,"Error while uploading on avatar")
    }
    const user= await User.findByIdAndUpdate(req.user?._id,
        {$set:{avatar: avatar.url}},
        {new: true}
    ).select("-password")

    res.status(200).json(new ApiResponse(200,user,"Avatar updated successfully"))
})

const updateUserCoverImage=asyncHandler(async(req,res)=>{
    const coverLocalPath=req.file?.path //Since single file is being uploaded req.file is taken instead of req.files
    if(!coverLocalPath){
        throw new ApiError(400,"Cover image file is missing")
    }

    const coverImage=await uploadCloudinary(coverLocalPath)

    if(!coverImage){
        throw new ApiError(400,"Error while uploading on Cover Image")
    }
    const user= await User.findByIdAndUpdate(req.user?._id,
        {$set:{coverImage: coverImage.url}},
        {new: true}
    ).select("-password")

    res.status(200).json(new ApiResponse(200,user,"Cover Image updated successfully"))
})

//Get user channel profile
const getUserChannelProfile=asyncHandler(async(req,res)=>{
    const {username}=req.params

    if(!username?.trim()){
        throw new ApiError(400,"username is missing")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                channelsSubscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                fullName: 1,
                username: 1,
                subscribersCount: 1,
                channelsSubscribedToCount: 1,
                isSubscribed: 1,
                avatar: 1,
                coverImage: 1,
                email: 1

            }
        }
    ])

    if(!channel?.length){
        throw new ApiError(404,"Channel does not exist")
    }

    return res.status(200).json(new ApiResponse(200,channel[0],"User channel fetched successfully"))

})

export const getChannel = asyncHandler(async (req, res) => {
    const { id } = req.params; // This is the Channel/Owner ID

    if (!mongoose.isValidObjectId(id)) {
        throw new ApiError(400, "Invalid Channel ID format");
    }

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    
    let requestingUserId = null;

    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            requestingUserId = decodedToken?._id;
        } catch (error) {
            requestingUserId = null; 
        }
    }

    const channelData = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(id)
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $addFields: {
                subscribersCount: { $size: "$subscribers" },
                isSubscribed: requestingUserId 
                    ? {
                        $cond: {
                            if: { $in: [new mongoose.Types.ObjectId(requestingUserId), "$subscribers.subscriber"] },
                            then: true,
                            else: false
                        }
                    }
                    : false
            }
        },
        {
            $project: {
                username: 1,
                fullName: 1,
                avatar: 1,
                coverImage: 1,
                subscribersCount: 1,
                isSubscribed: 1
            }
        }
    ]);

    if (!channelData?.length) {
        throw new ApiError(404, "Channel workspace does not exist");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, channelData[0], "Channel details compiled successfully"));
});


const getWatchHistory=asyncHandler(async(req,res)=>{
    const user=await User.aggregate([
        {
            $match:{
                _id: new mongoose.Types.ObjectId(req.user._id)
            }
        },{
            $lookup:{
                from: "videos",
                localField: "watchHistory",
                foreignField:"_id",
                as: "watchHistory",
                pipeline:[
                    {
                    $lookup:{
                        from: "users",
                        localField: "owner",
                        foreignField: "_id",
                        as: "owner",
                        pipeline:[
                            {
                                $project:{
                                    fullName: 1,
                                    username: 1,
                                    avatar: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $addFields:{
                        owner:{
                            $first:"$owner"
                        }
                    }
                }
            ]
            }
        }
    ])

    return res.status(200).json(new ApiResponse(200,user[0].watchHistory,"Watch history fetched successfully"))
})

export {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword,getCurrentUser,updateAccountDetails,updateUserAvatar,updateUserCoverImage,getUserChannelProfile,getWatchHistory}