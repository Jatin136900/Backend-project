import mongoose from "mongoose";
import "dotenv/config";


async function connectToDB() {
    try {
        await mongoose.connect(process.env.MONGO_URL)

    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

    export default connectToDB; 
