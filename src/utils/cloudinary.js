import { v2 as cloudinary } from "cloudinary"
import fs from "fs"

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) { return null }
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto"
        })
        // console.log("file has been uploaded on cloudinary ", response.url)
        fs.unlinkSync(localFilePath)
        return response
        
    } catch (e) {
        fs.unlinkSync(localFilePath)
        return null
    }
}

const deleteFromCloudinary = async (publicId) => {
    try {
        if (!publicId) {
            return null
        }
        const deleted = await cloudinary.uploader.destroy(publicId)
        console.log(`File deleted from cloudinary: ${deleted.result}`)
    } catch (e) {
        console.error(`Error deleting file from cloudinary: ${e.message}`)
    }
}

export { uploadOnCloudinary, deleteFromCloudinary } 