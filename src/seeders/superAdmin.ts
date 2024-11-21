import { UserModel } from '../models/User';
import { RoleModel } from '../modules/UserManagement/models/Role';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { PermissionModel } from '../modules/UserManagement/models/Permission';

dotenv.config();

const SUPER_ADMIN_DATA = {
  name: 'Snwel Admin',
  email: 'admin@snwelacademy.com',
  password: 'Admin@123', // Remember to change this in production
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
    // Connect to MongoDB
    await mongoose.connect(process.env.DATABASE_URL as string);
    console.log('Connected to MongoDB');

    // Create Super Admin Role if it doesn't exist
    const existingRole = await RoleModel.findOne({ name: SUPER_ADMIN_ROLE.name });
    const allPermissions = await PermissionModel.find({});
    SUPER_ADMIN_ROLE.permissions = allPermissions.map(permission => permission._id) as any;
    let roleId;

    if (!existingRole) {
      const newRole = await RoleModel.create(SUPER_ADMIN_ROLE);
      roleId = newRole._id;
      console.log('Super Admin role created');
    } else {
      roleId = existingRole._id;
      console.log('Super Admin role already exists');
    }

    // Check if Super Admin user already exists
    const existingUser = await UserModel.findOne({ email: SUPER_ADMIN_DATA.email });

    if (!existingUser) {
      // Create Super Admin user
      const superAdmin = await UserModel.create({
        ...SUPER_ADMIN_DATA,
        roles: [roleId],
      });
      console.log('Super Admin user created successfully');
      console.log('Email:', SUPER_ADMIN_DATA.email);
      console.log('Password:', SUPER_ADMIN_DATA.password);
    } else {
      console.log('Super Admin user already exists');
    }

  } catch (error) {
    console.error('Error seeding super admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the seeder
seedSuperAdmin(); 