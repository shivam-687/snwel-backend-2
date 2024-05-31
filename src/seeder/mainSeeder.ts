// seeders/mainSeeder.ts
import { CommonConfig } from '../config/common';
import mongoose from 'mongoose';
import { CourseCategoryModel } from '../models/CourseCategory';
import { UserModel } from '../models/User';
import { CourseModel } from '../models/CourseModel';
import { WebinarModel } from '../models/WebinarModel';
import { courseCategories, courses, users, webinars } from "./seedData";
import { seedEnrollments } from './seeders';
// Import other seeding functions as needed

const seedAll = async () => {
    try {
        await mongoose.connect(CommonConfig.DATABASE_URL);
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
        await seedEnrollments();
        console.log('All data seeded successfully');
    } catch (error) {
        console.error('Error seeding the database:', error);
    }finally{
        await mongoose.disconnect();
    }
};

seedAll();
