import { Request, Response } from 'express';
import { catchAsync } from '@/utils/helpers/catchAsync';
import { successResponse } from '@/utils/helpers/appResponse';
import { PermissionModel } from '@/modules/UserManagement';

/**
 * GET /api/admin/permissions
 * Get all available permissions with categories
 */
export const listAllPermissions = catchAsync(async (req: Request, res: Response) => {
  const permissions = await PermissionModel.find().sort({ module: 1, code: 1 }).lean();

  // Map to the required format with category names
  const categoryMap: Record<string, string> = {
    USER_MANAGEMENT: 'User & Access',
    COURSE_MANAGEMENT: 'Content Management',
    SETTINGS: 'System & Settings',
    FILE: 'Content Management',
    WEBINAR: 'Content Management',
    ENQUIRY: 'Enrollments & Enquiries',
    JOB: 'Jobs & Recruitment',
    JOB_CATEGORY: 'Jobs & Recruitment',
    MASTER: 'System & Settings',
    PAYMENT: 'Enrollments & Enquiries',
    JOB_APPLICATION: 'Jobs & Recruitment',
    OTP: 'System & Settings',
    GALLERY: 'Content Management',
    INTEGRATION: 'System & Settings',
    SNWEL_ENQUIRY: 'Enrollments & Enquiries',
    BLOG: 'Content Management',
    BLOG_CATEGORY: 'Content Management',
    WIDGET: 'System & Settings',
    ANALYTICS: 'System & Settings',
  };

  const formattedPermissions = permissions.map((perm: any) => ({
    code: perm.code,
    name: perm.name,
    category: categoryMap[perm.module] || 'Other',
    description: perm.description || `Ability to ${perm.name.toLowerCase()}`,
  }));

  // Extract unique categories
  const categories = Array.from(new Set(formattedPermissions.map((p) => p.category)));

  successResponse(
    {
      permissions: formattedPermissions,
      categories,
    },
    res,
    { message: 'Permissions fetched successfully' }
  );
});

/**
 * GET /api/admin/permissions-all
 * Returns flat list of permissions in raw shape required by frontend
 */
export const listAllPermissionsFlat = catchAsync(async (req: Request, res: Response) => {
  const permissions = await PermissionModel.find()
    .select('code name description module -_id')
    .sort({ module: 1, code: 1 })
    .lean();

  res.status(200).json({
    success: true,
    data: permissions,
  });
});
