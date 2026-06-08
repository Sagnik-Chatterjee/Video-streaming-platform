import mongoose, {isValidObjectId} from "mongoose"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    const userId=req.user._id
    const sub= await Subscription.aggregate([{
        $match:{
            channel: new mongoose.Types.ObjectId(channelId),
            subscriber: new mongoose.Types.ObjectId(userId)
        }
    }])
    if(sub.length==0){
        const s=await Subscription.create({
            channel: channelId,
            subscriber: userId
        })
        if(!s){
            throw new ApiError(400,"Error in subscribing")
        }
        return res.status(200).json(new ApiResponse(200,s, "Subscribed successfully"))
    }
    const s=await Subscription.findOneAndDelete({
        subscriber: userId
    })
    if(!s){
        throw new ApiError(400,"Some error occured")
    }
    return res.status(200).json(new ApiResponse(200, s,"Unsubscribed successfully"))
})


// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {subscriberId} = req.params
    const subscribers=await Subscription.aggregate([
            {
                $match:{
                    channel: new mongoose.Types.ObjectId(subscriberId)
                }
            },
            {
                $lookup:{
                    from: "users",
                    localField: "subscriber",
                    foreignField: "_id",
                    as: "subscriber"
                }
            },{
                $project:{
                    _id: 1,
                    channel: 1,
                    subscriber:{
                    username: 1,
                    avatar: 1,
                    coverImage: 1
                    }
                }
            }
        ])
        if(!subscribers){
            throw new ApiError(400,"Cannot fetch subscribers")
        }
        return res.status(200).json(new ApiResponse(200,subscribers,"Subscribers fetched successfully"))

})


// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    const subscribed=await Subscription.aggregate([
            {
                $match:{
                    subscriber: new mongoose.Types.ObjectId(channelId)
                }
            },
            {
                $lookup:{
                    from: "users",
                    localField: "channel",
                    foreignField: "_id",
                    as: "channel"
                }
            },{
                $project:{
                    _id: 1,
                    channel: 1,
                    subscriber:{
                    username: 1,
                    avatar: 1,
                    coverImage: 1
                    }
                }
            }
        ])
        if(!subscribed){
            throw new ApiError(400,"Cannot fetch subscribers")
        }
        return res.status(200).json(new ApiResponse(200,subscribed,"Subscribers fetched successfully"))

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}