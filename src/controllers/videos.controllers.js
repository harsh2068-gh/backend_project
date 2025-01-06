import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { Video } from "../models/videos.model.js";
import { User } from "../models/users.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiErrors.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
// const { ObjectId } = mongoose.Types

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, userId, sortBy = "createdAt", sortType = "desc", query } = req.query
    if (
        [query].some((field) => field === undefined || field?.trim() === "") //fix it later
    ) {
        throw new ApiError(400, "Provide all the required queries")
    }
    // const convertedId = ObjectId(userId)
    const sortDirection = (sortType === "asc") ? 1 : -1

    const channel = await User.findOne({ username: query })
    if (!channel) {
        throw new ApiError(400, "Queried channel does not existed")
    }

    const pipeline = [
        {
            $match: {
                $and: [
                    { owner: channel._id },
                    { isPublished: { $ne: false } }
                ]
            }
        },
        {
            $sort: { [sortBy]: sortDirection }
        }
    ]

    const options = {
        page: parseInt(page, 10),
        limit: parseInt(limit, 10)
    }

    const fetchedVideos = await Video.aggregatePaginate(Video.aggregate(pipeline), options)
    // console.log(fetchedVideos?.length)   //undefined as object doesnt have the length property
    // if(!fetchedVideos?.length){     //aggregate.Paginate returns an object 
    if(!fetchedVideos){
        throw new ApiError(500,"something went wrong while fetching the requested videos")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, fetchedVideos, "Requested user's videos fetched successfully")
        )
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description, isPublished } = req.body
    // TODO: get video, upload to cloudinary, create video
    /*
    take inputs from the user
    get filepath from files object
    upload the files to cloudinary and get its url
    get duration from cloudinary
    get user's _id from the req.user object
    create a new videos doc
    extract the videos doc object and send it with response
    */
    if (
        [title, description].some((field) => field === undefined || field?.trim() === "")
    ) {
        throw new ApiError(400, "Provide both title and description")
    }
    // const videoPath = req.files?.video[0]?.path
    let videoPath   //optimize this
    if (req.files && Array.isArray(req.files.video) && req.files.video.length > 0) {
        videoPath = req.files.video[0].path
    }

    // const thumbnailPath = req.files?.thumbnail[0]?.path
    let thumbnailPath
    if (req.files && Array.isArray(req.files.thumbnail) && req.files.thumbnail.length > 0) {
        thumbnailPath = req.files.thumbnail[0].path
    }

    if (!(videoPath && thumbnailPath)) {
        throw new ApiError(400, "Provide both Video and Thumbnail")
    }

    const uploadedVideo = await uploadOnCloudinary(videoPath)
    const uploadedThumbnail = await uploadOnCloudinary(thumbnailPath)

    if (!uploadedVideo) {
        throw new ApiError(500, "Something went wrong while uploading Video to cloudinary")
    }
    if (!uploadedThumbnail) {
        throw new ApiError(500, "Something went wrong while uploading Thumbnail to cloudinary")
    }

    const videoObj = await Video.create({
        videoFile: uploadedVideo.url,
        thumbnail: uploadedThumbnail.url,
        title: title,
        description: description,
        duration: uploadedVideo.duration,
        owner: req.user._id,
        // isPublished: //add this feature
    })

    const videoDoc = await Video.findById(videoObj?._id)

    if (!videoDoc) {
        throw new ApiError(500, "Error uploading the video")
    }
    return res
        .status(200)
        .json(
            new ApiResponse(200, videoDoc, "Video uploaded successfully")
        )

})

export { getAllVideos, publishAVideo }