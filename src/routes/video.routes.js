import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { publishAVideo, getAllVideos } from "../controllers/videos.controllers.js";

const router = Router()
router.use(verifyJWT)

router
    .route("/upload")
    .post(
        upload.fields([
            {
                name: "video",
                maxCount: 1
            },
            {
                name: "thumbnail",
                maxCount: 1
            }
        ]),
        publishAVideo
    )
router.route("/").get(getAllVideos)

export default router