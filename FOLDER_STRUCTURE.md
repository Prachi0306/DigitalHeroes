# HireTrack — Folder Structure & Routing

> **Document Version:** 1.0  
> **Last Updated:** 2026-07-10  
> **Status:** Draft — Pending Approval  

---

## 1. Monorepo Structure (Root)

```
DigitalHeroes/
├── client/                    # Next.js 15 Frontend
├── server/                    # Express.js Backend
├── shared/                    # Shared types & constants (used by both)
├── .github/                   # GitHub Actions CI/CD
│   └── workflows/
│       ├── ci.yml             # Lint + Test on PR
│       ├── deploy-client.yml  # Vercel deploy
│       └── deploy-server.yml  # Render deploy
├── .gitignore
├── .env.example               # Template for env vars
├── README.md
├── SRS.md
├── ARCHITECTURE.md
├── FOLDER_STRUCTURE.md        # This file
├── LICENSE
└── package.json               # Root workspace config (scripts only)
```

---

## 2. Frontend Folder Structure (`client/`)

```
client/
├── public/
│   ├── favicon.ico
│   ├── logo.svg
│   ├── og-image.png
│   └── robots.txt
│
├── src/
│   ├── app/                           # Next.js App Router
│   │   ├── layout.tsx                 # Root layout (providers, fonts, metadata)
│   │   ├── loading.tsx                # Global loading skeleton
│   │   ├── error.tsx                  # Global error boundary
│   │   ├── not-found.tsx              # Custom 404 page
│   │   ├── globals.css                # Global styles + CSS variables
│   │   │
│   │   ├── (marketing)/               # Public pages (no auth required)
│   │   │   ├── layout.tsx             # Marketing layout (navbar + footer)
│   │   │   └── page.tsx               # Landing page (/)
│   │   │
│   │   ├── (auth)/                    # Authentication pages
│   │   │   ├── layout.tsx             # Auth layout (centered card)
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── register/
│   │   │   │   └── page.tsx
│   │   │   ├── forgot-password/
│   │   │   │   └── page.tsx
│   │   │   ├── reset-password/
│   │   │   │   └── page.tsx
│   │   │   └── verify-email/
│   │   │       └── page.tsx
│   │   │
│   │   └── (dashboard)/               # Protected app pages
│   │       ├── layout.tsx             # Dashboard layout (sidebar + topbar)
│   │       ├── dashboard/
│   │       │   └── page.tsx           # Overview dashboard
│   │       ├── jobs/
│   │       │   ├── page.tsx           # Jobs list
│   │       │   ├── new/
│   │       │   │   └── page.tsx       # Create job
│   │       │   └── [jobId]/
│   │       │       ├── page.tsx       # Job detail + pipeline
│   │       │       └── edit/
│   │       │           └── page.tsx   # Edit job
│   │       ├── candidates/
│   │       │   ├── page.tsx           # All candidates
│   │       │   └── [candidateId]/
│   │       │       └── page.tsx       # Candidate profile
│   │       ├── interviews/
│   │       │   ├── page.tsx           # Interviews list
│   │       │   └── calendar/
│   │       │       └── page.tsx       # Calendar view
│   │       ├── team/
│   │       │   └── page.tsx           # Team members
│   │       ├── analytics/
│   │       │   └── page.tsx           # Analytics dashboard
│   │       ├── notifications/
│   │       │   └── page.tsx           # Notification center
│   │       ├── audit-logs/
│   │       │   └── page.tsx           # Audit log viewer
│   │       ├── settings/
│   │       │   ├── page.tsx           # General settings
│   │       │   ├── company/
│   │       │   │   └── page.tsx       # Company settings
│   │       │   └── notifications/
│   │       │       └── page.tsx       # Notification preferences
│   │       └── profile/
│   │           └── page.tsx           # User profile
│   │
│   ├── components/                    # Shared components
│   │   ├── ui/                        # Shadcn UI primitives (auto-generated)
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── select.tsx
│   │   │   ├── table.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── card.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── tooltip.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── command.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   └── textarea.tsx
│   │   │
│   │   ├── layout/                    # Layout components
│   │   │   ├── sidebar.tsx            # Dashboard sidebar navigation
│   │   │   ├── topbar.tsx             # Dashboard top bar
│   │   │   ├── mobile-nav.tsx         # Mobile navigation drawer
│   │   │   ├── breadcrumbs.tsx        # Breadcrumb navigation
│   │   │   └── page-header.tsx        # Reusable page header (title + actions)
│   │   │
│   │   ├── shared/                    # Reusable composite components
│   │   │   ├── data-table.tsx         # Generic sortable/filterable table
│   │   │   ├── data-table-toolbar.tsx # Table toolbar (search, filters, bulk)
│   │   │   ├── data-table-pagination.tsx
│   │   │   ├── empty-state.tsx        # Generic empty state
│   │   │   ├── error-state.tsx        # Generic error state
│   │   │   ├── loading-skeleton.tsx   # Reusable skeleton patterns
│   │   │   ├── confirm-dialog.tsx     # Reusable confirmation modal
│   │   │   ├── file-upload.tsx        # Drag-and-drop file uploader
│   │   │   ├── search-input.tsx       # Debounced search input
│   │   │   ├── stat-card.tsx          # Dashboard stat card
│   │   │   ├── status-badge.tsx       # Colored status indicator
│   │   │   ├── user-avatar.tsx        # Avatar with fallback initials
│   │   │   ├── date-picker.tsx        # Date picker wrapper
│   │   │   └── rich-text-editor.tsx   # Rich text for job descriptions
│   │   │
│   │   └── features/                  # Feature-specific components
│   │       ├── jobs/
│   │       │   ├── job-card.tsx
│   │       │   ├── job-form.tsx
│   │       │   ├── job-filters.tsx
│   │       │   ├── pipeline-board.tsx  # Kanban board
│   │       │   ├── pipeline-column.tsx
│   │       │   └── stage-config.tsx
│   │       ├── candidates/
│   │       │   ├── candidate-card.tsx
│   │       │   ├── candidate-form.tsx
│   │       │   ├── candidate-filters.tsx
│   │       │   ├── candidate-timeline.tsx
│   │       │   ├── resume-viewer.tsx
│   │       │   └── scorecard.tsx
│   │       ├── interviews/
│   │       │   ├── interview-card.tsx
│   │       │   ├── interview-form.tsx
│   │       │   ├── interview-calendar.tsx
│   │       │   └── feedback-form.tsx
│   │       ├── analytics/
│   │       │   ├── pipeline-funnel.tsx
│   │       │   ├── time-to-fill-chart.tsx
│   │       │   ├── source-breakdown.tsx
│   │       │   └── recruiter-stats.tsx
│   │       ├── notifications/
│   │       │   ├── notification-list.tsx
│   │       │   ├── notification-item.tsx
│   │       │   └── notification-bell.tsx
│   │       └── auth/
│   │           ├── login-form.tsx
│   │           ├── register-form.tsx
│   │           ├── forgot-password-form.tsx
│   │           └── reset-password-form.tsx
│   │
│   ├── hooks/                         # Custom React hooks
│   │   ├── use-auth.ts                # Auth state + actions
│   │   ├── use-user.ts                # Current user data
│   │   ├── use-debounce.ts            # Debounce value
│   │   ├── use-media-query.ts         # Responsive breakpoints
│   │   ├── use-local-storage.ts       # Persistent local state
│   │   ├── use-clipboard.ts           # Copy to clipboard
│   │   └── use-keyboard-shortcut.ts   # Keyboard shortcut handler
│   │
│   ├── lib/                           # Utilities & configuration
│   │   ├── api-client.ts              # Axios instance with interceptors
│   │   ├── query-client.ts            # TanStack Query client config
│   │   ├── utils.ts                   # cn() and general utilities
│   │   ├── constants.ts               # App-wide constants
│   │   ├── validations.ts             # Shared Zod schemas
│   │   └── format.ts                  # Date, currency, number formatters
│   │
│   ├── services/                      # API service layer
│   │   ├── auth.service.ts            # Login, register, refresh, logout
│   │   ├── jobs.service.ts            # CRUD jobs
│   │   ├── candidates.service.ts      # CRUD candidates
│   │   ├── interviews.service.ts      # CRUD interviews
│   │   ├── users.service.ts           # Team management
│   │   ├── analytics.service.ts       # Dashboard + reports
│   │   ├── notifications.service.ts   # Notifications
│   │   ├── files.service.ts           # File upload
│   │   └── audit.service.ts           # Audit logs
│   │
│   ├── stores/                        # Client-side state (if needed)
│   │   ├── auth-store.ts              # Auth state (Zustand)
│   │   └── ui-store.ts               # UI state (sidebar, modals, theme)
│   │
│   ├── types/                         # TypeScript type definitions
│   │   ├── auth.types.ts
│   │   ├── job.types.ts
│   │   ├── candidate.types.ts
│   │   ├── interview.types.ts
│   │   ├── user.types.ts
│   │   ├── notification.types.ts
│   │   ├── analytics.types.ts
│   │   └── api.types.ts               # Generic API response types
│   │
│   └── providers/                     # React context providers
│       ├── query-provider.tsx         # TanStack Query provider
│       ├── theme-provider.tsx         # Dark/light mode provider
│       └── auth-provider.tsx          # Auth context provider
│
├── .env.local                         # Local environment variables
├── .env.example                       # Template
├── next.config.ts                     # Next.js configuration
├── tailwind.config.ts                 # Tailwind + Shadcn config
├── tsconfig.json                      # TypeScript config
├── postcss.config.mjs                 # PostCSS config
├── components.json                    # Shadcn UI config
├── eslint.config.mjs                  # ESLint config
├── prettier.config.mjs                # Prettier config
└── package.json
```

---

## 3. Backend Folder Structure (`server/`)

```
server/
├── src/
│   ├── index.ts                       # Entry point — start Express server
│   ├── app.ts                         # Express app setup (middleware stack)
│   │
│   ├── config/                        # Configuration
│   │   ├── index.ts                   # Centralized config (reads env vars)
│   │   ├── database.ts                # MongoDB connection
│   │   ├── redis.ts                   # Redis connection
│   │   ├── cloudinary.ts              # Cloudinary setup
│   │   ├── mail.ts                    # Nodemailer transporter
│   │   └── cors.ts                    # CORS options
│   │
│   ├── models/                        # Mongoose models
│   │   ├── user.model.ts
│   │   ├── company.model.ts
│   │   ├── job.model.ts
│   │   ├── candidate.model.ts
│   │   ├── application.model.ts
│   │   ├── interview.model.ts
│   │   ├── notification.model.ts
│   │   ├── activity-log.model.ts
│   │   ├── file.model.ts
│   │   └── refresh-token.model.ts
│   │
│   ├── routes/                        # Route definitions
│   │   ├── index.ts                   # Route aggregator (/api/v1)
│   │   ├── auth.routes.ts
│   │   ├── users.routes.ts
│   │   ├── companies.routes.ts
│   │   ├── jobs.routes.ts
│   │   ├── candidates.routes.ts
│   │   ├── applications.routes.ts
│   │   ├── interviews.routes.ts
│   │   ├── notifications.routes.ts
│   │   ├── analytics.routes.ts
│   │   ├── files.routes.ts
│   │   └── audit.routes.ts
│   │
│   ├── controllers/                   # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── users.controller.ts
│   │   ├── companies.controller.ts
│   │   ├── jobs.controller.ts
│   │   ├── candidates.controller.ts
│   │   ├── applications.controller.ts
│   │   ├── interviews.controller.ts
│   │   ├── notifications.controller.ts
│   │   ├── analytics.controller.ts
│   │   ├── files.controller.ts
│   │   └── audit.controller.ts
│   │
│   ├── services/                      # Business logic
│   │   ├── auth.service.ts
│   │   ├── user.service.ts
│   │   ├── company.service.ts
│   │   ├── job.service.ts
│   │   ├── candidate.service.ts
│   │   ├── application.service.ts
│   │   ├── interview.service.ts
│   │   ├── notification.service.ts
│   │   ├── analytics.service.ts
│   │   ├── file.service.ts
│   │   ├── mail.service.ts            # Email sending logic
│   │   ├── cache.service.ts           # Redis cache abstraction
│   │   └── token.service.ts           # JWT + refresh token logic
│   │
│   ├── middlewares/                   # Express middlewares
│   │   ├── auth.middleware.ts         # JWT verification
│   │   ├── role.middleware.ts         # RBAC enforcement
│   │   ├── validate.middleware.ts     # Zod validation runner
│   │   ├── rate-limit.middleware.ts   # Rate limiting
│   │   ├── upload.middleware.ts       # Multer file upload
│   │   ├── error.middleware.ts        # Global error handler
│   │   └── logger.middleware.ts       # Request logging
│   │
│   ├── validators/                    # Zod validation schemas
│   │   ├── auth.validator.ts
│   │   ├── user.validator.ts
│   │   ├── company.validator.ts
│   │   ├── job.validator.ts
│   │   ├── candidate.validator.ts
│   │   ├── application.validator.ts
│   │   ├── interview.validator.ts
│   │   └── common.validator.ts        # Shared schemas (pagination, objectId)
│   │
│   ├── utils/                         # Utility functions
│   │   ├── api-error.ts               # Custom error classes
│   │   ├── api-response.ts            # Standardized response builder
│   │   ├── async-handler.ts           # Async route wrapper (try/catch)
│   │   ├── logger.ts                  # Winston logger setup
│   │   ├── pagination.ts             # Pagination helper
│   │   ├── slugify.ts                # URL-safe slug generator
│   │   └── helpers.ts                # Misc helper functions
│   │
│   ├── types/                         # TypeScript types
│   │   ├── express.d.ts               # Express request augmentation
│   │   ├── environment.d.ts           # process.env types
│   │   └── models.types.ts            # Shared model types
│   │
│   └── templates/                     # Email templates
│       ├── verify-email.html
│       ├── reset-password.html
│       ├── welcome.html
│       ├── interview-scheduled.html
│       └── team-invite.html
│
├── tests/                             # Test files
│   ├── unit/
│   │   ├── services/
│   │   └── utils/
│   ├── integration/
│   │   ├── auth.test.ts
│   │   ├── jobs.test.ts
│   │   └── candidates.test.ts
│   └── setup.ts                       # Test configuration
│
├── .env                               # Local environment variables
├── .env.example                       # Template
├── Dockerfile                         # Docker build
├── docker-compose.yml                 # Local dev (MongoDB + Redis)
├── tsconfig.json
├── eslint.config.mjs
├── prettier.config.mjs
├── nodemon.json                       # Dev server config
└── package.json
```

---

## 4. Shared Types (`shared/`)

```
shared/
├── types/
│   ├── user.ts                        # IUser, UserRole enum
│   ├── job.ts                         # IJob, JobStatus enum
│   ├── candidate.ts                   # ICandidate
│   ├── application.ts                 # IApplication, ApplicationStage enum
│   ├── interview.ts                   # IInterview, InterviewStatus enum
│   └── api.ts                         # ApiResponse<T>, PaginatedResponse<T>
├── constants/
│   ├── roles.ts                       # Role definitions
│   ├── stages.ts                      # Default pipeline stages
│   └── status.ts                      # Status enums
└── package.json
```

---

## 5. Routing Structure

### 5.1 Frontend Routes (Next.js App Router)

| Route | Page | Auth | Layout | Purpose |
|-------|------|:----:|--------|---------|
| `/` | Landing | ❌ | Marketing | Product landing page |
| `/login` | Login | ❌ | Auth | User login |
| `/register` | Register | ❌ | Auth | New account creation |
| `/forgot-password` | Forgot Password | ❌ | Auth | Request password reset |
| `/reset-password` | Reset Password | ❌ | Auth | Set new password (via token) |
| `/verify-email` | Verify Email | ❌ | Auth | Email verification (via token) |
| `/dashboard` | Dashboard | ✅ | Dashboard | Overview metrics & quick actions |
| `/jobs` | Jobs List | ✅ | Dashboard | All jobs with filters |
| `/jobs/new` | Create Job | ✅ | Dashboard | Job creation form |
| `/jobs/[jobId]` | Job Detail | ✅ | Dashboard | Pipeline view + candidate cards |
| `/jobs/[jobId]/edit` | Edit Job | ✅ | Dashboard | Edit job details |
| `/candidates` | Candidates List | ✅ | Dashboard | All candidates with search |
| `/candidates/[candidateId]` | Candidate Profile | ✅ | Dashboard | Full candidate view |
| `/interviews` | Interviews List | ✅ | Dashboard | All interviews |
| `/interviews/calendar` | Calendar | ✅ | Dashboard | Calendar view |
| `/team` | Team Members | ✅ | Dashboard | Team directory |
| `/analytics` | Analytics | ✅ | Dashboard | Charts & reports |
| `/notifications` | Notifications | ✅ | Dashboard | Notification center |
| `/audit-logs` | Audit Logs | ✅ | Dashboard | Activity history |
| `/settings` | Settings | ✅ | Dashboard | General settings |
| `/settings/company` | Company Settings | ✅ | Dashboard | Company configuration |
| `/settings/notifications` | Notification Prefs | ✅ | Dashboard | Notification settings |
| `/profile` | Profile | ✅ | Dashboard | User profile management |

### 5.2 Route Protection Strategy

```typescript
// Middleware-based route protection (Next.js middleware.ts)

const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/reset-password', '/verify-email'];
const authRoutes = ['/login', '/register']; // Redirect to /dashboard if already logged in

// middleware.ts
export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken');
  const { pathname } = request.nextUrl;

  // If user is logged in and tries to access auth pages → redirect to dashboard
  if (token && authRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If user is NOT logged in and tries to access protected pages → redirect to login
  if (!token && !publicRoutes.some(route => pathname === route)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}
```

### 5.3 Role-Based Page Access

| Route | Super Admin | Admin | Recruiter | Hiring Manager | Interviewer | Viewer |
|-------|:---:|:---:|:---:|:---:|:---:|:---:|
| `/dashboard` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/jobs` | ✅ | ✅ | ✅ | ✅ (assigned) | ❌ | ✅ (assigned) |
| `/jobs/new` | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| `/candidates` | ✅ | ✅ | ✅ | ✅ (assigned) | ❌ | ✅ (assigned) |
| `/interviews` | ✅ | ✅ | ✅ | ✅ | ✅ (own) | ❌ |
| `/team` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `/analytics` | ✅ | ✅ | ✅ | ✅ (limited) | ❌ | ✅ (limited) |
| `/audit-logs` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| `/settings` | ✅ | ✅ | ✅ (own) | ✅ (own) | ✅ (own) | ✅ (own) |
| `/settings/company` | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

### 5.4 Backend API Routes

| Prefix | Resource | File |
|--------|----------|------|
| `/api/v1/auth` | Authentication | `auth.routes.ts` |
| `/api/v1/users` | User management | `users.routes.ts` |
| `/api/v1/companies` | Company settings | `companies.routes.ts` |
| `/api/v1/jobs` | Job CRUD + pipeline | `jobs.routes.ts` |
| `/api/v1/candidates` | Candidate management | `candidates.routes.ts` |
| `/api/v1/applications` | Application management | `applications.routes.ts` |
| `/api/v1/interviews` | Interview scheduling | `interviews.routes.ts` |
| `/api/v1/notifications` | Notification system | `notifications.routes.ts` |
| `/api/v1/analytics` | Dashboard & reports | `analytics.routes.ts` |
| `/api/v1/files` | File upload/download | `files.routes.ts` |
| `/api/v1/audit` | Audit logs | `audit.routes.ts` |

---

*End of Step 2 — Architecture, Folder Structure & Routing*

*Next: Step 3 — Database Schema Design (all collections, indexes, relationships, ER Diagram)*
