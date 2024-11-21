"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("../config/common");
const mongoose_1 = __importDefault(require("mongoose"));
const seeders_1 = require("./seeders");
const seedAll = async () => {
    try {
        await mongoose_1.default.connect(common_1.CommonConfig.DATABASE_URL);
        console.log('Database connected successfully');
        await (0, seeders_1.seedEnrollments)();
        console.log('All data seeded successfully');
    }
    catch (error) {
        console.error('Error seeding the database:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
    }
};
seedAll();
