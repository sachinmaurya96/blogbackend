import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";
export const connectDb = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log("mongodb connected")
    } catch (error) {
        console.log("mongodb connection failed",error)
        process.exit(1)
    }
}