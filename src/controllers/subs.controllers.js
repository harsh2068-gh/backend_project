import { ApiError } from "../utils/ApiErrors"
import { asyncHandler } from "../utils/asyncHandler"

const Subscribe = asyncHandler(async (req, res)=>{
    const subscribed = req.body.hasSubscribed
    if(!subscribed){
        throw new ApiError(400,"no input given")
    }
    if(!(subscribed == true)){
        return res
        .status(200)
        .json(
            new ApiError(200,{},"did not subscribe")
        )
    }
    
    
})
