import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiErrors.js";
import { User } from "../models/users.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const generateAccessTokenAndRefreshToken = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, error?.message || "Something went wrong while generating access and refresh token")
    }
}

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res


    const { username, email, fullName, password } = req.body
    // console.log("email: ",email);
    if (
        [username, email, fullName, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required!")
    }

    const userExists = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (userExists) {
        throw new ApiError(409, "User already exists")
    }
    // console.log(req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path

    // const coverImageLocalPath = req.files?.coverImage[0]?.path
    let coverImageLocalPath
    if (req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length > 0) {
        coverImageLocalPath = req.files.coverImage[0].path
    }

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar image file LocalPath not found")
    }

    const avatarUpload = await uploadOnCloudinary(avatarLocalPath)
    const coverImageUpload = await uploadOnCloudinary(coverImageLocalPath)

    if (!avatarUpload) {
        throw new ApiError(400, "Avatar image not uploaded on cloud")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatarUpload.url,
        coverImage: coverImageUpload?.url || ""
    })

    //checking and removing of password and refreshToken both in one step
    const userCreated = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if (!userCreated) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(201, userCreated, "User registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    // req body -> data
    // username or email
    //find the user
    //password check
    //access and referesh token
    //send cookie

    // req body -> data
    const { email, username, password } = req.body

    // username or email
    if (!username && !email) {
        throw new ApiError(400, "username or email is required")
    }

    //find the user
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    if (!user) {
        throw new ApiError(404, "user does not exist, please register first")
    }

    //password check
    const isPasswordValid = await user.isPasswordCorrect(password)
    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials")
    }
    //access and referesh token
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User Logged In Successfully"
            )
        )
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user.id,
        {
            // $set: {
            //     refreshToken: undefined
            // }
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, {}, "User Logged Out"))
})

export { registerUser, loginUser, logoutUser }