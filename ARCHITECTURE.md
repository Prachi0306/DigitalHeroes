# HireTrack — System Architecture

> **Document Version:** 1.0  
> **Last Updated:** 2026-07-10  
> **Status:** Draft — Pending Approval  

---

## 1. High-Level Architecture

HireTrack follows a **3-tier client-server architecture** with clear separation between the presentation layer, application layer, and data layer.

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT TIER                              │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Next.js 15 (App Router)                      │  │
│  │  ┌─────────┐ ┌──────────┐ ┌────────┐ ┌──────────────┐   │  │
│  │  │  Pages  │ │Components│ │ Hooks  │ │ TanStack     │   │  │
│  │  │ (RSC +  │ │(Shadcn + │ │(Custom)│ │ Query Cache  │   │  │
│  │  │ Client) │ │ Motion)  │ │        │ │              │   │  │
│  │  └─────────┘ └──────────┘ └────────┘ └──────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
│                          │ HTTPS (REST API)                     │
│                          ▼                                      │
├─────────────────────────────────────────────────────────────────┤
│                      APPLICATION TIER                           │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │              Express.js (Node.js)                         │  │
│  │  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌───────────┐  │  │
│  │  │  Routes  │ │Controllers│ │ Services │ │Middlewares│  │  │
│  │  └──────────┘ └───────────┘ └──────────┘ └───────────┘  │  │
│  │  ┌──────────┐ ┌───────────┐ ┌──────────┐ ┌───────────┐  │  │
│  │  │Validators│ │   Utils   │ │  Config  │ │  Models   │  │  │
│  │  └──────────┘ └───────────┘ └──────────┘ └───────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
│                          │                                      │
│                          ▼                                      │
├─────────────────────────────────────────────────────────────────┤
│                        DATA TIER                                │
│                                                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │ MongoDB Atlas │  │    Redis     │  │     Cloudinary       │  │
│  │  (Primary DB) │  │  (Cache +   │  │  (File Storage)      │  │
│  │              │  │   Sessions)  │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Architecture Pattern

### 2.1 Backend — Layered Architecture

```
Request → Route → Middleware → Controller → Service → Model → Database
                                    │
                              Validator (Zod)
```

| Layer | Responsibility | Example |
|-------|---------------|---------|
| **Route** | HTTP method + path mapping | `POST /api/v1/jobs` |
| **Middleware** | Auth, rate limiting, error handling, logging | `authMiddleware`, `rateLimiter` |
| **Controller** | Request parsing, response formatting | Extract body → call service → send response |
| **Service** | Business logic, orchestration | Create job → assign recruiter → send notification |
| **Model** | Data access, schema definition | Mongoose schema + static/instance methods |
| **Validator** | Input validation (Zod schemas) | Validate request body/params/query |

### 2.2 Frontend — Feature-Based Architecture

```
app/
├── (auth)/           → Auth-related pages (login, register, etc.)
├── (dashboard)/      → Protected app pages
│   ├── dashboard/    → Overview dashboard
│   ├── jobs/         → Job management
│   ├── candidates/   → Candidate management
│   └── ...
└── (marketing)/      → Landing page, public pages
```

Each feature module contains its own:
- Components (UI specific to that feature)
- Hooks (data fetching, state logic)
- Types (TypeScript interfaces)
- Utils (feature-specific helpers)

Shared resources live in top-level directories (`components/ui/`, `hooks/`, `lib/`, `types/`).

---

## 3. Data Flow

### 3.1 Read Flow (Example: Load Jobs List)

```
User visits /jobs
    │
    ▼
Next.js Client Component mounts
    │
    ▼
TanStack Query fires GET /api/v1/jobs?page=1&limit=20
    │
    ▼
Express Router → authMiddleware (verify JWT)
    │
    ▼
Controller parses query params → calls JobService.list()
    │
    ▼
Service checks Redis cache
    │  ├── Cache HIT → return cached data
    │  └── Cache MISS ▼
    │          Mongoose query with pagination + filters
    │          │
    │          ▼
    │      MongoDB Atlas returns documents
    │          │
    │          ▼
    │      Service caches result in Redis (TTL: 60s)
    │
    ▼
Controller sends JSON response { data, pagination, meta }
    │
    ▼
TanStack Query caches response (staleTime: 30s)
    │
    ▼
React renders JobsTable component
```

### 3.2 Write Flow (Example: Create Job)

```
User fills job form → submits
    │
    ▼
React Hook Form validates with Zod schema (client-side)
    │
    ▼
TanStack Mutation fires POST /api/v1/jobs
    │
    ▼
Express Router → authMiddleware → roleMiddleware('admin','recruiter')
    │
    ▼
Zod validator validates request body (server-side)
    │
    ▼
Controller → JobService.create(data, userId)
    │
    ▼
Service: create job document → log activity → send notification
    │
    ▼
MongoDB writes document
    │
    ▼
Service invalidates Redis cache (jobs list)
    │
    ▼
Controller returns 201 { data: newJob }
    │
    ▼
TanStack Query invalidates ['jobs'] query → refetches list
    │
    ▼
Toast notification: "Job created successfully"
```

---

## 4. Authentication Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Client    │     │   Express    │     │    Redis    │
│  (Next.js)  │     │   Server     │     │   (Store)   │
└──────┬──────┘     └──────┬───────┘     └──────┬──────┘
       │                   │                    │
       │  POST /auth/login │                    │
       │──────────────────>│                    │
       │                   │  Validate creds    │
       │                   │  Generate tokens   │
       │                   │                    │
       │                   │  Store refresh     │
       │                   │  token in Redis    │
       │                   │───────────────────>│
       │                   │                    │
       │  { accessToken,   │                    │
       │    refreshToken } │                    │
       │<──────────────────│                    │
       │                   │                    │
       │  Store accessToken│                    │
       │  in memory        │                    │
       │  Store refreshToken                    │
       │  in httpOnly cookie                    │
       │                   │                    │
       │  GET /api/jobs    │                    │
       │  Auth: Bearer xxx │                    │
       │──────────────────>│                    │
       │                   │  Verify JWT        │
       │                   │  Extract user      │
       │  200 { data }     │                    │
       │<──────────────────│                    │
       │                   │                    │
       │  (Token expired)  │                    │
       │  POST /auth/refresh                    │
       │  Cookie: refresh  │                    │
       │──────────────────>│                    │
       │                   │  Validate refresh  │
       │                   │  token in Redis    │
       │                   │───────────────────>│
       │                   │  Valid? Rotate     │
       │                   │<───────────────────│
       │  { newAccessToken,│                    │
       │    newRefresh }   │                    │
       │<──────────────────│                    │
```

**Token Strategy:**
| Token | Storage | Lifetime | Purpose |
|-------|---------|----------|---------|
| Access Token | In-memory (JS variable) | 15 minutes | API authentication |
| Refresh Token | httpOnly secure cookie + Redis | 7 days | Token rotation |

---

## 5. Deployment Architecture

```
┌────────────────────────────────────────────────────────────┐
│                      PRODUCTION                            │
│                                                            │
│  ┌─────────────┐    ┌─────────────┐    ┌──────────────┐   │
│  │   Vercel    │    │   Render    │    │MongoDB Atlas │   │
│  │  (Frontend) │───>│  (Backend)  │───>│  (Database)  │   │
│  │  Next.js 15 │    │  Express.js │    │  M0 Free     │   │
│  │  CDN + Edge │    │  Docker     │    │              │   │
│  └─────────────┘    └──────┬──────┘    └──────────────┘   │
│                            │                               │
│                     ┌──────┴──────┐                        │
│                     │   Redis     │                        │
│                     │  (Render)   │                        │
│                     └─────────────┘                        │
│                                                            │
│  ┌─────────────┐                                           │
│  │ Cloudinary  │                                           │
│  │(File Store) │                                           │
│  └─────────────┘                                           │
└────────────────────────────────────────────────────────────┘
```

### Environment Strategy

| Environment | Frontend | Backend | Database |
|-------------|----------|---------|----------|
| **Development** | `localhost:3000` | `localhost:5000` | MongoDB Atlas (dev cluster) |
| **Staging** | Vercel Preview | Render (staging service) | MongoDB Atlas (staging DB) |
| **Production** | Vercel (main branch) | Render (main branch) | MongoDB Atlas (prod DB) |

---

## 6. Communication Patterns

| Pattern | Usage | Implementation |
|---------|-------|----------------|
| **REST API** | All client-server communication | Express routes, JSON responses |
| **Polling** | Notification updates | TanStack Query refetchInterval (30s) |
| **Event-driven (internal)** | Activity logging, notification creation | Service-layer event emitters |
| **File upload** | Resume/avatar uploads | Multipart form → Cloudinary SDK |
| **Email** | Verification, password reset, notifications | Nodemailer + SMTP |

---

## 7. Security Architecture

```
Client Request
    │
    ▼
┌──────────────┐
│  Helmet.js   │ ← Security headers (CSP, HSTS, X-Frame)
├──────────────┤
│  CORS        │ ← Whitelist frontend origin only
├──────────────┤
│  Rate Limiter│ ← 100 req/15min per IP (general)
│              │   10 req/15min per IP (auth endpoints)
├──────────────┤
│  JWT Verify  │ ← Validate access token signature + expiry
├──────────────┤
│  Role Check  │ ← RBAC middleware (role ∈ allowed roles)
├──────────────┤
│  Zod Validate│ ← Sanitize + validate all input
├──────────────┤
│  Controller  │ ← Process request
└──────────────┘
```
