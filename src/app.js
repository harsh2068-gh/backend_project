import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))
app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"));
app.use(cookieParser())

//routes
import userRouter from "./routes/user.routes.js"
import channelRouter from "./routes/channel.routes.js"
import videoRouter from "./routes/video.routes.js"

app.use("/api/v1/users", userRouter)
app.use("/api/v1/channels", channelRouter)
app.use("/api/v1/videos",videoRouter)

// export default app
export { app }