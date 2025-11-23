# Blog API Documentation

This document outlines the API endpoints for the Blog module, separated into Admin and Guest interfaces.

## Base URL
All API requests should be prefixed with the API base URL (e.g., `/api/v1` or `/api` depending on configuration).

## Data Model
The Blog entity contains the following fields:
- `title`: String (Required)
- `slug`: String (Unique)
- `content`: String (Required)
- `author`: ObjectId (Ref: User)
- `coverImage`: String
- `excerpt`: String
- `tags`: Array of Strings
- `category`: ObjectId (Ref: BlogCategory)
- `published`: Boolean (Default: false)
- `publishedAt`: Date
- `views`: Number
- `createdAt`: Date
- `updatedAt`: Date

---

## Admin APIs
**Authentication**: Required (JWT)
**Permissions**: Required (Role-based Access Control)

### 1. Get Blog Statistics
- **Endpoint**: `GET /blogs/statistics`
- **Permission**: `BLOG_VIEW`
- **Description**: Retrieves statistics about blogs.

### 2. Create Blog
- **Endpoint**: `POST /blogs`
- **Permission**: `BLOG_CREATE`
- **Description**: Creates a new blog post.
- **Body**:
  ```json
  {
    "title": "Blog Title",
    "content": "Blog Content...",
    "published": true,
    "tags": ["tag1", "tag2"],
    "category": "categoryId"
  }
  ```

### 3. Get All Blogs (Admin)
- **Endpoint**: `GET /blogs`
- **Permission**: `BLOG_VIEW`
- **Description**: Retrieves all blogs with pagination and filtering. Admins can see both published and unpublished blogs.
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `search`: Search term (title, content, author)
  - `filter[statusFilter]`: `published`, `unpublished`, or `all` (default: `all`)

### 4. Get Blog by ID (Admin)
- **Endpoint**: `GET /blogs/:id`
- **Permission**: `BLOG_VIEW`
- **Description**: Retrieves a single blog by ID. Admins can view unpublished blogs.

### 5. Update Blog
- **Endpoint**: `PUT /blogs/:id`
- **Permission**: `BLOG_UPDATE`
- **Description**: Updates an existing blog.
- **Body**: (Partial Blog Object)

### 6. Soft Delete Blog
- **Endpoint**: `DELETE /blogs/:id`
- **Permission**: `BLOG_DELETE`
- **Description**: Soft deletes a blog.

### 7. Hard Delete All Soft-Deleted Blogs
- **Endpoint**: `DELETE /blogs/hard-delete`
- **Permission**: `BLOG_DELETE`
- **Description**: Permanently deletes all soft-deleted blogs.

---

## Guest APIs
**Authentication**: Not Required
**Access**: Public (Published content only)

### 1. Get All Blogs (Guest)
- **Endpoint**: `GET /guest/blogs`
- **Description**: Retrieves all **published** blogs.
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page
  - `search`: Search term
  - `sort`: Sort order

### 2. Get Blog by ID (Guest)
- **Endpoint**: `GET /guest/blogs/:id`
- **Description**: Retrieves a single **published** blog by ID or Slug.
- **Note**: If the blog is not published, it will return 404 or null.
