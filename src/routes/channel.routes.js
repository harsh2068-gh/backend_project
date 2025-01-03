import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middlewares.js"
import { getChannelProfile } from "../controllers/user.controllers.js"

const router = Router()

router.route("/:username").get(verifyJWT, getChannelProfile)

export default router 