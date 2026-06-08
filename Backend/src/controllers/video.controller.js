import { asyncHandler} from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse";
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {uploadCloudinary} from "../utils/cloudinary.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query
    const startIndex=(page-1)*limit;
    const endIndex=page*limit;
    const video=await Video.aggregate([
        {
            $match:{
                isPublished: true
            }
        },
        {$sort:{
            createdAt:-1
        }},
        {$skip: parseInt( startIndex)},
        {$limit:parseInt(limit)},
        {
            $lookup:{
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },{
            $project:{
                _id: 1,
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                owner:{
                username: 1,
                avatar: 1,
                coverImage: 1
                }
            }
        }
    ])
    return res.status(200).json(new ApiResponse(200,video,"All videos returned successfully"))
})

const searchVideos = asyncHandler(async (req, res) => {
    const { q, page = 1, limit = 10 } = req.query;

    if (!q || q.trim() === "") {
        return res
            .status(200)
            .json(new ApiResponse(200, [], "No search query provided"));
    }

    const parsedPage = parseInt(page, 10);
    const parsedLimit = parseInt(limit, 10);
    const skipValue = (parsedPage - 1) * parsedLimit;

    const searchRegex = new RegExp(q.trim(), "i");

    const videos = await Video.aggregate([
        {
            $match: {
                isPublished: true,
                title: { $regex: searchRegex }
            }
        },
        {
            $sort: {
                createdAt: -1 
            }
        },
        {
            $skip: skipValue
        },
        {
            $limit: parsedLimit
        },
        {
            $lookup: {
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
{
            $project:{
                _id: 1,
                videoFile: 1,
                thumbnail: 1,
                title: 1,
                description: 1,
                duration: 1,
                views: 1,
                owner:{
                username: 1,
                avatar: 1,
                coverImage: 1
                }
            }
        }
    ]);
    if(!videos){
        throw new ApiError(400,"Some Problem occured")
    }
    return res.status(200).json(new ApiResponse(200, videos, "All videos returned successfully"));
});

const getAllVideosOfChannel=asyncHandler(async(req,res)=>{
    const { page = 1, limit = 10 } = req.query
    const {userId}=req.params
    const startIndex=(page-1)*limit;
    const endIndex=page*limit;
    const video=await Video.aggregate([
        {
            $match:{
                isPublished: true,
                owner: new mongoose.Types.ObjectId(userId)
            }
        },
    ])
    const result=video.slice(startIndex,endIndex)
    return res.status(200).json(new ApiResponse(200,result,"All videos returned successfully"))
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if([title,description].some((e)=> e?.trim() ==="")){
    throw new ApiError(400, "Title and Description required")
}
console.log(req.headers["content-type"])
const videoLocalPath=req.files?.videoFile?.[0]?.path;
const thumbnailLocalPath=req.files?.thumbnail?.[0]?.path;
if(!thumbnailLocalPath || !videoLocalPath){
    throw new ApiError(400,"Video and thumbnail are required")
}

const video=await uploadCloudinary(videoLocalPath)
const thumbnail=await uploadCloudinary(thumbnailLocalPath)
const user=req.user
if(!thumbnail || !video){
    throw new ApiError(400,"Video and thumbnail are required")
}
const v= await Video.create({
    videoFile: video.url,
    thumbnail: thumbnail.url,
    owner: user._id,
    title: title.toLowerCase(),
    description,
    duration: video.duration
})
if(!v){
    throw new ApiError(500,"Something went wrong while uploading Video")
}
return res.status(201).json(new ApiResponse(200,v,"Video uploaded successfully"))

})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId || videoId.trim() === "") {
        throw new ApiError(400, "Invalid video ID");
    }

    if (!mongoose.isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID format");
    }

    let vid = await Video.findById(videoId);

    if (!vid) {
        throw new ApiError(404, "Video not found");
    }

    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    let currentUserId = null;

    if (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
            currentUserId = decodedToken?._id;
        } catch (error) {
            currentUserId = null;
        }
    }

    const isOwner = currentUserId && vid.owner.toString() === currentUserId.toString();

    if (!isOwner) {
        vid = await Video.findByIdAndUpdate(
            videoId,
            { $inc: { views: 1 } },
            { new: true }
        );
    }

    return res.status(200).json(
        new ApiResponse(200, vid, "Video fetched successfully!!!")
    );
});

const updateVideoTitle = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const{title}=req.body
    if(title==="" || title.trim()===""){
        throw new ApiError(400,"Title is required")
    }
    if(videoId==="" || videoId.trim()===""){
        throw new ApiError(400,"Invalid id1")
    }
    const vid=await Video.findByIdAndUpdate(videoId,{$set:{
        title:title.toLowerCase()
    }
    },{new:true})
    if(!vid){
        throw new ApiError(400,"Invalid user id")
    }
    return res.status(200).json(new ApiResponse(200,vid,"Title updated successfully"))
})

const updateVideoDesc = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const{description}=req.body;
    if(description==="" || description.trim()===""){
        throw new ApiError(400,"Title is required")
    }
    if(videoId==="" || videoId.trim()===""){
        throw new ApiError(400,"Invalid id1")
    }
    const vid=await Video.findByIdAndUpdate(videoId,{$set:{
        description
    }
    },{new:true})
    if(!vid){
        throw new ApiError(400,"Invalid user id")
    }
    return res.status(200).json(new ApiResponse(200,vid,"Description updated successfully"))
})

const updateVideoThumbnail= asyncHandler(async (req,res)=>{
     const { videoId } = req.params
         const thumbnailLocalPath=req.file?.path
    if(!thumbnailLocalPath){
        throw new ApiError(400,"Thumbnail is missing")
    }

    const thumbnail=await uploadCloudinary(thumbnailLocalPath)

    if(!thumbnail){
        throw new ApiError(400,"Error while uploading thumbnail")
    }
    const video= await Video.findByIdAndUpdate(videoId,
        {$set:{thumbnail: thumbnail.url}},
        {new: true}
    )

    res.status(200).json(new ApiResponse(200,video,"Thumbnail updated successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const vid=await Video.findByIdAndDelete(videoId)
    if(!vid){
        throw new ApiError(400,"Invalid id")
    }
    return res.status(200).json(new ApiResponse(200,vid,"Video deleted Successfully!!"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const vid= await Video.findById(videoId)
    if(!vid){
        throw new ApiError(400,"Invalid id")
    }
    const newVid=await Video.findByIdAndUpdate(videoId,{$set:{
        isPublished: !vid.isPublished
    }},{new:true})
    if(!newVid){
        throw new ApiError(400,"Some problem occur while updating")
    }
    return res.status(200).json(new ApiResponse(200,newVid,"Updated successfully"))
})


export {getAllVideos, searchVideos ,getAllVideosOfChannel,publishAVideo,getVideoById,updateVideoTitle,updateVideoDesc,updateVideoThumbnail,deleteVideo,togglePublishStatus}
