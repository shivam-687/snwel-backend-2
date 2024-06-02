"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedEnrollments = exports.seedAllSettings = void 0;
// seeders/seeders.ts
const User_1 = require("../models/User");
const Setting_1 = require("../models/Setting");
const seedConfig_1 = require("./seedConfig");
const CourseModel_1 = require("../models/CourseModel");
const CourseEnrollment_1 = __importDefault(require("../models/CourseEnrollment"));
const seedSetting = async (setting) => {
    try {
        const existingSetting = await Setting_1.SettingModel.findOneAndUpdate({ code: setting.code }, { data: setting.data, isChangable: setting.isChangable }, { new: true, upsert: true } // Create if not found, update if found
        );
        if (existingSetting) {
            console.log(`Setting with code ${setting.code} updated successfully`);
        }
        else {
            console.log(`Setting with code ${setting.code} seeded successfully`);
        }
    }
    catch (error) {
        console.error(`Error seeding setting with code ${setting.code}:`, error);
    }
};
const seedAllSettings = async () => {
    for (const setting of seedConfig_1.allSettings) {
        await seedSetting(setting);
    }
};
exports.seedAllSettings = seedAllSettings;
// Add other seeding functions for different collections as needed
// For example, seeding users, courses, etc.
const seedEnrollments = async () => {
    async function getRandomElement(arr) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    try {
        const users = await User_1.UserModel.find();
        const courses = await CourseModel_1.CourseModel.find();
        const enrollmentStatuses = ['ACTIVE', 'PENDING', 'DECLINED'];
        const paymentStatuses = ['PAID', 'PENDING', 'FAILED'];
        const paymentMethods = ['CASH', 'EXTERNAL', 'INAPP'];
        const enrollments = [];
        for (let i = 0; i < 20; i++) {
            const user = await getRandomElement(users);
            const course = await getRandomElement(courses);
            const exists = await CourseEnrollment_1.default.findOne({ userId: user._id, courseId: course._id });
            if (exists)
                return;
            const enrollment = new CourseEnrollment_1.default({
                userId: user._id,
                courseId: course._id,
                status: await getRandomElement(enrollmentStatuses),
                paymentStatus: await getRandomElement(paymentStatuses),
                paymentMethod: await getRandomElement(paymentMethods),
                expiredAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
                otp: {
                    otp: Math.random().toString(36).substring(7),
                    expirationTime: new Date(new Date().getTime() + 15 * 60 * 1000), // OTP valid for 15 minutes
                    verified: false,
                }
            });
            enrollments.push(enrollment);
        }
        await CourseEnrollment_1.default.insertMany(enrollments);
        console.log(`${10} enrollments created successfully`);
    }
    catch (error) {
        console.error(`Error seeding enrollment :`, error);
    }
};
exports.seedEnrollments = seedEnrollments;
