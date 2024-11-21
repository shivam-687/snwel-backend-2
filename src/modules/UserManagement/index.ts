import { AdminUserRouter } from './routes/adminUserRoutes';
import { ClientUserRouter } from './routes/clientUserRoutes';
import { PermissionModel } from './models/Permission';
import { RoleModel } from './models/Role';

// Export routes
export { AdminUserRouter, ClientUserRouter };

// Export models
export { PermissionModel, RoleModel };

// Export services
export { AdminUserService } from './services/adminUserService';
export { ClientUserService } from './services/clientUserService';
export { RoleService } from './services/roleService';

// Initialize function for setting up default permissions and roles
export const initializeUserManagement = async () => {
  try {
    // Default permissions
    const defaultPermissions = [
      { name: 'Create User', description: 'Can create new users', code: 'USER_CREATE', module: 'USER_MANAGEMENT' },
      { name: 'View Users', description: 'Can view user list', code: 'USER_VIEW', module: 'USER_MANAGEMENT' },
      { name: 'Update User', description: 'Can update user details', code: 'USER_UPDATE', module: 'USER_MANAGEMENT' },
      { name: 'Delete User', description: 'Can delete users', code: 'USER_DELETE', module: 'USER_MANAGEMENT' },
      { name: 'Assign Roles', description: 'Can assign roles to users', code: 'ROLE_ASSIGN', module: 'USER_MANAGEMENT' },
      { name: 'Create Role', description: 'Can create new roles', code: 'ROLE_CREATE', module: 'USER_MANAGEMENT' },
      { name: 'View Roles', description: 'Can view role list', code: 'ROLE_VIEW', module: 'USER_MANAGEMENT' },
      { name: 'Update Role', description: 'Can update role details', code: 'ROLE_UPDATE', module: 'USER_MANAGEMENT' },
      { name: 'Delete Role', description: 'Can delete roles', code: 'ROLE_DELETE', module: 'USER_MANAGEMENT' },
    ];

    // Upsert permissions
    for (const perm of defaultPermissions) {
      await PermissionModel.findOneAndUpdate(
        { code: perm.code },
        perm,
        { upsert: true }
      );
    }

    // Create default SUPER_ADMIN role
    const allPermissions = await PermissionModel.find();
    await RoleModel.findOneAndUpdate(
      { name: 'SUPER_ADMIN' },
      {
        name: 'SUPER_ADMIN',
        description: 'Super Administrator with all permissions',
        permissions: allPermissions.map(p => p._id),
        isSystem: true,
        isActive: true
      },
      { upsert: true }
    );

    console.log('User Management module initialized successfully');
  } catch (error) {
    console.error('Failed to initialize User Management module:', error);
    throw error;
  }
}; 