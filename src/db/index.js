import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config();
consl

const connectDB = async () => {

    try {

        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB connection successfull");

    } catch (error) {

        console.error("DB connection failed");
        process.exit(1);

    }
}

export default connectDB
