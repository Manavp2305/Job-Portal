import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const connectDB = async () => {
    try {
        const uri = process.env.MONGO_URI; // Get MongoDB URI from .env file
        if (!uri) {
            throw new Error("MONGO_URI is missing in .env file");
        }
        const conn = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        process.exit(1);
    }
};

export default connectDB;
