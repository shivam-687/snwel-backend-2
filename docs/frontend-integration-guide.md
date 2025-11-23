# Frontend Integration Guide

This guide provides comprehensive documentation for integrating the backend APIs into your frontend application.

## Table of Contents
- [Authentication](#authentication)
- [Blog APIs](#blog-apis)
- [Testimonial APIs](#testimonial-apis)
- [Error Handling](#error-handling)
- [Best Practices](#best-practices)

---

## Authentication

### Admin/Protected Endpoints
All admin endpoints require JWT authentication. Include the token in the Authorization header:

```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```

### Guest/Public Endpoints
Public endpoints (prefixed with `/guest/`) do not require authentication.

---

## Blog APIs

### Public Blog APIs (Guest)

#### Get All Published Blogs
```javascript
// GET /guest/blogs
const fetchBlogs = async (page = 1, limit = 10, search = '') => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search })
  });
  
  const response = await fetch(`/api/guest/blogs?${params}`);
  const data = await response.json();
  return data;
};

// Response Format
{
  "success": true,
  "data": {
    "docs": [
      {
        "_id": "...",
        "title": "Blog Title",
        "slug": "blog-title",
        "content": "Blog content...",
        "excerpt": "Short description",
        "coverImage": "https://...",
        "author": {
          "_id": "...",
          "name": "Author Name",
          "email": "author@example.com",
          "profilePic": "https://..."
        },
        "category": {
          "_id": "...",
          "name": "Category Name",
          "slug": "category-slug"
        },
        "tags": ["tag1", "tag2"],
        "published": true,
        "publishedAt": "2025-11-23T12:00:00.000Z",
        "views": 100,
        "createdAt": "2025-11-23T12:00:00.000Z",
        "updatedAt": "2025-11-23T12:00:00.000Z"
      }
    ],
    "totalDocs": 50,
    "limit": 10,
    "page": 1,
    "totalPages": 5,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "message": "Blogs fetched successfully!"
}
```

#### Get Single Blog by ID or Slug
```javascript
// GET /guest/blogs/:id
const fetchBlogById = async (idOrSlug) => {
  const response = await fetch(`/api/guest/blogs/${idOrSlug}`);
  const data = await response.json();
  return data;
};

// Usage
const blog = await fetchBlogById('blog-slug');
// or
const blog = await fetchBlogById('507f1f77bcf86cd799439011');
```

### Admin Blog APIs (Protected)

#### Create Blog
```javascript
// POST /blogs
const createBlog = async (blogData, token) => {
  const response = await fetch('/api/blogs', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      title: "Blog Title",
      content: "Blog content...",
      excerpt: "Short description",
      coverImage: "https://...",
      tags: ["tag1", "tag2"],
      category: "categoryId",
      published: false // or true
    })
  });
  return await response.json();
};
```

#### Get All Blogs (Admin)
```javascript
// GET /blogs
const fetchAllBlogs = async (token, filters = {}) => {
  const params = new URLSearchParams({
    page: filters.page || '1',
    limit: filters.limit || '10',
    ...(filters.search && { search: filters.search }),
    ...(filters.statusFilter && { 'filter[statusFilter]': filters.statusFilter })
  });
  
  const response = await fetch(`/api/blogs?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};

// Usage
const blogs = await fetchAllBlogs(token, {
  page: 1,
  limit: 10,
  statusFilter: 'all' // 'published', 'unpublished', or 'all'
});
```

#### Update Blog
```javascript
// PUT /blogs/:id
const updateBlog = async (blogId, updateData, token) => {
  const response = await fetch(`/api/blogs/${blogId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });
  return await response.json();
};
```

#### Delete Blog
```javascript
// DELETE /blogs/:id
const deleteBlog = async (blogId, token) => {
  const response = await fetch(`/api/blogs/${blogId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

---

## Testimonial APIs

### Public Testimonial APIs (Guest)

#### Get All Published Testimonials
```javascript
// GET /guest/testimonials
const fetchTestimonials = async (page = 1, limit = 10) => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString()
  });
  
  const response = await fetch(`/api/guest/testimonials?${params}`);
  const data = await response.json();
  return data;
};

// Response Format
{
  "success": true,
  "data": {
    "docs": [
      {
        "_id": "...",
        "name": "John Doe",
        "position": "CEO",
        "company": "Tech Corp",
        "content": "Great service!",
        "avatar": "https://...",
        "rating": 5,
        "published": true,
        "publishedAt": "2025-11-23T12:00:00.000Z",
        "createdAt": "2025-11-23T12:00:00.000Z",
        "updatedAt": "2025-11-23T12:00:00.000Z"
      }
    ],
    "totalDocs": 20,
    "limit": 10,
    "page": 1,
    "totalPages": 2,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "message": "Testimonials fetched successfully!"
}
```

#### Get Single Testimonial
```javascript
// GET /guest/testimonials/:id
const fetchTestimonialById = async (id) => {
  const response = await fetch(`/api/guest/testimonials/${id}`);
  const data = await response.json();
  return data;
};
```

### Admin Testimonial APIs (Protected)

#### Create Testimonial
```javascript
// POST /testimonials
const createTestimonial = async (testimonialData, token) => {
  const response = await fetch('/api/testimonials', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: "John Doe",
      position: "CEO",
      company: "Tech Corp",
      content: "Great service!",
      avatar: "https://...",
      rating: 5,
      published: false // or true
    })
  });
  return await response.json();
};
```

#### Get All Testimonials (Admin)
```javascript
// GET /testimonials
const fetchAllTestimonials = async (token, filters = {}) => {
  const params = new URLSearchParams({
    page: filters.page || '1',
    limit: filters.limit || '10',
    ...(filters.search && { search: filters.search }),
    ...(filters.statusFilter && { 'filter[statusFilter]': filters.statusFilter })
  });
  
  const response = await fetch(`/api/testimonials?${params}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};

// Usage
const testimonials = await fetchAllTestimonials(token, {
  page: 1,
  limit: 10,
  statusFilter: 'all' // 'published', 'draft', or 'all'
});
```

#### Update Testimonial
```javascript
// PUT /testimonials/:id
const updateTestimonial = async (testimonialId, updateData, token) => {
  const response = await fetch(`/api/testimonials/${testimonialId}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  });
  return await response.json();
};
```

#### Delete Testimonial
```javascript
// DELETE /testimonials/:id
const deleteTestimonial = async (testimonialId, token) => {
  const response = await fetch(`/api/testimonials/${testimonialId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  return await response.json();
};
```

---

## Error Handling

### Standard Error Response
```javascript
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error information"
}
```

### Example Error Handling
```javascript
const fetchWithErrorHandling = async (url, options = {}) => {
  try {
    const response = await fetch(url, options);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

---

## Best Practices

### 1. Use Environment Variables
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
```

### 2. Create API Service Layer
```javascript
// services/blogService.js
export const blogService = {
  getAll: (params) => fetch(`${API_BASE_URL}/guest/blogs?${new URLSearchParams(params)}`),
  getById: (id) => fetch(`${API_BASE_URL}/guest/blogs/${id}`),
  // ... more methods
};
```

### 3. Implement Pagination Component
```javascript
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div>
      <button 
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        Previous
      </button>
      <span>Page {currentPage} of {totalPages}</span>
      <button 
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        Next
      </button>
    </div>
  );
};
```

### 4. Use React Query (Recommended)
```javascript
import { useQuery } from '@tanstack/react-query';

const useBlogs = (page = 1) => {
  return useQuery({
    queryKey: ['blogs', page],
    queryFn: () => fetchBlogs(page)
  });
};

// Usage in component
const BlogList = () => {
  const { data, isLoading, error } = useBlogs(1);
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {data.data.docs.map(blog => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
};
```

### 5. Implement Search with Debounce
```javascript
import { useState, useEffect } from 'react';

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
};

// Usage
const SearchBlogs = () => {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const { data } = useBlogs(1, debouncedSearch);
  
  return (
    <input 
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search blogs..."
    />
  );
};
```

---

## TypeScript Types (Optional)

```typescript
// types/blog.ts
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  coverImage?: string;
  author: {
    _id: string;
    name: string;
    email: string;
    profilePic?: string;
  };
  category: {
    _id: string;
    name: string;
    slug: string;
  };
  tags: string[];
  published: boolean;
  publishedAt?: string;
  views: number;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    docs: T[];
    totalDocs: number;
    limit: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  message: string;
}

// types/testimonial.ts
export interface Testimonial {
  _id: string;
  name: string;
  position?: string;
  company?: string;
  content: string;
  avatar?: string;
  rating?: number;
  published: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```
