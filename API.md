# HireTrack — REST API Design

> **Document Version:** 1.0  
> **Last Updated:** 2026-07-10  
> **Status:** Draft — Pending Approval  
> **Base URL:** `/api/v1`

---

## 1. Response Format

### Success Response
```json
{
  "success": true,
  "message": "Job created successfully",
  "data": { ... },
  "meta": {
    "timestamp": "2026-07-10T09:00:00.000Z",
    "requestId": "req_abc123"
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 156,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  },
  "meta": { "timestamp": "...", "requestId": "..." }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  },
  "meta": { "timestamp": "...", "requestId": "..." }
}
```

### Common Query Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 20 | Items per page (max: 100) |
| `sort` | string | `-createdAt` | Sort field (prefix `-` for desc) |
| `search` | string | — | Full-text search query |
| `fields` | string | — | Comma-separated field projection |

---

## 2. Authentication Endpoints

### `POST /auth/register`
| Attribute | Value |
|-----------|-------|
| **Auth** | None |
| **Rate Limit** | 3/hour per IP |
| **Body** | `{ firstName, lastName, email, password, companyName }` |
| **Success** | `201` — User created, verification email sent |
| **Errors** | `400` Validation, `409` Email exists |

### `POST /auth/login`
| Attribute | Value |
|-----------|-------|
| **Auth** | None |
| **Rate Limit** | 5/15min per IP |
| **Body** | `{ email, password }` |
| **Success** | `200` — `{ user, accessToken }` + httpOnly refresh cookie |
| **Errors** | `401` Invalid credentials, `403` Not verified/deactivated, `429` Rate limited |

### `POST /auth/refresh`
| Attribute | Value |
|-----------|-------|
| **Auth** | Refresh token cookie |
| **Rate Limit** | 10/min |
| **Success** | `200` — `{ accessToken }` + rotated refresh cookie |
| **Errors** | `401` Invalid/expired token |

### `POST /auth/logout`
| Attribute | Value |
|-----------|-------|
| **Auth** | Refresh token cookie |
| **Success** | `200` — Cookie cleared, token revoked |

### `GET /auth/verify-email?token=xxx`
| Attribute | Value |
|-----------|-------|
| **Auth** | None |
| **Success** | `200` — Email verified |
| **Errors** | `400` Invalid/expired token |

### `POST /auth/forgot-password`
| Attribute | Value |
|-----------|-------|
| **Auth** | None |
| **Rate Limit** | 3/hour per IP |
| **Body** | `{ email }` |
| **Success** | `200` — Always (prevents email enumeration) |

### `POST /auth/reset-password`
| Attribute | Value |
|-----------|-------|
| **Auth** | None |
| **Body** | `{ token, password }` |
| **Success** | `200` — Password reset, all sessions revoked |
| **Errors** | `400` Invalid/expired token |

---

## 3. Users Endpoints

### `GET /users`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | All (company-scoped) |
| **Query** | `?role=recruiter&isActive=true&search=john&page=1&limit=20` |
| **Success** | `200` — Paginated user list |

### `GET /users/:userId`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | All (same company) |
| **Success** | `200` — User details |
| **Errors** | `404` Not found |

### `PATCH /users/:userId`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Self (own profile), Super Admin, Admin |
| **Body** | `{ firstName, lastName, phone, title, department, avatar }` |
| **Success** | `200` — Updated user |
| **Errors** | `403` Forbidden, `404` Not found |

### `PATCH /users/:userId/role`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin |
| **Body** | `{ role }` |
| **Success** | `200` — Role updated |
| **Errors** | `403` Cannot change own role, `400` Invalid role |

### `PATCH /users/:userId/deactivate`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin |
| **Success** | `200` — User deactivated |
| **Errors** | `403` Cannot deactivate self |

### `PATCH /users/:userId/activate`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin |
| **Success** | `200` — User reactivated |

### `POST /users/invite`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin |
| **Body** | `{ email, role, firstName, lastName }` |
| **Success** | `201` — Invitation sent |
| **Errors** | `409` User already exists |

### `PATCH /users/change-password`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Self only |
| **Body** | `{ currentPassword, newPassword }` |
| **Success** | `200` — Password changed |
| **Errors** | `401` Wrong current password |

---

## 4. Companies Endpoints

### `GET /companies/current`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | All |
| **Success** | `200` — Current user's company |

### `PATCH /companies/current`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin |
| **Body** | `{ name, logo, website, industry, size, description, address, settings }` |
| **Success** | `200` — Updated company |

---

## 5. Jobs Endpoints

### `GET /jobs`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | All (scoped by role — admins see all, hiring managers see assigned) |
| **Query** | `?status=open&department=engineering&location.type=remote&search=react&sort=-createdAt&page=1&limit=20` |
| **Filters** | `status`, `department`, `employmentType`, `experienceLevel`, `location.type`, `hiringManager`, `recruiter` |
| **Success** | `200` — Paginated job list |

### `GET /jobs/:jobId`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | All (with resource-level check) |
| **Populate** | `hiringManager`, `recruiters`, `createdBy` (name, avatar) |
| **Success** | `200` — Full job details |
| **Errors** | `404` Not found, `403` Not assigned |

### `POST /jobs`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin, Recruiter |
| **Body** | `{ title, department, location, employmentType, experienceLevel, salary, description, requirements, responsibilities, skills, benefits, pipelineStages, hiringManager, recruiters, openings, deadline }` |
| **Success** | `201` — Created job |
| **Errors** | `400` Validation |

### `PATCH /jobs/:jobId`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin, Recruiter (if assigned) |
| **Body** | Any updatable job fields |
| **Success** | `200` — Updated job |
| **Errors** | `403` Not assigned, `404` Not found |

### `PATCH /jobs/:jobId/status`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin, Recruiter (if assigned) |
| **Body** | `{ status }` (draft → open → paused → closed → archived) |
| **Success** | `200` — Status updated |

### `POST /jobs/:jobId/duplicate`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin, Recruiter |
| **Success** | `201` — Duplicated job (as draft) |

### `DELETE /jobs/:jobId`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin |
| **Success** | `200` — Job archived (soft delete) |

### `GET /jobs/:jobId/pipeline`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | All (with resource-level check) |
| **Success** | `200` — Applications grouped by stage (for Kanban board) |

---

## 6. Candidates Endpoints

### `GET /candidates`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin, Recruiter |
| **Query** | `?source=linkedin&search=john&skills=react,node&sort=-createdAt&page=1&limit=20` |
| **Filters** | `source`, `skills`, `tags`, `experience`, `createdAt` range |
| **Success** | `200` — Paginated candidates |

### `GET /candidates/:candidateId`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | All (with resource-level check) |
| **Populate** | Applications (with job title, current stage), Files, Timeline |
| **Success** | `200` — Full candidate profile |

### `POST /candidates`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin, Recruiter |
| **Body** | `{ firstName, lastName, email, phone, source, sourceDetails, headline, location, resume, socialLinks, skills, experience, currentCompany, currentTitle, tags, notes }` |
| **Success** | `201` — Created candidate |
| **Errors** | `409` Duplicate (same email in company) |

### `PATCH /candidates/:candidateId`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin, Recruiter |
| **Success** | `200` — Updated candidate |

### `DELETE /candidates/:candidateId`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin |
| **Success** | `200` — Candidate and applications deleted |

---

## 7. Applications Endpoints

### `GET /applications`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | All (scoped) |
| **Query** | `?job=xxx&status=active&currentStage=Interview&sort=-appliedAt&page=1&limit=20` |
| **Success** | `200` — Paginated applications |

### `GET /applications/:applicationId`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Populate** | Job, Candidate, Scorecards, Stage History |
| **Success** | `200` — Full application details |

### `POST /applications`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin, Recruiter |
| **Body** | `{ job, candidate }` |
| **Success** | `201` — Application created at first pipeline stage |
| **Errors** | `409` Already applied, `400` Job not open |

### `PATCH /applications/:applicationId/stage`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin, Recruiter |
| **Body** | `{ stage, notes }` |
| **Success** | `200` — Stage changed, history updated |

### `PATCH /applications/:applicationId/reject`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin, Recruiter |
| **Body** | `{ rejectionReason, rejectionNotes }` |
| **Success** | `200` — Application rejected |

### `POST /applications/:applicationId/scorecard`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | All (assigned interviewers) |
| **Body** | `{ overallRating, criteria: [{ name, rating, comment }], recommendation, notes }` |
| **Success** | `201` — Scorecard submitted |

### `POST /applications/bulk-action`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin, Recruiter |
| **Body** | `{ applicationIds: [], action: 'move_stage' | 'reject', stage?, rejectionReason? }` |
| **Success** | `200` — Bulk action completed |

---

## 8. Interviews Endpoints

### `GET /interviews`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | All (interviewers see own only) |
| **Query** | `?status=scheduled&from=2026-07-01&to=2026-07-31&interviewer=xxx&type=technical&page=1&limit=20` |
| **Success** | `200` — Paginated interviews |

### `GET /interviews/calendar`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Query** | `?from=2026-07-01&to=2026-07-31&interviewer=xxx` |
| **Success** | `200` — Interviews formatted for calendar rendering |

### `GET /interviews/:interviewId`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Populate** | Application, Candidate, Job, Interviewers, Feedback |
| **Success** | `200` — Full interview details |

### `POST /interviews`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin, Recruiter |
| **Body** | `{ application, interviewers, type, round, title, scheduledAt, duration, timezone, location, meetingLink, notes }` |
| **Success** | `201` — Interview scheduled, notifications sent to interviewers |

### `PATCH /interviews/:interviewId`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin, Recruiter |
| **Success** | `200` — Interview updated |

### `PATCH /interviews/:interviewId/cancel`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin, Recruiter |
| **Body** | `{ cancelReason }` |
| **Success** | `200` — Interview cancelled, notifications sent |

### `POST /interviews/:interviewId/feedback`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Assigned interviewers only |
| **Body** | `{ rating, strengths, weaknesses, recommendation, notes }` |
| **Success** | `201` — Feedback submitted |

---

## 9. Analytics Endpoints

### `GET /analytics/dashboard`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | All (data scoped by role) |
| **Success** | `200` — `{ openJobs, activeCandidates, interviewsToday, offersPending, recentApplications, upcomingInterviews }` |

### `GET /analytics/pipeline`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Query** | `?jobId=xxx&from=2026-01-01&to=2026-07-01` |
| **Success** | `200` — Funnel data (candidates per stage + conversion rates) |

### `GET /analytics/time-to-fill`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Query** | `?department=engineering&from=2026-01-01&to=2026-07-01` |
| **Success** | `200` — Average days per stage, total time-to-fill per job |

### `GET /analytics/sources`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Query** | `?from=2026-01-01&to=2026-07-01` |
| **Success** | `200` — Applications and hires per source |

### `GET /analytics/recruiters`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin |
| **Success** | `200` — Per-recruiter metrics (candidates processed, hires, avg time) |

---

## 10. Notifications Endpoints

### `GET /notifications`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Query** | `?isRead=false&page=1&limit=20` |
| **Success** | `200` — Paginated notifications |

### `GET /notifications/unread-count`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Success** | `200` — `{ count: 5 }` |

### `PATCH /notifications/:notificationId/read`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Success** | `200` — Marked as read |

### `PATCH /notifications/read-all`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Success** | `200` — All notifications marked as read |

---

## 11. Files Endpoints

### `POST /files/upload`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin, Recruiter |
| **Body** | `multipart/form-data` — `file`, `candidateId?`, `jobId?`, `fileType` |
| **Limits** | Max 10MB, allowed: PDF, DOC, DOCX, PNG, JPG |
| **Success** | `201` — `{ url, fileName, fileType, fileSize }` |
| **Errors** | `400` Invalid file type, `413` File too large |

### `DELETE /files/:fileId`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin, Recruiter (uploader) |
| **Success** | `200` — File deleted from Cloudinary + DB |

---

## 12. Audit Logs Endpoints

### `GET /audit`
| Attribute | Value |
|-----------|-------|
| **Auth** | JWT |
| **Roles** | Super Admin, Admin |
| **Query** | `?actor=xxx&action=created&resourceType=job&from=2026-07-01&to=2026-07-10&page=1&limit=50` |
| **Filters** | `actor`, `action`, `resourceType`, `resourceId`, date range |
| **Success** | `200` — Paginated activity logs |

---

## 13. Status Codes Summary

| Code | Meaning | Usage |
|------|---------|-------|
| `200` | OK | Successful GET, PATCH, DELETE |
| `201` | Created | Successful POST |
| `204` | No Content | Successful DELETE (no body) |
| `400` | Bad Request | Validation errors |
| `401` | Unauthorized | Missing/invalid token |
| `403` | Forbidden | Insufficient role/permissions |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate resource |
| `413` | Payload Too Large | File exceeds limit |
| `429` | Too Many Requests | Rate limit exceeded |
| `500` | Internal Server Error | Unexpected server error |

---

*End of Step 5 — REST API Design*

*Next: Step 6 — Design System*
