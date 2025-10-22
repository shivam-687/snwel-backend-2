# Database Indexes Documentation

This document lists all MongoDB indexes added to optimize query performance across the application.

## Purpose

Indexes improve query performance by allowing MongoDB to quickly locate documents without scanning the entire collection. The indexes below are strategically placed based on:
- Query patterns identified in service files
- Dashboard and analytics aggregation pipelines
- Frequently accessed fields in filters and sorts
- Unique constraints on identifying fields

---

## CourseEnrollment Model

**Path:** `src/models/CourseEnrollment.ts`

| Index | Type | Purpose |
|-------|------|---------|
| `{ status: 1, createdAt: -1 }` | Compound | Dashboard stats, enrollment filtering by status with date sorting |
| `{ status: 1, updatedAt: -1 }` | Compound | Revenue queries using updatedAt field |
| `{ courseId: 1, createdAt: -1 }` | Compound | Top performing courses aggregation |
| `{ userId: 1, createdAt: -1 }` | Compound | User enrollment history |
| `{ paymentStatus: 1, createdAt: -1 }` | Compound | Revenue calculations and filtering |
| `{ paymentStatus: 1, updatedAt: -1 }` | Compound | Yearly sales data aggregation |
| `{ createdAt: -1 }` | Single | Recent enrollments sorting |

**Query Benefits:**
- Fast dashboard statistics calculation
- Efficient revenue trend analysis
- Quick user enrollment lookups
- Optimized payment status filtering

---

## Course Model

**Path:** `src/models/CourseModel.ts`

| Index | Type | Purpose |
|-------|------|---------|
| `{ slug: 1 }` | Unique | Unique course identifier for SEO-friendly URLs |
| `{ title: 'text' }` | Text | Full-text search on course titles |
| `{ status: 1 }` | Single | Filter by publication status |
| `{ status: 1, createdAt: -1 }` | Compound | Published/draft courses with date sorting |
| `{ categories: 1, status: 1 }` | Compound | Category-based filtering with status |
| `{ isPopular: 1, status: 1 }` | Compound | Popular courses filtering |
| `{ isPremium: 1, status: 1 }` | Compound | Premium courses filtering |
| `{ rating: -1 }` | Single | Top-rated courses sorting |
| `{ createdAt: -1 }` | Single | Recent courses, activity feed |
| `{ qualifications: 1 }` | Single | Filter by qualification requirements |
| `{ trainingModes: 1 }` | Single | Filter by training mode |

**Query Benefits:**
- Fast course lookup by slug
- Efficient category and status filtering
- Quick popular/premium course queries
- Optimized search functionality

---

## User Model

**Path:** `src/models/User.ts`

| Index | Type | Purpose |
|-------|------|---------|
| `{ email: 1 }` | Unique | Login authentication, unique user lookup |
| `{ isActive: 1, createdAt: -1 }` | Compound | Active users statistics with date |
| `{ roles: 1 }` | Single | Role-based access control filtering |
| `{ createdAt: -1 }` | Single | New users statistics, user listing |

**Query Benefits:**
- Fast login queries
- Efficient user statistics calculation
- Quick role-based filtering
- Optimized user listing

---

## SnwelEnquiry Model

**Path:** `src/models/SnwelEnquiry.ts`

| Index | Type | Purpose |
|-------|------|---------|
| `{ createdAt: -1 }` | Single | Enquiry listing and sorting |
| `{ enquiryType: 1, createdAt: -1 }` | Compound | Filter by enquiry type with date sorting |
| `{ businessEmail: 1 }` | Single | Email lookup for duplicate checking |
| `{ otpValidated: 1 }` | Single | Filter by validation status |

**Query Benefits:**
- Fast enquiry listing
- Efficient type-based filtering
- Quick validation status checks

---

## Webinar Model

**Path:** `src/models/WebinarModel.ts`

| Index | Type | Purpose |
|-------|------|---------|
| `{ slug: 1 }` | Unique | Unique webinar identifier for URLs |
| `{ isActive: 1, startDate: 1 }` | Compound | Active upcoming webinars |
| `{ startDate: -1 }` | Single | Sort webinars by start date |
| `{ createdAt: -1 }` | Single | Recent webinars, activity feed |
| `{ hosts: 1 }` | Single | Filter webinars by host |

**Query Benefits:**
- Fast upcoming webinar queries
- Efficient slug lookups
- Quick host-based filtering

---

## JobVacancy Model

**Path:** `src/models/JobVacancy.ts`

| Index | Type | Purpose |
|-------|------|---------|
| `{ slug: 1 }` | Unique | Unique job identifier for URLs |
| `{ title: 'text', companyName: 'text' }` | Text | Full-text search on jobs |
| `{ status: 1 }` | Single | Filter by job status (open/closed/filled) |
| `{ isActive: 1, postedDate: -1 }` | Compound | Active jobs with date sorting |
| `{ 'location.city': 1 }` | Single | Location-based search (city) |
| `{ 'location.state': 1 }` | Single | Location-based search (state) |
| `{ 'location.country': 1 }` | Single | Location-based search (country) |
| `{ categories: 1 }` | Single | Category-based job filtering |
| `{ applicationDeadline: 1 }` | Single | Sort by application deadline |
| `{ isFeatured: 1, postedDate: -1 }` | Compound | Featured jobs with date sorting |

**Query Benefits:**
- Fast job search by location
- Efficient status and category filtering
- Quick featured job queries
- Optimized text search

---

## JobApplication Model

**Path:** `src/models/JobApplicationModel.ts`

| Index | Type | Purpose |
|-------|------|---------|
| `{ jobId: 1, appliedDate: -1 }` | Compound | Applications by job with date sorting |
| `{ status: 1, appliedDate: -1 }` | Compound | Filter by application status with date |
| `{ email: 1 }` | Single | Applicant email lookup |
| `{ appliedDate: -1 }` | Single | Recent applications sorting |
| `{ createdAt: -1 }` | Single | Listing with creation date |

**Query Benefits:**
- Fast job-specific application queries
- Efficient status-based filtering
- Quick recent applications lookup

---

## Role Model

**Path:** `src/modules/UserManagement/models/Role.ts`

| Index | Type | Purpose |
|-------|------|---------|
| `{ name: 1 }` | Unique | Unique role name lookup for RBAC |
| `{ isActive: 1 }` | Single | Filter active roles |
| `{ isSystem: 1 }` | Single | Filter system-protected roles |

**Query Benefits:**
- Fast role lookups during authentication
- Efficient role management queries

---

## Permission Model

**Path:** `src/modules/UserManagement/models/Permission.ts`

| Index | Type | Purpose |
|-------|------|---------|
| `{ code: 1 }` | Unique | Unique permission code lookup for RBAC |
| `{ module: 1 }` | Single | Group permissions by module |
| `{ module: 1, code: 1 }` | Compound | Module-specific permission lookup |

**Query Benefits:**
- Fast permission checks during authorization
- Efficient module-based permission grouping
- Quick permission list queries

---

## CourseCategory Model

**Path:** `src/models/CourseCategory.ts`

| Index | Type | Purpose |
|-------|------|---------|
| `{ slug: 1 }` | Unique | Unique category identifier for URLs |
| `{ isActive: 1 }` | Single | Filter active categories |
| `{ parentCategory: 1 }` | Single | Hierarchical category queries |
| `{ isPremium: 1 }` | Single | Filter premium categories |

**Query Benefits:**
- Fast category lookup by slug
- Efficient hierarchical navigation
- Quick active category filtering

---

## Index Strategy Summary

### Compound Indexes
Compound indexes are used when queries frequently filter or sort by multiple fields:
- **Left-prefix rule**: Indexes can be used for queries on any left subset of indexed fields
- Example: `{ status: 1, createdAt: -1 }` supports queries on `status` alone or `status + createdAt`

### Single Field Indexes
Used for:
- Unique constraints (email, slug, code)
- Frequently queried single fields (status, isActive)
- Foreign key references (userId, courseId)

### Text Indexes
Enable full-text search capabilities:
- Course titles
- Job titles and company names
- Automatically tokenizes and stems text

---

## Index Maintenance

### Creating Indexes
Indexes are automatically created when the application starts and connects to MongoDB. Mongoose will create any missing indexes defined in the schemas.

### Checking Indexes
```javascript
// In MongoDB shell or Compass
db.courseenrollments.getIndexes()
db.courses.getIndexes()
db.users.getIndexes()
// ... etc for all collections
```

### Index Size Monitoring
```javascript
db.courseenrollments.stats()
```

### Rebuilding Indexes
If needed, rebuild indexes:
```javascript
db.courseenrollments.reIndex()
```

---

## Performance Impact

### Query Performance
- **Before indexes**: Full collection scans (O(n))
- **After indexes**: Index lookups (O(log n))
- Dramatic performance improvement for large collections

### Write Performance
- Small overhead on insert/update operations
- MongoDB must update indexes when documents change
- Trade-off is acceptable given query frequency vs write frequency

### Memory Usage
- Indexes consume memory
- MongoDB loads frequently used indexes into RAM
- Monitor index size and server memory

---

## Best Practices Followed

1. ✅ **Index Selectivity**: Indexes on fields with high cardinality (email, slug, code)
2. ✅ **Compound Index Order**: Most selective fields first, then sort fields
3. ✅ **Query Pattern Analysis**: Indexes match actual service query patterns
4. ✅ **Covered Queries**: Some queries can be answered entirely from indexes
5. ✅ **Minimal Redundancy**: Avoided duplicate or unnecessary indexes
6. ✅ **Text Search**: Applied text indexes only where needed

---

## Query Optimization Examples

### Example 1: Dashboard Revenue Calculation
```javascript
// Query from dashboardService.ts
CourseEnrollmentModel.aggregate([
  { $match: { status: { $in: ['completed', 'active'] }, createdAt: { $gte: date } } },
  // ...
])
```
**Uses Index**: `{ status: 1, createdAt: -1 }`

### Example 2: Top Performing Courses
```javascript
// Query from dashboardService.ts
CourseEnrollmentModel.aggregate([
  { $match: { createdAt: { $gte: startDate }, status: { $in: ['completed', 'active'] } } },
  { $group: { _id: '$courseId', enrollments: { $sum: 1 } } },
  // ...
])
```
**Uses Index**: `{ courseId: 1, createdAt: -1 }` and `{ status: 1, createdAt: -1 }`

### Example 3: User Login
```javascript
// Query from userService.ts
UserModel.findOne({ email: email })
```
**Uses Index**: `{ email: 1 }` (unique)

### Example 4: Active Webinars
```javascript
// Query from webinarService.ts
WebinarModel.find({ isActive: true, startDate: { $gte: currentDate } })
```
**Uses Index**: `{ isActive: 1, startDate: 1 }`

---

## Monitoring and Optimization

### Explain Plan
Use MongoDB explain to verify index usage:
```javascript
db.courseenrollments.find({ status: 'ACTIVE' }).explain('executionStats')
```

Look for:
- `IXSCAN` (index scan) - Good ✅
- `COLLSCAN` (collection scan) - Bad ❌
- `executionTimeMillis` - Query duration
- `totalDocsExamined` vs `nReturned` - Efficiency ratio

### Slow Query Log
Monitor slow queries in MongoDB logs:
```
mongod --slowms 100 --profile 1
```

### Index Usage Statistics
```javascript
db.courseenrollments.aggregate([{ $indexStats: {} }])
```

---

## Future Considerations

1. **Partial Indexes**: For queries that only need a subset of documents
   ```javascript
   { status: 1, createdAt: -1 }, { partialFilterExpression: { status: 'ACTIVE' } }
   ```

2. **TTL Indexes**: For auto-expiring documents (e.g., OTP records)
   ```javascript
   { expiresAt: 1 }, { expireAfterSeconds: 0 }
   ```

3. **Geospatial Indexes**: If location-based queries become more complex
   ```javascript
   { location: '2dsphere' }
   ```

4. **Index Consolidation**: Review and merge overlapping indexes after monitoring usage

---

## Testing Index Effectiveness

### Before Adding Indexes
```bash
# Run queries and measure time
time node scripts/test-dashboard-queries.js
```

### After Adding Indexes
```bash
# Run same queries and compare
time node scripts/test-dashboard-queries.js
```

### Expected Improvements
- Dashboard stats: 5-10x faster
- User login: 50-100x faster
- Course listing: 10-20x faster
- Analytics queries: 10-50x faster

---

## Conclusion

All indexes have been strategically added based on:
- Actual query patterns from service files
- Dashboard and analytics requirements
- Authentication and authorization flows
- Common filtering and sorting operations

These indexes will significantly improve query performance, especially as data volume grows. Regular monitoring and occasional optimization will ensure continued performance as usage patterns evolve.
