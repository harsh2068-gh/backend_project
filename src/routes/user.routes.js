import { Router } from "express";
import { registerUser } from "../controllers/user.controllers.js";
import { upload } from "../middlewares/multer.middlewares.js";
import { loginUser } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { logoutUser } from "../controllers/user.controllers.js";
import { refreshAccessToken } from "../controllers/user.controllers.js";
import { changePassword } from "../controllers/user.controllers.js";
import { getCurrentUser } from "../controllers/user.controllers.js";
import { updateProfile } from "../controllers/user.controllers.js";
import { updateAvatar } from "../controllers/user.controllers.js";
import { updateCoverImage } from "../controllers/user.controllers.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser)

router.route("/login").post(loginUser)

//secure routes:
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-pasword").post(verifyJWT, changePassword)
router.route("/current-user").post(verifyJWT, getCurrentUser)
router.route("/update-profile").post(verifyJWT, updateProfile)
router.route("/update-avatar").post(verifyJWT, upload.single("avatar"), updateAvatar)
router.route("/update-coverImage").post(verifyJWT, upload.single("coverImage"), updateCoverImage)

export default router