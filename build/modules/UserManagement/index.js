"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeUserManagement = exports.RoleService = exports.ClientUserService = exports.AdminUserService = exports.RoleModel = exports.PermissionModel = exports.ClientUserRouter = exports.AdminUserRouter = void 0;
const adminUserRoutes_1 = require("./routes/adminUserRoutes");
Object.defineProperty(exports, "AdminUserRouter", { enumerable: true, get: function () { return adminUserRoutes_1.AdminUserRouter; } });
const clientUserRoutes_1 = require("./routes/clientUserRoutes");
Object.defineProperty(exports, "ClientUserRouter", { enumerable: true, get: function () { return clientUserRoutes_1.ClientUserRouter; } });
const Permission_1 = require("./models/Permission");
Object.defineProperty(exports, "PermissionModel", { enumerable: true, get: function () { return Permission_1.PermissionModel; } });
const Role_1 = require("./models/Role");
Object.defineProperty(exports, "RoleModel", { enumerable: true, get: function () { return Role_1.RoleModel; } });
var adminUserService_1 = require("./services/adminUserService");
Object.defineProperty(exports, "AdminUserService", { enumerable: true, get: function () { return adminUserService_1.AdminUserService; } });
var clientUserService_1 = require("./services/clientUserService");
Object.defineProperty(exports, "ClientUserService", { enumerable: true, get: function () { return clientUserService_1.ClientUserService; } });
var roleService_1 = require("./services/roleService");
Object.defineProperty(exports, "RoleService", { enumerable: true, get: function () { return roleService_1.RoleService; } });
const initializeUserManagement = async () => {
    try {
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
        for (const perm of defaultPermissions) {
            await Permission_1.PermissionModel.findOneAndUpdate({ code: perm.code }, perm, { upsert: true });
        }
        const allPermissions = await Permission_1.PermissionModel.find();
        await Role_1.RoleModel.findOneAndUpdate({ name: 'SUPER_ADMIN' }, {
            name: 'SUPER_ADMIN',
            description: 'Super Administrator with all permissions',
            permissions: allPermissions.map(p => p._id),
            isSystem: true,
            isActive: true
        }, { upsert: true });
        console.log('User Management module initialized successfully');
    }
    catch (error) {
        console.error('Failed to initialize User Management module:', error);
        throw error;
    }
};
exports.initializeUserManagement = initializeUserManagement;
