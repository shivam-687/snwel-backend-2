// seeders/seeders.ts
import { UserModel } from '../models/User';
import { SettingModel } from '../models/Setting';
import { allSettings } from './seedConfig';
import { CourseModel } from '../models/CourseModel';
import CourseEnrollment from '../models/CourseEnrollment';


const seedSetting = async (setting: any) => {
    try {
        const existingSetting = await SettingModel.findOneAndUpdate(
            { code: setting.code },
            { data: setting.data, isChangable: setting.isChangable },
            { new: true, upsert: true } // Create if not found, update if found
        );

        if (existingSetting) {
            console.log(`Setting with code ${setting.code} updated successfully`);
        } else {
            console.log(`Setting with code ${setting.code} seeded successfully`);
        }
    } catch (error) {
        console.error(`Error seeding setting with code ${setting.code}:`, error);
    }
};

export const seedAllSettings = async () => {
    for (const setting of allSettings) {
        await seedSetting(setting);
    }
};

// Add other seeding functions for different collections as needed
// For example, seeding users, courses, etc.

export const seedEnrollments = async () => {
    async function getRandomElement(arr: any[]) {
        return arr[Math.floor(Math.random() * arr.length)];
    }
    
    try {
        const users = await UserModel.find();
        const courses = await CourseModel.find();

        const enrollmentStatuses = ['ACTIVE', 'PENDING', 'DECLINED'];
        const paymentStatuses = ['PAID', 'PENDING', 'FAILED'];
        const paymentMethods = ['CASH', 'EXTERNAL', 'INAPP'];

        const enrollments = [];

        for (let i = 0; i < 20; i++) {
            const user = await getRandomElement(users);
            const course = await getRandomElement(courses);
            const exists = await CourseEnrollment.findOne({userId: user._id, courseId: course._id})
            if(exists) return;
            const enrollment = new CourseEnrollment({
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

        await CourseEnrollment.insertMany(enrollments);

        console.log(`${10} enrollments created successfully`);
    } catch (error) {
        console.error(`Error seeding enrollment :`, error);
    }
}
