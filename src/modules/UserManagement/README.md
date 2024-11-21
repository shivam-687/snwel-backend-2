
# User Management Module

A comprehensive user management system with role-based access control (RBAC) for managing users, roles, and permissions.

## Features

- Role-based access control (RBAC)
- Multi-role support for users
- Permission-based API access
- Separate admin and client APIs
- User status management (active/inactive)
- Profile management for users

## Module Structure

```
src/modules/UserManagement/
├── models/
│   ├── User.ts         # User model with role support
│   ├── Role.ts         # Role model with permissions
│   └── Permission.ts   # Permission model
├── services/
│   ├── adminUserService.ts   # Admin user operations
│   ├── clientUserService.ts  # Client user operations
│   └── roleService.ts        # Role management
├── controllers/
│   ├── adminUserController.ts
│   └── clientUserController.ts
├── routes/
│   ├── adminUserRoutes.ts
│   └── clientUserRoutes.ts
└── middleware/
    └── checkPermission.ts
```

## API Endpoints

### Admin Routes (`/api/admin/users`)

| Method | Endpoint       | Permission Required | Description           |
|--------|---------------|--------------------|-----------------------|
| POST   | /             | USER_CREATE        | Create new user       |
| GET    | /             | USER_VIEW          | List all users        |
| PUT    | /:id          | USER_UPDATE        | Update user          |
| DELETE | /:id          | USER_DELETE        | Delete user          |
| PATCH  | /:id/status   | USER_UPDATE        | Toggle user status   |
| POST   | /:id/roles    | ROLE_ASSIGN        | Assign roles to user |

### Client Routes (`/api/users`)

| Method | Endpoint         | Description              |
|--------|-----------------|--------------------------|
| GET    | /profile        | Get user profile         |
| PUT    | /profile        | Update profile           |
| POST   | /change-password| Change password          |
| DELETE | /account        | Delete account           |

## Permission System

### Available Permissions

```typescript
const defaultPermissions = [
  {
    name: 'Create User',
    code: 'USER_CREATE',
    module: 'USER_MANAGEMENT'
  },
  {
    name: 'View Users',
    code: 'USER_VIEW',
    module: 'USER_MANAGEMENT'
  },
  {
    name: 'Update User',
    code: 'USER_UPDATE',
    module: 'USER_MANAGEMENT'
  },
  {
    name: 'Delete User',
    code: 'USER_DELETE',
    module: 'USER_MANAGEMENT'
  },
  {
    name: 'Assign Roles',
    code: 'ROLE_ASSIGN',
    module: 'USER_MANAGEMENT'
  }
]
```

## Usage

### Initialize Module

The module automatically initializes when the application starts:

```typescript
import { initializeUserManagement } from '@/modules/UserManagement';

// In your app initialization
await initializeUserManagement();
```

### Check Permissions in Routes

```typescript
import { checkPermission } from '@/modules/UserManagement/middleware/checkPermission';

router.post('/', checkPermission('USER_CREATE'), controller.createUser);
```

### Service Layer Examples

#### Admin Service

```typescript
// Create user
const user = await AdminUserService.createUser(userData);

// Assign roles
await AdminUserService.assignRoles(userId, roleIds);
```

#### Client Service

```typescript
// Get profile
const profile = await ClientUserService.getProfile(userId);

// Update profile
await ClientUserService.updateProfile(userId, updateData);
```

## Models

### User Model

- Supports multiple roles
- Tracks active status
- Stores basic profile information

### Role Model

- Links to permissions
- Supports system roles (protected from modification)
- Tracks active status

### Permission Model

- Module-based organization
- Unique permission codes
- Descriptive names and descriptions

## Security Features

1. JWT Authentication required for all routes
2. Permission-based access control
3. Protected system roles
4. Sanitized profile updates
5. Password change verification

## Error Handling

All services include proper error handling and meaningful error messages. Errors are propagated through the application's error handling middleware.

## Contributing

When adding new features:

1. Follow the existing pattern for services and controllers
2. Add appropriate permissions
3. Update documentation
4. Include proper error handling

## Next.js Integration

### 1. API Route Setup

Create API routes in your Next.js application:

```typescript:app/api/admin/users/route.ts
import { AdminUserRouter } from '@/modules/UserManagement';
import { createEdgeRouter } from 'next-connect';
import { NextRequest } from 'next/server';

const router = createEdgeRouter<NextRequest, any>();

// Apply the AdminUserRouter routes
router.use('/api/admin/users', AdminUserRouter);

export { router as GET, router as POST, router as PUT, router as DELETE, router as PATCH };
```

### 2. Authentication Setup

Create a middleware for JWT verification:

```typescript:middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyJWT } from '@/lib/jwt';

export async function middleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.split(' ')[1];

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const decoded = await verifyJWT(token);
    // Add user to request
    request.user = decoded;
    return NextResponse.next();
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}

export const config = {
  matcher: ['/api/admin/users/:path*', '/api/users/:path*'],
};
```

### 3. Frontend Implementation

#### React Query Setup

```typescript:lib/react-query.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
});
```

#### Custom Hooks

```typescript:hooks/useUsers.ts
import { useQuery, useMutation } from '@tanstack/react-query';
import { axios } from '@/lib/axios';

export const useUsers = (options = {}) => {
  return useQuery({
    queryKey: ['users', options],
    queryFn: () => axios.get('/api/admin/users', { params: options }),
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: (userData) => axios.post('/api/admin/users', userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};
```

#### Permission Hook

```typescript:hooks/usePermission.ts
import { useAuth } from '@/hooks/useAuth';

export const usePermission = (requiredPermission: string) => {
  const { user } = useAuth();
  
  if (!user?.roles) return false;
  
  return user.roles.some(role => 
    role.permissions.some(permission => permission.code === requiredPermission)
  );
};
```

#### Component Example

```typescript:app/admin/users/page.tsx
'use client';

import { useUsers, useCreateUser } from '@/hooks/useUsers';
import { usePermission } from '@/hooks/usePermission';
import { PERMISSIONS } from '@/config/permissions';

export default function UsersPage() {
  const canCreateUser = usePermission(PERMISSIONS.USER_MANAGEMENT.CREATE);
  const { data: users, isLoading } = useUsers();
  const createUser = useCreateUser();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {canCreateUser && (
        <button onClick={() => createUser.mutate(userData)}>
          Create User
        </button>
      )}
      {/* User list rendering */}
    </div>
  );
}
```

### 4. Environment Setup

Add these variables to your `.env.local`:

```env
NEXTAUTH_SECRET=your-jwt-secret
NEXTAUTH_URL=http://localhost:3000
```

### 5. TypeScript Configuration

Update your `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./*"]
    },
    "types": ["@types/node"]
  }
}
```

## Best Practices

1. Always use the permission hooks for conditional rendering
2. Implement proper error boundaries
3. Use React Query for server state management
4. Implement proper loading states
5. Handle token expiration gracefully

## Common Issues

1. **Token Expiration**: Implement a refresh token mechanism
2. **Race Conditions**: Use React Query's built-in features
3. **Type Safety**: Ensure proper TypeScript types for API responses
4. **Performance**: Implement proper caching strategies


