# Permission System Guide for Frontend Developers

## Overview

This guide explains the permission system implemented in the SNWEL backend and how frontend developers should handle permission-based UI restrictions.

## Permission Error Response Format

When a user lacks the required permission, the API returns a `403 Forbidden` status with the following JSON structure:

```json
{
  "success": false,
  "code": "PERMISSION_DENIED",
  "message": "You do not have permission to perform this action",
  "requiredPermission": "PERMISSION_CODE"
}
```

### Other Error Codes

- **`UNAUTHORIZED`** (401): User is not authenticated
- **`USER_NOT_FOUND`** (403): User account not found
- **`PERMISSION_CHECK_ERROR`** (500): Server error while checking permissions

## How to Handle Permission Errors in Frontend

```javascript
// Example: Axios interceptor
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 403 && error.response?.data?.code === 'PERMISSION_DENIED') {
      // Show permission denied message
      const requiredPermission = error.response.data.requiredPermission;
      showNotification(`You need ${requiredPermission} permission to perform this action`);
      // Optionally hide/disable UI elements
    }
    return Promise.reject(error);
  }
);
```

## Permission Codes by Module

### 1. User Management Module (`USER_MANAGEMENT`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `USER_CREATE` | Can create new users | POST /api/admin/users |
| `USER_VIEW` | Can view user list and details | GET /api/admin/users, GET /api/admin/users/:id |
| `USER_UPDATE` | Can update user details | PUT /api/admin/users/:id, PATCH /api/admin/users/:id/status |
| `USER_DELETE` | Can delete users | DELETE /api/admin/users/:id |
| `ROLE_ASSIGN` | Can assign roles to users | POST /api/admin/users/:id/roles |
| `ROLE_CREATE` | Can create new roles | POST /api/admin/roles |
| `ROLE_VIEW` | Can view role list | GET /api/admin/roles, GET /api/admin/roles/:id |
| `ROLE_UPDATE` | Can update role details | PUT /api/admin/roles/:id, PATCH /api/admin/roles/:id/permissions |
| `ROLE_DELETE` | Can delete roles | DELETE /api/admin/roles/:id |

**Frontend Implementation:**
```javascript
// Example: Hide "Create User" button if user lacks permission
const userPermissions = useSelector(state => state.auth.permissions);

const canCreateUser = userPermissions.includes('USER_CREATE');
const canViewUsers = userPermissions.includes('USER_VIEW');
const canEditUser = userPermissions.includes('USER_UPDATE');
const canDeleteUser = userPermissions.includes('USER_DELETE');

return (
  <div>
    {canCreateUser && <Button onClick={createUser}>Create User</Button>}
    {canViewUsers && <UserList />}
  </div>
);
```

---

### 2. Course Management Module (`COURSE_MANAGEMENT`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `COURSE_CREATE` | Can create courses | POST /api/admin/courses |
| `COURSE_VIEW` | Can view courses | GET /api/admin/courses, GET /api/admin/courses/:id |
| `COURSE_UPDATE` | Can update courses | PUT /api/admin/courses/:id |
| `COURSE_DELETE` | Can delete courses | DELETE /api/admin/courses/:id |
| `COURSE_PUBLISH` | Can publish courses | PATCH /api/admin/courses/:id/publish |
| `CATEGORY_MANAGE` | Can manage course categories | All course category endpoints |
| `ENROLLMENT_VIEW` | Can view enrollments | GET /api/admin/enrollments |
| `ENROLLMENT_MANAGE` | Can manage enrollments | PATCH /api/admin/enrollments/:id/status |

**Frontend Implementation:**
```javascript
// Example: Conditional rendering for course actions
const CourseActions = ({ course }) => {
  const permissions = usePermissions();
  
  return (
    <div>
      {permissions.has('COURSE_UPDATE') && (
        <Button onClick={() => editCourse(course.id)}>Edit</Button>
      )}
      {permissions.has('COURSE_PUBLISH') && !course.published && (
        <Button onClick={() => publishCourse(course.id)}>Publish</Button>
      )}
      {permissions.has('COURSE_DELETE') && (
        <Button onClick={() => deleteCourse(course.id)}>Delete</Button>
      )}
    </div>
  );
};
```

---

### 3. Blog Module (`BLOG`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `BLOG_CREATE` | Can create blog posts | POST /api/admin/blogs |
| `BLOG_VIEW` | Can view blog posts (admin) | GET /api/admin/blogs, GET /api/admin/blogs/:id |
| `BLOG_UPDATE` | Can update blog posts | PUT /api/admin/blogs/:id |
| `BLOG_DELETE` | Can delete blog posts | DELETE /api/admin/blogs/:id |
| `BLOG_PUBLISH` | Can publish blog posts | Update blog with `published: true` |

**Note:** Public blog viewing (guest routes) does not require authentication.

---

### 4. Blog Category Module (`BLOG_CATEGORY`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `BLOG_CATEGORY_CREATE` | Can create blog categories | POST /api/blog/categories |
| `BLOG_CATEGORY_VIEW` | Can view blog categories | GET /api/blog/categories (public) |
| `BLOG_CATEGORY_UPDATE` | Can update blog categories | PUT /api/blog/categories/:id |
| `BLOG_CATEGORY_DELETE` | Can delete blog categories | DELETE /api/blog/categories/:id |

---

### 5. Job Management Module (`JOB`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `JOB_CREATE` | Can create job vacancies | POST /api/jobs |
| `JOB_VIEW` | Can view job vacancies (admin) | GET /api/jobs/statistics |
| `JOB_UPDATE` | Can update job vacancies | PUT /api/jobs/:id |
| `JOB_DELETE` | Can delete job vacancies | DELETE /api/jobs/:id |
| `JOB_PUBLISH` | Can publish job vacancies | Update job with publish status |

**Note:** Public job listing does not require authentication.

---

### 6. Job Category Module (`JOB_CATEGORY`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `JOB_CATEGORY_CREATE` | Can create job categories | POST /api/job-categories |
| `JOB_CATEGORY_VIEW` | Can view job categories | GET /api/job-categories (public) |
| `JOB_CATEGORY_UPDATE` | Can update job categories | PUT /api/job-categories/:id |
| `JOB_CATEGORY_DELETE` | Can delete job categories | DELETE /api/job-categories/:id |

---

### 7. Job Application Module (`JOB_APPLICATION`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `JOB_APP_VIEW` | Can view job applications | GET /api/job-applications, GET /api/job-applications/:id |
| `JOB_APP_UPDATE` | Can update job applications | PUT /api/job-applications/:id |
| `JOB_APP_DELETE` | Can delete job applications | DELETE /api/job-applications/:id |
| `JOB_APP_EXPORT` | Can export job applications | GET /api/job-applications/export |

**Note:** Submitting job applications (POST) is public and doesn't require authentication.

---

### 8. Webinar Module (`WEBINAR`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `WEBINAR_CREATE` | Can create webinars | POST /api/webinars |
| `WEBINAR_VIEW` | Can view webinars (admin) | GET /api/webinars (authenticated) |
| `WEBINAR_UPDATE` | Can update webinars | PUT /api/webinars/:id, POST /api/webinars/:id/hosts |
| `WEBINAR_DELETE` | Can delete webinars | DELETE /api/webinars/:id |
| `WEBINAR_PUBLISH` | Can publish webinars | Update webinar with publish status |

**Note:** Public webinar viewing is available via `/api/webinars/open` and `/api/webinars/slug/:slug`.

---

### 9. Enquiry Module (`ENQUIRY`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `ENQUIRY_VIEW` | Can view enquiries | GET /api/enquiries, GET /api/enquiries/:id |
| `ENQUIRY_UPDATE` | Can update enquiries | PUT /api/enquiries/:id |
| `ENQUIRY_DELETE` | Can delete enquiries | DELETE /api/enquiries/:id |
| `ENQUIRY_EXPORT` | Can export enquiries | GET /api/enquiries/export |

**Note:** Submitting enquiries (POST) is public.

---

### 10. SNWEL Enquiry Module (`SNWEL_ENQUIRY`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `SNWEL_ENQUIRY_VIEW` | Can view Snwel enquiries | GET /api/snwel-enquiries, GET /api/snwel-enquiries/:id |
| `SNWEL_ENQUIRY_UPDATE` | Can update Snwel enquiries | PUT /api/snwel-enquiries/:id |
| `SNWEL_ENQUIRY_DELETE` | Can delete Snwel enquiries | DELETE /api/snwel-enquiries/:id |
| `SNWEL_ENQUIRY_EXPORT` | Can export Snwel enquiries | GET /api/snwel-enquiries/export |

---

### 11. Gallery Module (`GALLERY`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `GALLERY_CREATE` | Can create gallery assets | POST /api/gallery, POST /api/gallery/bulk-upsert |
| `GALLERY_VIEW` | Can view gallery | GET /api/gallery (public) |
| `GALLERY_UPDATE` | Can update gallery | PUT /api/gallery/:id |
| `GALLERY_DELETE` | Can delete gallery | DELETE /api/gallery/:id |

---

### 12. Widget Module (`WIDGET`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `WIDGET_CREATE` | Can create widgets | POST /api/widgets |
| `WIDGET_VIEW` | Can view widgets | GET /api/widgets (public) |
| `WIDGET_UPDATE` | Can update widgets | PUT /api/widgets/:id |
| `WIDGET_DELETE` | Can delete widgets | DELETE /api/widgets/:id |

---

### 13. Integration Module (`INTEGRATION`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `INTEGRATION_VIEW` | Can view integrations | GET /api/integrations, GET /api/integrations/:id, GET /api/integrations/types |
| `INTEGRATION_UPDATE` | Can update integrations | POST /api/integrations, PUT /api/integrations/:id, DELETE /api/integrations/:id |

---

### 14. Settings Module (`SETTINGS`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `SETTINGS_VIEW` | Can view settings | GET /api/settings (public) |
| `SETTINGS_UPDATE` | Can update settings | POST /api/settings, PUT /api/settings/:code, PATCH /api/settings/:code, DELETE /api/settings/:code |

---

### 15. File Module (`FILE`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `FILE_UPLOAD` | Can upload files | POST /api/files/upload, POST /api/files/upload-multi |
| `FILE_VIEW` | Can view files | GET /api/files/files |
| `FILE_DELETE` | Can delete files | DELETE /api/files/:id |

---

### 16. Master Data Module (`MASTER`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `MASTER_CREATE` | Can create master data | POST /api/masters |
| `MASTER_VIEW` | Can view master data | GET /api/masters (public) |
| `MASTER_UPDATE` | Can update master data | PUT /api/masters/:idOrCode |
| `MASTER_DELETE` | Can delete master data | DELETE /api/masters/:id |

---

### 17. Payment Module (`PAYMENT`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `PAYMENT_VIEW` | Can view payments | GET /api/payments |
| `PAYMENT_REFUND` | Can refund payments | POST /api/payments/:id/refund |
| `PAYMENT_EXPORT` | Can export payments | GET /api/payments/export |

**Note:** Payment creation and webhooks are handled separately and don't require standard permissions.

---

### 18. OTP Module (`OTP`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `OTP_SEND` | Can send OTP | POST /api/otp/generate |
| `OTP_VIEW` | Can view OTP logs | GET /api/otp/logs |

**Note:** OTP verification is public for user authentication flows.

---

### 19. Analytics Module (`ANALYTICS`)

| Permission Code | Description | Required For |
|----------------|-------------|--------------|
| `ANALYTICS_VIEW` | Can view analytics | GET /api/admin/dashboard/* |

---

## Frontend Permission Helper Utilities

### React Hook Example

```javascript
// hooks/usePermissions.js
import { useSelector } from 'react-redux';

export const usePermissions = () => {
  const user = useSelector(state => state.auth.user);
  
  const permissions = user?.roles?.flatMap(role => 
    role.permissions?.map(p => p.code) || []
  ) || [];
  
  return {
    has: (permission) => permissions.includes(permission),
    hasAny: (permissionList) => permissionList.some(p => permissions.includes(p)),
    hasAll: (permissionList) => permissionList.every(p => permissions.includes(p)),
    list: permissions
  };
};

// Usage in component
const MyComponent = () => {
  const permissions = usePermissions();
  
  if (!permissions.has('USER_VIEW')) {
    return <AccessDenied />;
  }
  
  return (
    <div>
      {permissions.has('USER_CREATE') && <CreateUserButton />}
      {permissions.has('USER_UPDATE') && <EditUserButton />}
    </div>
  );
};
```

### Permission Guard Component

```javascript
// components/PermissionGuard.jsx
const PermissionGuard = ({ permission, fallback = null, children }) => {
  const permissions = usePermissions();
  
  if (!permissions.has(permission)) {
    return fallback;
  }
  
  return children;
};

// Usage
<PermissionGuard permission="USER_CREATE">
  <Button>Create User</Button>
</PermissionGuard>
```

### Route Protection

```javascript
// routes/ProtectedRoute.jsx
const ProtectedRoute = ({ permission, component: Component, ...rest }) => {
  const permissions = usePermissions();
  
  return (
    <Route
      {...rest}
      render={props =>
        permissions.has(permission) ? (
          <Component {...props} />
        ) : (
          <Redirect to="/access-denied" />
        )
      }
    />
  );
};

// Usage
<ProtectedRoute 
  path="/admin/users" 
  permission="USER_VIEW" 
  component={UserManagement} 
/>
```

## Best Practices

### 1. **Always Check Permissions on Both Frontend and Backend**
   - Frontend checks provide better UX (hide unavailable features)
   - Backend checks provide security (prevent unauthorized access)

### 2. **Handle Permission Errors Gracefully**
   ```javascript
   try {
     await api.deleteUser(userId);
   } catch (error) {
     if (error.response?.data?.code === 'PERMISSION_DENIED') {
       toast.error('You do not have permission to delete users');
     }
   }
   ```

### 3. **Cache User Permissions**
   - Store permissions in Redux/Context after login
   - Refresh when roles change
   - Clear on logout

### 4. **Progressive Disclosure**
   - Show disabled buttons with tooltips explaining required permissions
   - Better than hiding features completely

### 5. **Audit Trail**
   - Log permission-denied attempts for security monitoring
   - Help admins understand what users are trying to access

## Testing Permissions

### Test Checklist for Frontend Developers

- [ ] Verify UI elements are hidden/disabled without permission
- [ ] Test API calls return proper error codes
- [ ] Confirm error messages are user-friendly
- [ ] Check that permission changes reflect immediately
- [ ] Validate route guards work correctly
- [ ] Test with multiple roles (SUPER_ADMIN, Admin, User)

### Example Test Cases

```javascript
describe('User Management Permissions', () => {
  it('should hide Create User button without USER_CREATE permission', () => {
    const user = { roles: [{ permissions: [] }] };
    render(<UserManagement user={user} />);
    expect(screen.queryByText('Create User')).not.toBeInTheDocument();
  });
  
  it('should show permission denied error on unauthorized delete', async () => {
    mockApi.deleteUser.mockRejectedValue({
      response: { 
        status: 403, 
        data: { code: 'PERMISSION_DENIED' } 
      }
    });
    
    await userEvent.click(screen.getByText('Delete'));
    expect(screen.getByText(/permission denied/i)).toBeInTheDocument();
  });
});
```

## Summary

This permission system provides fine-grained access control across all modules. Frontend developers should:

1. **Check permissions before rendering UI elements**
2. **Handle `PERMISSION_DENIED` errors gracefully**
3. **Use the provided error codes to show appropriate messages**
4. **Implement permission guards for routes and components**
5. **Test thoroughly with different user roles**

For questions or issues, contact the backend team or refer to the API documentation.
