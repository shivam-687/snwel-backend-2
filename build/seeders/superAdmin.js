"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const Role_1 = require("../modules/UserManagement/models/Role");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const Permission_1 = require("../modules/UserManagement/models/Permission");
dotenv_1.default.config();
const SUPER_ADMIN_DATA = {
    name: 'Snwel Admin',
    email: 'admin@snwelacademy.com',
    password: 'Admin@123',
    phone: '+919876543210',
    location: {
        addr: 'Snwel Academy',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India'
    },
    isActive: true
};
const SUPER_ADMIN_ROLE = {
    name: 'SUPER_ADMIN',
    description: 'Super Administrator with full system access',
    permissions: []
};
async function seedSuperAdmin() {
    try {
        await mongoose_1.default.connect(process.env.DATABASE_URL);
        console.log('Connected to MongoDB');
        const existingRole = await Role_1.RoleModel.findOne({ name: SUPER_ADMIN_ROLE.name });
        const allPermissions = await Permission_1.PermissionModel.find({});
        SUPER_ADMIN_ROLE.permissions = allPermissions.map(permission => permission._id);
        let roleId;
        if (!existingRole) {
            const newRole = await Role_1.RoleModel.create(SUPER_ADMIN_ROLE);
            roleId = newRole._id;
            console.log('Super Admin role created');
        }
        else {
            roleId = existingRole._id;
            console.log('Super Admin role already exists');
        }
        const existingUser = await User_1.UserModel.findOne({ email: SUPER_ADMIN_DATA.email });
        if (!existingUser) {
            const superAdmin = await User_1.UserModel.create(Object.assign(Object.assign({}, SUPER_ADMIN_DATA), { roles: [roleId] }));
            console.log('Super Admin user created successfully');
            console.log('Email:', SUPER_ADMIN_DATA.email);
            console.log('Password:', SUPER_ADMIN_DATA.password);
        }
        else {
            console.log('Super Admin user already exists');
        }
    }
    catch (error) {
        console.error('Error seeding super admin:', error);
    }
    finally {
        await mongoose_1.default.disconnect();
        console.log('Disconnected from MongoDB');
    }
}
seedSuperAdmin();
