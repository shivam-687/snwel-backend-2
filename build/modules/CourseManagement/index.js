"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCourseManagement = exports.CourseEnrollmentModel = exports.CourseCategoryModel = exports.CourseModel = exports.ClientCourseRouter = exports.AdminCourseRouter = void 0;
const adminCourseRoutes_1 = require("./routes/adminCourseRoutes");
Object.defineProperty(exports, "AdminCourseRouter", { enumerable: true, get: function () { return adminCourseRoutes_1.AdminCourseRouter; } });
const clientCourseRoutes_1 = require("./routes/clientCourseRoutes");
Object.defineProperty(exports, "ClientCourseRouter", { enumerable: true, get: function () { return clientCourseRoutes_1.ClientCourseRouter; } });
const Course_1 = require("./models/Course");
Object.defineProperty(exports, "CourseModel", { enumerable: true, get: function () { return Course_1.CourseModel; } });
const CourseCategory_1 = require("./models/CourseCategory");
Object.defineProperty(exports, "CourseCategoryModel", { enumerable: true, get: function () { return CourseCategory_1.CourseCategoryModel; } });
const CourseEnrollment_1 = require("./models/CourseEnrollment");
Object.defineProperty(exports, "CourseEnrollmentModel", { enumerable: true, get: function () { return CourseEnrollment_1.CourseEnrollmentModel; } });
const Permission_1 = require("../UserManagement/models/Permission");
const initializeCourseManagement = async () => {
    try {
        const defaultPermissions = [
            {
                name: 'Create Course',
                description: 'Can create new courses',
                code: 'COURSE_CREATE',
                module: 'COURSE_MANAGEMENT'
            },
            {
                name: 'View Courses',
                description: 'Can view course list',
                code: 'COURSE_VIEW',
                module: 'COURSE_MANAGEMENT'
            },
            {
                name: 'Update Course',
                description: 'Can update course details',
                code: 'COURSE_UPDATE',
                module: 'COURSE_MANAGEMENT'
            },
            {
                name: 'Delete Course',
                description: 'Can delete courses',
                code: 'COURSE_DELETE',
                module: 'COURSE_MANAGEMENT'
            },
            {
                name: 'Publish Course',
                description: 'Can publish/unpublish courses',
                code: 'COURSE_PUBLISH',
                module: 'COURSE_MANAGEMENT'
            },
            {
                name: 'Manage Categories',
                description: 'Can manage course categories',
                code: 'CATEGORY_MANAGE',
                module: 'COURSE_MANAGEMENT'
            },
            {
                name: 'Manage Enrollments',
                description: 'Can manage course enrollments',
                code: 'ENROLLMENT_MANAGE',
                module: 'COURSE_MANAGEMENT'
            },
            {
                name: 'View Enrollments',
                description: 'Can view course enrollments',
                code: 'ENROLLMENT_VIEW',
                module: 'COURSE_MANAGEMENT'
            }
        ];
        for (const perm of defaultPermissions) {
            await Permission_1.PermissionModel.findOneAndUpdate({ code: perm.code }, perm, { upsert: true });
        }
        console.log('Course Management module initialized successfully');
    }
    catch (error) {
        console.error('Failed to initialize Course Management module:', error);
        throw error;
    }
};
exports.initializeCourseManagement = initializeCourseManagement;
