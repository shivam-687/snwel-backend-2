# Course Enrollment + OTP Flow (Frontend Reference)

## Overview
Course enrollment uses two pieces of state:
1. **CourseEnrollment document** created/updated by `/api/course-enrollment`.
2. **OTP session** embedded in that document (same schema/behaviour as before).

OTP generation, resend, verification APIs are **unchanged**. The only change is that each enrollment stores an `applicant` sub-document so that duplicates are validated using **email + phone** (or email when phone is absent).

## API Sequence
1. **Start enrollment** (`POST /api/course-enrollment`)
   - Request body (key fields):
     ```json
     {
       "userId": "<logged-in user id>",
       "courseId": "<course id>",
       "qualification": "...",
       "mode": "...",
       "occupation": "...",
       "extra": { "agree": true },
       "widget": "optional"
     }
     ```
   - Backend copies `name`, `email`, `phone`, `location` from the `User` document into `applicant`.
   - Validation outcomes:
     1. Missing user or user email → `400` with `User not found` / `User contact information is incomplete`.
     2. If an enrollment already exists for the same `courseId` + `applicant.email` + `applicant.phone` (or same email while both phones are blank) **and OTP is verified**, backend returns `{ isVerified: true, enrollmentId }` immediately.
     3. If an enrollment exists but OTP is unverified or phone changed, backend refreshes the OTP session, updates the `applicant`, and returns `{ isVerified: false, token }` for the same enrollment (no duplicate record created).
     4. Otherwise, a fresh enrollment is created with the applicant info and a new OTP session; response matches the existing contract (`token`, `isVerified: false`).

2. **Verify OTP** (`POST /api/course-enrollment/verify-otp`)
   - Body: `{ "token": "<JWT>", "otp": "123456" }`.
   - Responses are unchanged (`isVerified`, `invalidOtp`, `otpExpired`, etc.).
   - On success the enrollment keeps `applicant` and flips `otp.verified = true`.

3. **Resend OTP** (`POST /api/course-enrollment/resend-otp`)
   - Body: `{ "token": "<JWT>" }` or `{ "verificationId": "<enrollmentId>" }`.
   - Cooldowns, session expiry, and error codes are unchanged.

## Error / Status Responses
| Scenario | Status | Payload hints |
| --- | --- | --- |
| User missing / deleted | 400 | `"User not found for enrollment"` |
| User missing email | 400 | `"User contact information is incomplete"` |
| Re-applying with same email + phone, OTP verified | 200 | `{ isVerified: true, enrollmentId }` (frontend should show success) |
| Re-applying with same email + phone, OTP pending/expired | 200 | `{ isVerified: false, token }` for the same enrollment; frontend must show OTP screen again |
| Wrong OTP | 200 | `{ invalidOtp: true, otpExpired: false }` |
| OTP expired | 200 | `{ invalidOtp: true, otpExpired: true, verificationId, resend_allowed, retry_after }` |
| Invalid JWT | 200 | `{ invalidToken: true }` |

## Frontend Expectations
1. **Always continue with the latest JWT** returned from `/api/course-enrollment` or `/resend-otp`.
2. **Skip OTP UI when `isVerified: true`** comes back from the create endpoint (user already applied successfully).
3. **Display duplicate attempts clearly**: when backend reuses an existing verified enrollment, inform the user they have already applied with the same email/phone.
4. **Handle resend cooldown** using `retry_after` exactly as before.
5. **Use `verificationId`** returned in expired-OTP responses to trigger `/resend-otp` without a JWT if needed.

## Notes
- OTP helper/controller code did not change.
- The new `applicant` sub-document enables future dashboards to display the contact info that was actually used during enrollment.
