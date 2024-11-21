import { AdminCourseRouter } from './routes/adminCourseRoutes';
import { ClientCourseRouter } from './routes/clientCourseRoutes';
import { CourseModel } from './models/Course';
import { CourseCategoryModel } from './models/CourseCategory';
import { CourseEnrollmentModel } from './models/CourseEnrollment';
import { PermissionModel } from '../UserManagement/models/Permission';

// Export routes
export { AdminCourseRouter, ClientCourseRouter };

// Export models
export { CourseModel, CourseCategoryModel, CourseEnrollmentModel };

// Initialize function for setting up default permissions
export const initializeCourseManagement = async () => {
  try {
    const defaultPermissions = [
      // Course Permissions
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
      
      // Category Permissions
      { 
        name: 'Manage Categories', 
        description: 'Can manage course categories', 
        code: 'CATEGORY_MANAGE', 
        module: 'COURSE_MANAGEMENT' 
      },
      
      // Enrollment Permissions
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

    // Upsert permissions
    for (const perm of defaultPermissions) {
      await PermissionModel.findOneAndUpdate(
        { code: perm.code },
        perm,
        { upsert: true }
      );
    }

    console.log('Course Management module initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Course Management module:', error);
    throw error;
  }
}; 