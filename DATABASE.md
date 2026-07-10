# HireTrack — Database Schema Design

> **Document Version:** 1.0  
> **Last Updated:** 2026-07-10  
> **Status:** Draft — Pending Approval  

---

## 1. ER Diagram

```
┌──────────┐    1:N    ┌──────────┐    1:N    ┌──────────────┐
│  Company │──────────>│   User   │──────────>│ RefreshToken │
└────┬─────┘           └────┬─────┘           └──────────────┘
     │ 1:N                  │
     │                      │ N:M (via Application)
     ▼                      │
┌──────────┐    1:N    ┌────▼─────┐    1:N    ┌──────────────┐
│   Job    │──────────>│Application│─────────>│  Interview   │
└────┬─────┘           └────┬─────┘           └──────┬───────┘
     │                      │                        │
     │                      │ N:1                    │ N:M
     │                 ┌────▼─────┐                  │
     │                 │ Candidate│<─────────────────┘
     │                 └──────────┘
     │
     │ 1:N          ┌──────────────┐
     └─────────────>│ ActivityLog  │
                    └──────────────┘

┌──────────────┐    ┌──────────┐    ┌──────────┐
│ Notification │    │   File   │    │  Session │
└──────────────┘    └──────────┘    └──────────┘
```

### Relationship Summary

| Relationship | Type | Description |
|-------------|------|-------------|
| Company → Users | 1:N | A company has many team members |
| Company → Jobs | 1:N | A company has many job openings |
| Job → Applications | 1:N | A job receives many applications |
| Candidate → Applications | 1:N | A candidate can apply to many jobs |
| Application → Interviews | 1:N | An application can have multiple interview rounds |
| User → Interviews | N:M | An interviewer participates in many interviews |
| User → RefreshTokens | 1:N | A user can have multiple active sessions |
| User → Notifications | 1:N | A user receives many notifications |
| Job → ActivityLogs | 1:N | All actions on a job are logged |
| Candidate → Files | 1:N | A candidate can have multiple files (resume, etc.) |

---

## 2. Collections & Schemas

### 2.1 Users Collection

```typescript
// users
{
  _id: ObjectId,
  firstName: String,              // required, trim, 2-50 chars
  lastName: String,               // required, trim, 2-50 chars
  email: String,                  // required, unique, lowercase, valid email
  password: String,               // required, min 8 chars, hashed (bcrypt)
  avatar: String,                 // Cloudinary URL, nullable
  role: String,                   // enum: see below
  company: ObjectId,              // ref: Company, required
  phone: String,                  // optional, E.164 format
  title: String,                  // optional, job title (e.g. "Senior Recruiter")
  department: String,             // optional
  isActive: Boolean,              // default: true
  isEmailVerified: Boolean,       // default: false
  emailVerificationToken: String, // hashed token
  emailVerificationExpires: Date,
  passwordResetToken: String,     // hashed token
  passwordResetExpires: Date,
  lastLoginAt: Date,
  createdAt: Date,                // auto (timestamps)
  updatedAt: Date                 // auto (timestamps)
}
```

**Enums:**
```
role: 'super_admin' | 'admin' | 'recruiter' | 'hiring_manager' | 'interviewer' | 'viewer'
```

**Indexes:**
| Index | Type | Purpose |
|-------|------|---------|
| `{ email: 1 }` | Unique | Login lookup, duplicate prevention |
| `{ company: 1, role: 1 }` | Compound | Team queries filtered by role |
| `{ company: 1, isActive: 1 }` | Compound | Active team member listing |
| `{ emailVerificationToken: 1 }` | Sparse | Email verification lookup |
| `{ passwordResetToken: 1 }` | Sparse | Password reset lookup |

**Validation Rules:**
- `email`: Must match email regex, unique per collection
- `password`: Min 8 chars, must contain uppercase, lowercase, number, special char (validated at API layer, stored as bcrypt hash)
- `firstName`, `lastName`: 2-50 characters, alphabetic + spaces only
- `phone`: Optional, E.164 format when provided
- `role`: Must be one of the enum values

---

### 2.2 Companies Collection

```typescript
// companies
{
  _id: ObjectId,
  name: String,                   // required, trim, 2-100 chars
  slug: String,                   // required, unique, URL-safe
  logo: String,                   // Cloudinary URL, nullable
  website: String,                // optional, valid URL
  industry: String,               // enum: see below
  size: String,                   // enum: see below
  description: String,            // optional, max 1000 chars
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String
  },
  settings: {
    defaultPipelineStages: [String],  // default: see below
    timezone: String,                  // default: 'UTC'
    dateFormat: String,                // default: 'MM/DD/YYYY'
    brandColor: String                 // hex color, default: '#6366F1'
  },
  subscription: {
    plan: String,                 // enum: 'free' | 'starter' | 'pro' | 'enterprise'
    status: String,               // enum: 'active' | 'trial' | 'expired' | 'cancelled'
    trialEndsAt: Date,
    currentPeriodEnd: Date
  },
  owner: ObjectId,                // ref: User (who created the company)
  createdAt: Date,
  updatedAt: Date
}
```

**Enums:**
```
industry: 'technology' | 'finance' | 'healthcare' | 'education' | 'retail' |
          'manufacturing' | 'consulting' | 'media' | 'nonprofit' | 'government' | 'other'

size: '1-10' | '11-50' | '51-200' | '201-500' | '501-1000' | '1001-5000' | '5000+'
```

**Default Pipeline Stages:**
```
['Applied', 'Screening', 'Phone Screen', 'Interview', 'Final Round', 'Offer', 'Hired']
```

**Indexes:**
| Index | Type | Purpose |
|-------|------|---------|
| `{ slug: 1 }` | Unique | URL-based company lookup |
| `{ owner: 1 }` | Standard | Find companies by owner |

---

### 2.3 Jobs Collection

```typescript
// jobs
{
  _id: ObjectId,
  title: String,                  // required, trim, 3-100 chars
  slug: String,                   // auto-generated from title, unique within company
  company: ObjectId,              // ref: Company, required
  department: String,             // required, enum: see below
  location: {
    type: String,                 // enum: 'onsite' | 'remote' | 'hybrid'
    city: String,                 // required if onsite/hybrid
    state: String,
    country: String
  },
  employmentType: String,         // enum: see below
  experienceLevel: String,        // enum: see below
  salary: {
    min: Number,                  // optional
    max: Number,                  // optional
    currency: String,             // default: 'USD'
    period: String                // enum: 'yearly' | 'monthly' | 'hourly'
  },
  description: String,            // required, rich text (HTML), max 10000 chars
  requirements: [String],         // array of requirement strings
  responsibilities: [String],     // array of responsibility strings
  skills: [String],               // array of skill tags
  benefits: [String],             // array of benefit strings
  status: String,                 // enum: see below
  pipelineStages: [{
    name: String,                 // stage name
    order: Number,                // display order
    color: String                 // hex color for UI
  }],
  hiringManager: ObjectId,        // ref: User, nullable
  recruiters: [ObjectId],         // ref: User[]
  openings: Number,               // default: 1, min: 1
  applicationCount: Number,       // denormalized counter, default: 0
  deadline: Date,                 // optional application deadline
  publishedAt: Date,              // when job was made Open
  closedAt: Date,                 // when job was closed
  createdBy: ObjectId,            // ref: User
  createdAt: Date,
  updatedAt: Date
}
```

**Enums:**
```
department: 'engineering' | 'product' | 'design' | 'marketing' | 'sales' |
            'operations' | 'finance' | 'hr' | 'legal' | 'customer_success' | 'other'

employmentType: 'full_time' | 'part_time' | 'contract' | 'internship' | 'freelance'

experienceLevel: 'intern' | 'entry' | 'mid' | 'senior' | 'lead' | 'director' | 'executive'

status: 'draft' | 'open' | 'paused' | 'closed' | 'archived'
```

**Indexes:**
| Index | Type | Purpose |
|-------|------|---------|
| `{ company: 1, status: 1 }` | Compound | List jobs by company filtered by status |
| `{ company: 1, slug: 1 }` | Compound Unique | Unique slug per company |
| `{ company: 1, department: 1 }` | Compound | Filter jobs by department |
| `{ company: 1, createdAt: -1 }` | Compound | Sort by newest |
| `{ hiringManager: 1 }` | Standard | Find jobs assigned to a manager |
| `{ recruiters: 1 }` | Standard | Find jobs assigned to a recruiter |
| `{ status: 1, deadline: 1 }` | Compound | Find expiring open jobs |
| `{ title: 'text', description: 'text' }` | Text | Full-text search |

---

### 2.4 Candidates Collection

```typescript
// candidates
{
  _id: ObjectId,
  firstName: String,              // required, trim
  lastName: String,               // required, trim
  email: String,                  // required, lowercase
  phone: String,                  // optional
  company: ObjectId,              // ref: Company (which company's talent pool)
  avatar: String,                 // Cloudinary URL, nullable
  headline: String,               // optional, e.g. "Senior Engineer at Google"
  location: {
    city: String,
    state: String,
    country: String
  },
  source: String,                 // enum: see below
  sourceDetails: String,          // additional context (e.g. referrer name)
  resume: {
    url: String,                  // Cloudinary URL
    fileName: String,
    uploadedAt: Date
  },
  socialLinks: {
    linkedin: String,
    github: String,
    portfolio: String,
    twitter: String
  },
  skills: [String],               // skill tags
  experience: Number,             // years of experience
  currentCompany: String,
  currentTitle: String,
  tags: [String],                 // custom labels
  notes: String,                  // internal notes
  rating: Number,                 // 1-5 average rating, nullable
  totalApplications: Number,      // denormalized counter
  addedBy: ObjectId,              // ref: User
  createdAt: Date,
  updatedAt: Date
}
```

**Enums:**
```
source: 'linkedin' | 'indeed' | 'glassdoor' | 'referral' | 'career_page' |
        'job_board' | 'university' | 'agency' | 'direct' | 'other'
```

**Indexes:**
| Index | Type | Purpose |
|-------|------|---------|
| `{ company: 1, email: 1 }` | Compound Unique | Prevent duplicate candidates per company |
| `{ company: 1, createdAt: -1 }` | Compound | List candidates by newest |
| `{ company: 1, source: 1 }` | Compound | Filter by source |
| `{ company: 1, tags: 1 }` | Compound | Filter by tags |
| `{ firstName: 'text', lastName: 'text', email: 'text', skills: 'text' }` | Text | Full-text search |

---

### 2.5 Applications Collection

```typescript
// applications
{
  _id: ObjectId,
  job: ObjectId,                  // ref: Job, required
  candidate: ObjectId,            // ref: Candidate, required
  company: ObjectId,              // ref: Company, required (denormalized)
  currentStage: String,           // current pipeline stage name
  stageHistory: [{
    stage: String,
    movedAt: Date,
    movedBy: ObjectId,            // ref: User
    notes: String                 // optional reason
  }],
  status: String,                 // enum: see below
  rating: Number,                 // 1-5, nullable (aggregate of scorecard ratings)
  scorecards: [{
    interviewer: ObjectId,        // ref: User
    overallRating: Number,        // 1-5
    criteria: [{
      name: String,               // e.g. "Technical Skills"
      rating: Number,             // 1-5
      comment: String
    }],
    recommendation: String,       // enum: 'strong_yes' | 'yes' | 'neutral' | 'no' | 'strong_no'
    notes: String,
    submittedAt: Date
  }],
  rejectionReason: String,        // enum: see below, nullable
  rejectionNotes: String,
  appliedAt: Date,                // default: now
  movedToCurrentStageAt: Date,
  offeredAt: Date,
  hiredAt: Date,
  rejectedAt: Date,
  withdrawnAt: Date,
  createdBy: ObjectId,            // ref: User
  createdAt: Date,
  updatedAt: Date
}
```

**Enums:**
```
status: 'active' | 'offered' | 'hired' | 'rejected' | 'withdrawn'

rejectionReason: 'not_qualified' | 'overqualified' | 'culture_fit' |
                 'salary_mismatch' | 'position_filled' | 'no_show' |
                 'candidate_withdrew' | 'other'
```

**Indexes:**
| Index | Type | Purpose |
|-------|------|---------|
| `{ job: 1, candidate: 1 }` | Compound Unique | One application per candidate per job |
| `{ job: 1, currentStage: 1 }` | Compound | Pipeline board (candidates per stage) |
| `{ job: 1, status: 1 }` | Compound | Filter by status within a job |
| `{ candidate: 1 }` | Standard | All applications for a candidate |
| `{ company: 1, status: 1, createdAt: -1 }` | Compound | Company-wide active applications |
| `{ company: 1, appliedAt: -1 }` | Compound | Recent applications |

---

### 2.6 Interviews Collection

```typescript
// interviews
{
  _id: ObjectId,
  application: ObjectId,          // ref: Application, required
  job: ObjectId,                  // ref: Job, required (denormalized)
  candidate: ObjectId,            // ref: Candidate, required (denormalized)
  company: ObjectId,              // ref: Company, required (denormalized)
  interviewers: [ObjectId],       // ref: User[], required (min 1)
  type: String,                   // enum: see below
  round: Number,                  // round number (1, 2, 3...)
  title: String,                  // e.g. "Technical Interview - Round 2"
  scheduledAt: Date,              // required
  duration: Number,               // minutes, default: 60
  timezone: String,               // IANA timezone
  location: String,               // room name, meeting link, or address
  meetingLink: String,            // video call URL
  status: String,                 // enum: see below
  notes: String,                  // interview prep notes
  feedback: [{
    interviewer: ObjectId,        // ref: User
    rating: Number,               // 1-5
    strengths: String,
    weaknesses: String,
    recommendation: String,       // enum: 'strong_yes' | 'yes' | 'neutral' | 'no' | 'strong_no'
    notes: String,
    submittedAt: Date
  }],
  cancelReason: String,           // nullable
  rescheduledFrom: ObjectId,      // ref: Interview (previous interview if rescheduled)
  scheduledBy: ObjectId,          // ref: User
  createdAt: Date,
  updatedAt: Date
}
```

**Enums:**
```
type: 'phone_screen' | 'video_call' | 'onsite' | 'technical' | 'behavioral' |
      'panel' | 'take_home' | 'culture_fit' | 'final'

status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled' | 'no_show' | 'rescheduled'
```

**Indexes:**
| Index | Type | Purpose |
|-------|------|---------|
| `{ company: 1, scheduledAt: 1 }` | Compound | Calendar queries |
| `{ application: 1 }` | Standard | All interviews for an application |
| `{ interviewers: 1, scheduledAt: 1 }` | Compound | Interviewer's schedule |
| `{ company: 1, status: 1 }` | Compound | Filter by status |
| `{ candidate: 1 }` | Standard | All interviews for a candidate |
| `{ scheduledAt: 1, status: 1 }` | Compound | Upcoming interviews |

---

### 2.7 Notifications Collection

```typescript
// notifications
{
  _id: ObjectId,
  recipient: ObjectId,            // ref: User, required
  company: ObjectId,              // ref: Company, required
  type: String,                   // enum: see below
  title: String,                  // required, display title
  message: String,                // required, display message
  data: {                         // contextual references
    jobId: ObjectId,
    candidateId: ObjectId,
    applicationId: ObjectId,
    interviewId: ObjectId,
    userId: ObjectId
  },
  link: String,                   // frontend route to navigate to
  isRead: Boolean,                // default: false
  readAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Enums:**
```
type: 'new_application' | 'stage_change' | 'interview_scheduled' |
      'interview_reminder' | 'feedback_submitted' | 'candidate_rejected' |
      'candidate_hired' | 'mention' | 'team_invite' | 'job_assigned' | 'system'
```

**Indexes:**
| Index | Type | Purpose |
|-------|------|---------|
| `{ recipient: 1, isRead: 1, createdAt: -1 }` | Compound | Unread notifications (sorted) |
| `{ recipient: 1, createdAt: -1 }` | Compound | All notifications for a user |
| `{ createdAt: 1 }` | TTL (90 days) | Auto-delete old notifications |

---

### 2.8 Activity Logs Collection

```typescript
// activitylogs
{
  _id: ObjectId,
  company: ObjectId,              // ref: Company, required
  actor: ObjectId,                // ref: User, required (who performed action)
  action: String,                 // enum: see below
  resourceType: String,           // enum: see below
  resourceId: ObjectId,           // the affected resource's ID
  resourceName: String,           // human-readable (e.g. job title, candidate name)
  metadata: Mixed,                // action-specific details (old value, new value, etc.)
  ipAddress: String,
  userAgent: String,
  createdAt: Date                 // auto (timestamps)
}
```

**Enums:**
```
action: 'created' | 'updated' | 'deleted' | 'archived' | 'restored' |
        'stage_changed' | 'status_changed' | 'assigned' | 'unassigned' |
        'feedback_submitted' | 'interview_scheduled' | 'interview_cancelled' |
        'email_sent' | 'file_uploaded' | 'login' | 'logout' | 'invited' |
        'role_changed' | 'password_changed'

resourceType: 'job' | 'candidate' | 'application' | 'interview' |
              'user' | 'company' | 'notification' | 'file'
```

**Indexes:**
| Index | Type | Purpose |
|-------|------|---------|
| `{ company: 1, createdAt: -1 }` | Compound | Audit log listing |
| `{ company: 1, resourceType: 1, resourceId: 1 }` | Compound | Activity for a specific resource |
| `{ actor: 1, createdAt: -1 }` | Compound | Activity by a user |
| `{ createdAt: 1 }` | TTL (365 days) | Auto-delete old logs |

---

### 2.9 Files Collection

```typescript
// files
{
  _id: ObjectId,
  company: ObjectId,              // ref: Company, required
  uploadedBy: ObjectId,           // ref: User, required
  candidate: ObjectId,            // ref: Candidate, nullable
  job: ObjectId,                  // ref: Job, nullable
  fileName: String,               // original file name
  fileType: String,               // enum: see below
  mimeType: String,               // e.g. 'application/pdf'
  fileSize: Number,               // bytes
  url: String,                    // Cloudinary URL
  publicId: String,               // Cloudinary public ID (for deletion)
  createdAt: Date,
  updatedAt: Date
}
```

**Enums:**
```
fileType: 'resume' | 'cover_letter' | 'portfolio' | 'offer_letter' |
          'assessment' | 'id_document' | 'other'
```

**Indexes:**
| Index | Type | Purpose |
|-------|------|---------|
| `{ candidate: 1, fileType: 1 }` | Compound | Get candidate's files by type |
| `{ company: 1, createdAt: -1 }` | Compound | List all company files |
| `{ publicId: 1 }` | Standard | Cloudinary deletion lookup |

---

### 2.10 Refresh Tokens Collection

```typescript
// refreshtokens
{
  _id: ObjectId,
  user: ObjectId,                 // ref: User, required
  token: String,                  // hashed refresh token
  userAgent: String,              // browser/device info
  ipAddress: String,
  expiresAt: Date,                // TTL index
  isRevoked: Boolean,             // default: false
  revokedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
| Index | Type | Purpose |
|-------|------|---------|
| `{ token: 1 }` | Unique | Token lookup during refresh |
| `{ user: 1 }` | Standard | Find all sessions for a user |
| `{ expiresAt: 1 }` | TTL (0s) | Auto-delete expired tokens |

---

## 3. Index Summary

| Collection | Total Indexes | Text Indexes | TTL Indexes | Unique Indexes |
|-----------|:---:|:---:|:---:|:---:|
| Users | 5 | 0 | 0 | 1 (email) |
| Companies | 2 | 0 | 0 | 1 (slug) |
| Jobs | 8 | 1 | 0 | 1 (company+slug) |
| Candidates | 5 | 1 | 0 | 1 (company+email) |
| Applications | 6 | 0 | 0 | 1 (job+candidate) |
| Interviews | 6 | 0 | 0 | 0 |
| Notifications | 3 | 0 | 1 (90 days) | 0 |
| ActivityLogs | 4 | 0 | 1 (365 days) | 0 |
| Files | 3 | 0 | 0 | 0 |
| RefreshTokens | 3 | 0 | 1 | 1 (token) |
| **Total** | **45** | **2** | **3** | **5** |

---

## 4. Data Constraints & Rules

### 4.1 Referential Integrity (Application-Level)

MongoDB does not enforce foreign keys. These are enforced in the service layer:

| Rule | Enforcement |
|------|-------------|
| Deleting a Job → soft-delete (set status: 'archived') | Service layer |
| Deleting a User → deactivate (set isActive: false) | Service layer |
| Deleting a Candidate → cascade delete applications | Service layer |
| Creating Application → verify Job exists and is 'open' | Service layer |
| Creating Interview → verify Application exists | Service layer |
| Assigning role → verify User belongs to same Company | Middleware |

### 4.2 Denormalization Strategy

| Field | Source | Denormalized In | Sync Strategy |
|-------|--------|----------------|---------------|
| `applicationCount` | Applications count | Jobs | Increment/decrement on create/delete |
| `totalApplications` | Applications count | Candidates | Increment/decrement on create/delete |
| `rating` | Scorecards average | Applications | Recompute on scorecard submit |
| `company` | Job.company | Applications, Interviews | Copy on create (immutable) |
| `candidate`, `job` | Application refs | Interviews | Copy on create (immutable) |

### 4.3 Soft Delete Pattern

Collections using soft delete (never physically removed):
- **Users** → `isActive: false`
- **Jobs** → `status: 'archived'`
- **Applications** → `status: 'withdrawn'`

Collections using hard delete:
- **RefreshTokens** (via TTL)
- **Notifications** (via TTL)
- **ActivityLogs** (via TTL)

---

*End of Step 3 — Database Schema Design*

*Next: Step 4 — Authentication & Authorization Flows*
