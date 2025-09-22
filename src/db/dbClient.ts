import { CommonConfig } from '@/config/common';
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (!CommonConfig.DATABASE_URL || CommonConfig.DATABASE_URL.trim().length === 0) {
            throw new Error('DATABASE_URL is not set. Please provide a valid MongoDB connection string.');
        }

        // Recommended mongoose settings
        mongoose.set('strictQuery', true);

        // Basic connection listeners for troubleshooting
        mongoose.connection.on('connected', () => {
            const { host, port, name } = mongoose.connection;
            console.log(`MongoDB connected: ${host}:${port}/${name}`);
        });
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err.message);
        });
        mongoose.connection.on('disconnected', () => {
            console.warn('MongoDB disconnected');
        });

        await mongoose.connect(CommonConfig.DATABASE_URL, {
            // You can tune timeouts here if needed
            serverSelectionTimeoutMS: 10000,
        } as any);
    } catch (error: any) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

export default connectDB;
