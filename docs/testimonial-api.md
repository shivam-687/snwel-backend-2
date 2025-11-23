# Testimonial API Documentation

This document outlines the API endpoints for the Testimonial module, separated into Admin and Guest interfaces.

## Base URL
All API requests should be prefixed with the API base URL (e.g., `/api/v1` or `/api` depending on configuration).

## Data Model
The Testimonial entity contains the following fields:
- `name`: String (Required) - Person's name
- `position`: String - Job title/position
- `company`: String - Company name
- `content`: String (Required) - Testimonial text
- `avatar`: String - Profile image URL
- `rating`: Number (1-5) - Optional rating
- `published`: Boolean (Default: false) - Draft/Published status
- `publishedAt`: Date - Publication timestamp
- `createdAt`: Date
- `updatedAt`: Date

---

## Admin APIs
**Authentication**: Required (JWT)
**Permissions**: Required (Role-based Access Control)

### 1. Create Testimonial
- **Endpoint**: `POST /testimonials`
- **Permission**: `TESTIMONIAL_CREATE`
- **Description**: Creates a new testimonial.
- **Body**:
  ```json
  {
    "name": "John Doe",
    "position": "CEO",
    "company": "Tech Corp",
    "content": "Great service!",
    "avatar": "https://example.com/avatar.jpg",
    "rating": 5,
    "published": true
  }
  ```

### 2. Get All Testimonials (Admin)
- **Endpoint**: `GET /testimonials`
- **Permission**: `TESTIMONIAL_VIEW`
- **Description**: Retrieves all testimonials with pagination and filtering. Admins can see both published and draft testimonials.
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `search`: Search term (name, content, company)
  - `filter[statusFilter]`: `published`, `draft`, or `all` (default: `all`)
  - `sort`: Sort order
  - `startDate`: Filter by creation date (from)
  - `endDate`: Filter by creation date (to)

### 3. Get Testimonial by ID (Admin)
- **Endpoint**: `GET /testimonials/:id`
- **Permission**: `TESTIMONIAL_VIEW`
- **Description**: Retrieves a single testimonial by ID. Admins can view draft testimonials.

### 4. Update Testimonial
- **Endpoint**: `PUT /testimonials/:id`
- **Permission**: `TESTIMONIAL_UPDATE`
- **Description**: Updates an existing testimonial.
- **Body**: (Partial Testimonial Object)

### 5. Soft Delete Testimonial
- **Endpoint**: `DELETE /testimonials/:id`
- **Permission**: `TESTIMONIAL_DELETE`
- **Description**: Soft deletes a testimonial.

---

## Guest APIs
**Authentication**: Not Required
**Access**: Public (Published content only)

### 1. Get All Testimonials (Guest)
- **Endpoint**: `GET /guest/testimonials`
- **Description**: Retrieves all **published** testimonials.
- **Query Parameters**:
  - `page`: Page number
  - `limit`: Items per page
  - `search`: Search term
  - `sort`: Sort order

### 2. Get Testimonial by ID (Guest)
- **Endpoint**: `GET /guest/testimonials/:id`
- **Description**: Retrieves a single **published** testimonial by ID.
- **Note**: If the testimonial is not published, it will return 404.

---

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "position": "CEO",
    "company": "Tech Corp",
    "content": "Great service!",
    "avatar": "https://example.com/avatar.jpg",
    "rating": 5,
    "published": true,
    "publishedAt": "2025-11-23T12:00:00.000Z",
    "createdAt": "2025-11-23T12:00:00.000Z",
    "updatedAt": "2025-11-23T12:00:00.000Z"
  },
  "message": "Testimonial fetched successfully!"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": {
    "docs": [...],
    "totalDocs": 50,
    "limit": 10,
    "page": 1,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "message": "Testimonials fetched successfully!"
}
```
