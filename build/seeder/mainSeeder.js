"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// seeders/mainSeeder.ts
const common_1 = require("../config/common");
const mongoose_1 = __importDefault(require("mongoose"));
const seeders_1 = require("./seeders");
// Import other seeding functions as needed
const seedAll = async () => {
    try {
        await mongoose_1.default.connect(common_1.CommonConfig.DATABASE_URL);
        console.log('Database connected successfully');
        // await seedAllSettings();
        // Run other seeding functions as needed
        // await CourseCategoryModel.deleteMany({});
        // await UserModel.deleteMany({});
        // await CourseModel.deleteMany({});
        // await WebinarModel.deleteMany({});
        // // Insert Course Categories
        // const insertedCategories = await CourseCategoryModel.insertMany(courseCategories);
        // // Insert Users
        // const insertedUsers = await UserModel.insertMany(users);
        // // Insert Courses
        // courses.forEach((course, index) => {
        //     course.categories.push(insertedCategories[index % insertedCategories.length]._id as never);
        //     course.instructors.push(insertedUsers[index % insertedUsers.length]._id as never);
        // });
        // const insertedCourses = await CourseModel.insertMany(courses);
        // // Insert Webinars
        // webinars.forEach((webinar, index) => {
        //     webinar.hosts.push(insertedUsers[index % insertedUsers.length]._id as never);
        //     webinar.createdBy = insertedUsers[index % insertedUsers.length]._id;
        // });
        // await WebinarModel.insertMany(webinars);
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
