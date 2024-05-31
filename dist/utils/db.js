"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@/config/common");
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async () => {
    try {
        console.log("Mongoose connecting...", common_1.CommonConfig.DATABASE_URL);
        const connection = await mongoose_1.default.connect('mongodb://127.0.0.1:27017/snwel', {});
        console.log(`MongoDB connected: ${connection.connection.host}`);
    }
    catch (error) {
        console.error(`Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};
exports.default = connectDB;
