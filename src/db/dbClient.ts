import { CommonConfig } from '@/config/common';
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const connection = await mongoose.connect(CommonConfig.DATABASE_URL, {});
        console.log(`MongoDB connected: ${connection.connection.host}`);
    } catch (error: any) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
