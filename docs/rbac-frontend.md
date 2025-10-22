# Frontend RBAC Guide

This document explains how to control the UI using server-provided roles and permission codes.

## API Endpoints

- GET `/auth/me` (authenticated)
  - Returns the current user, roles, and a flat list of permission codes.
  - Example response:
    ```json
    {
      "id": "...",
      "email": "admin@snwelacademy.com",
      "name": "Snwel Admin",
      "roles": [{ "_id": "...", "name": "SUPER_ADMIN" }],
      "permissions": [
        "USER_CREATE", "ROLE_ASSIGN", "COURSE_VIEW", "FILE_UPLOAD", "WEBINAR_VIEW", "JOB_VIEW", "BLOG_PUBLISH"
      ],
      "picture": null
    }
    ```
    Note: Permissions list is truncated for brevity. See "Common permission codes" below for the full catalog.

- POST `/auth/login`
  - Returns a JWT and user basics (also includes roles on login). Store the token and then call `/auth/me` to refresh.

## How to use permissions in the UI

- Persist the JWT (e.g., in memory + localStorage) and fetch `/auth/me` on app load to hydrate an AuthContext.
- Store:
  - `user`: `{ id, email, name, picture }`
  - `roles`: `string[]`
  - `permissions`: `Set<string>` for O(1) checks

### Helper utilities

- `hasPerm(perm: string): boolean`
- `hasAny(perms: string[]): boolean`
- `hasAll(perms: string[]): boolean`

Example (TypeScript):
```ts
function createAuthHelpers(permissions: string[]) {
  const set = new Set(permissions);
  return {
    hasPerm: (p: string) => set.has(p),
    hasAny: (arr: string[]) => arr.some(p => set.has(p)),
    hasAll: (arr: string[]) => arr.every(p => set.has(p)),
  };
}
```

### Conditional rendering examples (React)

- Show "Create User" button only if allowed:
```tsx
{hasPerm('USER_CREATE') && (
  <Button onClick={openCreateUserModal}>Create User</Button>
)}
```

- Disable actions when missing permission:
```tsx
<Button disabled={!hasPerm('USER_UPDATE')} onClick={save}>Save</Button>
```

- Guard routes:
```tsx
<Route
  path="/admin/users"
  element={hasPerm('USER_VIEW') ? <UserList /> : <Navigate to="/403" replace />}
/>
```

### Common permission codes

- **User/Role Management**
  - `USER_CREATE`, `USER_VIEW`, `USER_UPDATE`, `USER_DELETE`
  - `ROLE_ASSIGN`, `ROLE_CREATE`, `ROLE_VIEW`, `ROLE_UPDATE`, `ROLE_DELETE`
  - Optional: `ROLE_ASSIGN_PERMISSION`

- **Course Management**
  - `COURSE_CREATE`, `COURSE_VIEW`, `COURSE_UPDATE`, `COURSE_DELETE`, `COURSE_PUBLISH`
  - `CATEGORY_MANAGE`
  - `ENROLLMENT_VIEW`, `ENROLLMENT_MANAGE`

- **Settings**
  - `SETTINGS_VIEW`, `SETTINGS_UPDATE`

- **Files**
  - `FILE_UPLOAD`, `FILE_VIEW`, `FILE_DELETE`

- **Webinars**
  - `WEBINAR_CREATE`, `WEBINAR_VIEW`, `WEBINAR_UPDATE`, `WEBINAR_DELETE`, `WEBINAR_PUBLISH`

- **Enquiries**
  - `ENQUIRY_VIEW`, `ENQUIRY_UPDATE`, `ENQUIRY_DELETE`, `ENQUIRY_EXPORT`

- **Jobs**
  - `JOB_CREATE`, `JOB_VIEW`, `JOB_UPDATE`, `JOB_DELETE`, `JOB_PUBLISH`

- **Job Categories**
  - `JOB_CATEGORY_CREATE`, `JOB_CATEGORY_VIEW`, `JOB_CATEGORY_UPDATE`, `JOB_CATEGORY_DELETE`

- **Masters**
  - `MASTER_CREATE`, `MASTER_VIEW`, `MASTER_UPDATE`, `MASTER_DELETE`

- **Payments**
  - `PAYMENT_VIEW`, `PAYMENT_REFUND`, `PAYMENT_EXPORT`

- **Job Applications**
  - `JOB_APP_VIEW`, `JOB_APP_UPDATE`, `JOB_APP_DELETE`, `JOB_APP_EXPORT`

- **OTP**
  - `OTP_SEND`, `OTP_VIEW`

- **Gallery**
  - `GALLERY_CREATE`, `GALLERY_VIEW`, `GALLERY_UPDATE`, `GALLERY_DELETE`

- **Integrations**
  - `INTEGRATION_VIEW`, `INTEGRATION_UPDATE`

- **Snwel Enquiry**
  - `SNWEL_ENQUIRY_VIEW`, `SNWEL_ENQUIRY_UPDATE`, `SNWEL_ENQUIRY_DELETE`, `SNWEL_ENQUIRY_EXPORT`

- **Blog**
  - `BLOG_CREATE`, `BLOG_VIEW`, `BLOG_UPDATE`, `BLOG_DELETE`, `BLOG_PUBLISH`

- **Blog Category**
  - `BLOG_CATEGORY_CREATE`, `BLOG_CATEGORY_VIEW`, `BLOG_CATEGORY_UPDATE`, `BLOG_CATEGORY_DELETE`

- **Widgets**
  - `WIDGET_CREATE`, `WIDGET_VIEW`, `WIDGET_UPDATE`, `WIDGET_DELETE`

- **Analytics**
  - `ANALYTICS_VIEW`

Always prefer reading codes from a shared constants file to avoid typos.

## Super Admin behavior

- Super Admin role is configured to include all permissions. A Super Admin should see and access all admin UI features.

## Caching and refresh

- Refresh `/auth/me` on login and periodically if needed (or when the app regains focus) to reflect permission changes.
- On permission change events (e.g., role updated in admin), refetch `/auth/me`.

## Security note

- UI checks are for user experience only. All sensitive operations are also enforced on the backend with permission middleware.

## Troubleshooting

- Seeing 403 in API calls: ensure your token is valid and your user has the needed permission code.
- A button is hidden unexpectedly: confirm `/auth/me` returns the expected `permissions` array and that the code strings match exactly.
