import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { Video } from "../models/users.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiErrors.js";
const { ObjectId } = mongoose.Types

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, userId, sortBy, sortType } = req.query
    if (
        [page, limit, userId, sortBy, sortType].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "Provide all the required queries")
    }
    const convertedId = ObjectId(userId)
    const sortDirection = (sortType === "asc") ? 1 : -1

    const pipeline = [
        {
            $match: {
                $and: [
                    { owner: convertedId },
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

    return res
        .status(200)
        .json(
            new ApiResponse(200, fetchedVideos, "Requested user's videos fetched successfully")
        )
})

export { getAllVideos }