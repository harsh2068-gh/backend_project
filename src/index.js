// require("dotenv").config({path:"./env"})
// import mongoose from "mongoose"
// import { DB_NAME } from "./constants";
import express from "express"
import connectDB from "./db/index.js";
import dotenv from "dotenv"
dotenv.config({
    path: "./env"
})


connectDB()


















////normal approach
// const app =express()
// ; (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("errror",(e)=>{
//             console.log("Error: ",e)
//             throw error
//         })
//         app.listen(process.env.PORT,()=>{
//             console.log(`App is listening on port ${process.env.PORT}`)
//         })
//     } catch (e) {
//         console.error("Error: ", e)
//         throw err
//     }
// })()
