import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`db connected on ${conn.connection.host}`.bgGreen);
    } catch (error) {
        console.log(`db connection failed ${error.message}`.bgBlack)
    }
}

export default connectDB;