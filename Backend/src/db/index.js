import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectDB=async()=>{
    try{
        const uri = process.env.MONGODB_URI;
const connectionString = uri.includes('?') 
    ? uri.replace('/?', `/${DB_NAME}?`) 
    : `${uri}/${DB_NAME}`;

const connectionInstance = await mongoose.connect(connectionString);
console.log("Mongodb connected")
    }catch(error){
        console.log("Mongpodb Connection error",error)
        process.exit(1)
    }
}

export default connectDB