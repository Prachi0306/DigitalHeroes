# HireTrack — Engineering Strategies

> **Document Version:** 1.0  
> **Last Updated:** 2026-07-10  
> **Status:** Draft — Pending Approval  

---

## 1. Caching Strategy

### 1.1 Server-Side (Redis)

| Cache Key Pattern | TTL | Invalidation Trigger |
|------------------|-----|---------------------|
| `company:{id}:jobs:page:{n}` | 60s | Job created/updated/deleted |
| `company:{id}:candidates:page:{n}` | 60s | Candidate created/updated |
| `company:{id}:dashboard` | 30s | Any write operation |
| `company:{id}:analytics:{type}` | 300s | Nightly recompute or manual refresh |
| `job:{id}:pipeline` | 30s | Stage change, application create |
| `user:{id}:session` | 15min | Login, refresh, logout |
| `user:{id}:notifications:count` | 30s | New notification, mark read |

**Invalidation Pattern:**
```typescript
// Tag-based invalidation
await cacheService.invalidateByPrefix(`company:${companyId}:jobs`);
```

### 1.2 Client-Side (TanStack Query)

| Query Key | Stale Time | GC Time | Refetch Strategy |
|-----------|-----------|---------|-----------------|
| `['jobs', filters]` | 30s | 5min | On window focus + on mutation |
| `['job', jobId]` | 60s | 10min | On window focus |
| `['candidates', filters]` | 30s | 5min | On window focus + on mutation |
| `['candidate', candidateId]` | 60s | 10min | On window focus |
| `['pipeline', jobId]` | 15s | 5min | On mutation (stage change) |
| `['interviews', filters]` | 30s | 5min | On window focus |
| `['dashboard']` | 30s | 5min | refetchInterval: 60s |
| `['notifications']` | 10s | 2min | refetchInterval: 30s |
| `['analytics', type]` | 300s | 30min | Manual refresh only |
| `['user', 'me']` | 600s | 30min | On window focus |

**Optimistic Updates:** Applied for stage changes (drag-and-drop) and notification mark-as-read to provide instant UI feedback.

---

## 2. Error Handling Strategy

### 2.1 Backend Error Classes

```typescript
class ApiError extends Error {
  statusCode: number;
  code: string;
  details?: any[];

  constructor(statusCode: number, code: string, message: string, details?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

// Specific subclasses
class NotFoundError extends ApiError { constructor(resource) { super(404, 'NOT_FOUND', `${resource} not found`); } }
class ValidationError extends ApiError { constructor(details) { super(400, 'VALIDATION_ERROR', 'Validation failed', details); } }
class UnauthorizedError extends ApiError { constructor(msg?) { super(401, 'UNAUTHORIZED', msg || 'Authentication required'); } }
class ForbiddenError extends ApiError { constructor(msg?) { super(403, 'FORBIDDEN', msg || 'Insufficient permissions'); } }
class ConflictError extends ApiError { constructor(msg) { super(409, 'CONFLICT', msg); } }
```

### 2.2 Global Error Middleware

```typescript
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  // Known API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      error: { code: err.code, message: err.message, details: err.details },
      meta: { timestamp: new Date().toISOString(), requestId: req.id }
    });
  }

  // Mongoose validation errors → transform to ValidationError
  if (err.name === 'ValidationError') { ... }

  // Mongoose duplicate key → ConflictError
  if (err.code === 11000) { ... }

  // JWT errors
  if (err.name === 'JsonWebTokenError') { ... }
  if (err.name === 'TokenExpiredError') { ... }

  // Unknown errors → 500 (never leak stack traces in production)
  logger.error('Unhandled error', { error: err.message, stack: err.stack, requestId: req.id });
  return res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'An unexpected error occurred' },
    meta: { timestamp: new Date().toISOString(), requestId: req.id }
  });
};
```

### 2.3 Frontend Error Handling

| Layer | Strategy |
|-------|----------|
| **API Client** | Axios interceptor transforms errors into typed `ApiError` objects |
| **TanStack Query** | `onError` callbacks show toast notifications |
| **Route Level** | `error.tsx` error boundaries catch render errors |
| **Form Level** | React Hook Form + Zod display inline field errors |
| **Global** | `window.onerror` + `unhandledrejection` → log to console (production: error tracking service) |

---

## 3. Logging Strategy

### 3.1 Backend (Winston)

```typescript
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === 'production'
      ? winston.format.json()
      : winston.format.colorize() + winston.format.simple()
  ),
  transports: [
    new winston.transports.Console(),
    // Production: add file transport or external service
  ]
});
```

### 3.2 Log Levels

| Level | Usage | Example |
|-------|-------|---------|
| `error` | Unhandled errors, failed critical operations | DB connection failure, unhandled exception |
| `warn` | Recoverable issues, deprecated usage | Rate limit approached, token almost expired |
| `info` | Business events, API requests | User registered, job created, login success |
| `debug` | Development debugging | Query params, cache hit/miss, service calls |

### 3.3 Request Logging

Every request logs: `method`, `url`, `statusCode`, `responseTime`, `userId`, `requestId`, `ip`, `userAgent`.

```
INFO [2026-07-10T09:00:00Z] POST /api/v1/jobs 201 45ms userId=abc123 reqId=req_xyz
```

### 3.4 Structured Log Format (Production)

```json
{
  "level": "info",
  "message": "Job created",
  "timestamp": "2026-07-10T09:00:00.000Z",
  "requestId": "req_xyz",
  "userId": "abc123",
  "companyId": "def456",
  "resourceType": "job",
  "resourceId": "ghi789",
  "duration": 45
}
```

---

## 4. Security Strategy

### 4.1 Security Headers (Helmet.js)

| Header | Value |
|--------|-------|
| `Content-Security-Policy` | `default-src 'self'; img-src 'self' res.cloudinary.com; font-src fonts.gstatic.com` |
| `X-Content-Type-Options` | `nosniff` |
| `X-Frame-Options` | `DENY` |
| `X-XSS-Protection` | `0` (rely on CSP instead) |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=()` |

### 4.2 Input Sanitization

- All user inputs validated with Zod (whitelist approach)
- HTML in rich text fields sanitized with DOMPurify before storage
- MongoDB query injection prevented by Mongoose schema typing
- No raw query construction — always use Mongoose methods

### 4.3 CORS Configuration

```typescript
const corsOptions = {
  origin: process.env.CLIENT_URL, // Single allowed origin
  credentials: true,              // Allow cookies
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400                   // Preflight cache: 24h
};
```

### 4.4 Additional Measures

| Measure | Implementation |
|---------|---------------|
| Brute force protection | Rate limiting on auth endpoints |
| Session fixation | Refresh token rotation |
| XSS | httpOnly cookies, CSP headers, input sanitization |
| CSRF | SameSite=Strict cookies, no cookie-based auth for API |
| Data exposure | Field projection in queries, role-based data filtering |
| Dependency security | `npm audit` in CI, Dependabot alerts |
| Secrets management | Environment variables, never in code |

---

## 5. Performance Strategy

### 5.1 Backend

| Technique | Implementation |
|-----------|---------------|
| **Database indexing** | Compound indexes on all query patterns (45 total) |
| **Query projection** | Select only needed fields (`select('name email role')`) |
| **Lean queries** | Use `.lean()` for read-only queries (skip Mongoose hydration) |
| **Pagination** | Cursor-based for large datasets, offset for UI tables |
| **Redis caching** | Cache frequently-read data (30-300s TTL) |
| **Connection pooling** | Mongoose default pool (5 connections) |
| **Compression** | gzip via `compression` middleware |
| **Request ID** | UUID per request for tracing |

### 5.2 Frontend

| Technique | Implementation |
|-----------|---------------|
| **Code splitting** | Next.js automatic route-based splitting |
| **Dynamic imports** | `dynamic()` for heavy components (charts, rich text editor, calendar) |
| **Image optimization** | Next.js `<Image>` with Cloudinary transformations |
| **Bundle analysis** | `@next/bundle-analyzer` in CI |
| **Prefetching** | Next.js `<Link>` auto-prefetch on viewport |
| **Stale-While-Revalidate** | TanStack Query with staleTime configuration |
| **Skeleton loading** | Content-specific skeletons (no layout shift) |
| **Debounced search** | 300ms debounce on search inputs |
| **Virtual scrolling** | For lists with 100+ items (future) |
| **Font optimization** | `next/font` with `display: swap` |

### 5.3 Performance Targets

| Metric | Target |
|--------|--------|
| LCP (Largest Contentful Paint) | < 1.5s |
| FID (First Input Delay) | < 100ms |
| CLS (Cumulative Layout Shift) | < 0.1 |
| TTI (Time to Interactive) | < 2s |
| API Response (p95) | < 200ms |
| API Response (p99) | < 500ms |

---

## 6. Deployment Strategy

### 6.1 Pipeline

```
Developer pushes to feature branch
    │
    ▼
GitHub Actions CI triggers
    ├── Lint (ESLint)
    ├── Type Check (tsc --noEmit)
    ├── Unit Tests (Jest/Vitest)
    └── Build Check
    │
    ▼
PR created → Code review
    │
    ▼
Merge to main
    │
    ├── Frontend: Vercel auto-deploys from main
    └── Backend: Render auto-deploys from main (Docker)
```

### 6.2 Docker (Backend)

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
EXPOSE 5000
CMD ["node", "dist/index.js"]
```

### 6.3 Health Check

```
GET /api/v1/health → { status: 'ok', uptime, db: 'connected', redis: 'connected', version }
```

---

## 7. Testing Strategy

### 7.1 Test Pyramid

| Layer | Tool | Coverage Target | What to Test |
|-------|------|:---:|------|
| **Unit** | Vitest / Jest | 80% | Services, utils, validators, hooks |
| **Integration** | Supertest + MongoDB Memory Server | 60% | API endpoints, middleware chains |
| **Component** | React Testing Library | 50% | UI components with user interactions |
| **E2E** | Playwright (future) | Critical paths | Login flow, job creation, candidate pipeline |

### 7.2 Backend Test Structure

```
tests/
├── unit/
│   ├── services/
│   │   ├── auth.service.test.ts
│   │   ├── job.service.test.ts
│   │   └── candidate.service.test.ts
│   └── utils/
│       ├── pagination.test.ts
│       └── api-error.test.ts
├── integration/
│   ├── auth.test.ts          # Register, login, refresh, logout
│   ├── jobs.test.ts          # CRUD, filters, pagination
│   └── candidates.test.ts   # CRUD, search, duplicates
└── setup.ts                  # DB setup/teardown
```

### 7.3 Test Conventions

- Test files co-located or in `tests/` directory
- Naming: `*.test.ts` or `*.spec.ts`
- Each test: Arrange → Act → Assert
- Use factories for test data generation
- No test interdependence — each test sets up/tears down its own data
- CI runs all tests on every PR

---

## 8. Scalability Strategy

### 8.1 Current Scale (v1)

| Metric | Supported |
|--------|-----------|
| Users | 500 MAU |
| Companies | 50 |
| Jobs | 1,000 |
| Candidates | 10,000 |
| Applications | 50,000 |
| Concurrent requests | 50-100 |

### 8.2 Scaling Path

| Bottleneck | Trigger | Solution |
|-----------|---------|----------|
| Render cold starts | Response > 2s after idle | Upgrade to paid tier (always-on) |
| MongoDB Atlas M0 | 512MB storage hit | Upgrade to M2/M5 ($9-25/mo) |
| Redis memory | Cache > 25MB | Reduce TTLs, upgrade tier |
| API throughput | > 100 req/s sustained | Add horizontal scaling (Render auto-scale) |
| File storage | Cloudinary bandwidth limit | CDN caching, image optimization |
| Search performance | Full-text search slow | Atlas Search or Elasticsearch |

### 8.3 Architecture Decisions for Scale

- **Stateless backend** — No server-side session state (JWT + Redis) enables horizontal scaling
- **Database indexes** — Pre-designed for all query patterns
- **Denormalized counters** — Avoid expensive `$count` aggregations
- **Pagination everywhere** — No unbounded queries
- **TTL indexes** — Auto-cleanup of old notifications, tokens, logs

---

## 9. SEO Strategy

### 9.1 Pages

| Page | SEO Priority | Strategy |
|------|:---:|---------|
| Landing (`/`) | High | Full SSR, meta tags, structured data |
| Auth pages | Low | `noindex, nofollow` |
| Dashboard pages | None | Behind auth, not crawled |

### 9.2 Implementation

```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: { default: 'HireTrack — Modern Applicant Tracking System', template: '%s | HireTrack' },
  description: 'Streamline your hiring with HireTrack...',
  openGraph: { type: 'website', locale: 'en_US', url: 'https://hiretrack.app', siteName: 'HireTrack', images: ['/og-image.png'] },
  twitter: { card: 'summary_large_image', creator: '@hiretrack' },
  robots: { index: true, follow: true }
};
```

- `robots.txt` — Allow `/`, disallow `/dashboard/*`, `/api/*`
- `sitemap.xml` — Landing page only (dynamic pages behind auth)
- Semantic HTML — proper heading hierarchy, landmarks
- Structured data — `Organization` schema on landing page

---

## 10. Accessibility Strategy

### 10.1 Standards

Target: **WCAG 2.1 Level AA**

### 10.2 Implementation Checklist

| Category | Requirements |
|----------|-------------|
| **Color** | 4.5:1 contrast ratio for text, 3:1 for large text and UI components |
| **Keyboard** | All interactive elements focusable, logical tab order, visible focus ring (`shadow-ring`) |
| **Screen Reader** | ARIA labels on icons, `aria-live` for dynamic content, `role` attributes on custom widgets |
| **Forms** | Labels associated with inputs (`htmlFor`), error messages linked via `aria-describedby`, required fields marked |
| **Images** | Alt text on all images, decorative images have `alt=""` |
| **Motion** | `prefers-reduced-motion` query disables animations |
| **Navigation** | Skip-to-content link, landmark regions (`main`, `nav`, `aside`) |
| **Tables** | `<th>` with `scope`, `<caption>` for data tables |
| **Modals** | Focus trap, Escape to close, `aria-modal="true"`, return focus on close |
| **Toasts** | `role="alert"`, `aria-live="polite"` |

### 10.3 Shadcn + Radix

Shadcn UI components are built on Radix primitives which provide accessibility out of the box (focus management, keyboard navigation, ARIA attributes). Custom components must match this standard.

---

## 11. State Management Strategy

### 11.1 State Categories

| Type | Tool | Examples |
|------|------|---------|
| **Server State** | TanStack Query | Jobs, candidates, interviews, notifications, analytics |
| **Auth State** | Zustand | Current user, access token, isAuthenticated |
| **UI State** | Zustand | Sidebar collapsed, active modal, theme preference |
| **Form State** | React Hook Form | All forms (job creation, candidate, interview scheduling) |
| **URL State** | Next.js searchParams | Filters, pagination, sort, active tab |
| **Local State** | React useState | Component-level toggles, input values |

### 11.2 Rules

1. **Server state is the source of truth** — Never duplicate API data in Zustand
2. **URL is the source of truth for filters** — Pagination, sort, and filters live in URL search params (shareable, bookmarkable)
3. **Minimize client state** — Prefer derived state and URL params over stored state
4. **TanStack Query handles caching** — No manual cache management outside of query invalidation

---

## 12. Validation Strategy

### 12.1 Dual Validation

| Layer | Tool | Purpose |
|-------|------|---------|
| **Client** | Zod + React Hook Form | Instant feedback, prevent bad requests |
| **Server** | Zod middleware | Security (never trust client), canonical validation |

### 12.2 Shared Schemas

Zod schemas defined in `shared/` are imported by both client and server to ensure validation parity.

```typescript
// shared/validations/job.ts
export const createJobSchema = z.object({
  title: z.string().min(3).max(100).trim(),
  department: z.enum(['engineering', 'product', ...]),
  location: z.object({
    type: z.enum(['onsite', 'remote', 'hybrid']),
    city: z.string().optional(),
  }).refine(data => data.type === 'remote' || data.city, {
    message: 'City required for onsite/hybrid',
    path: ['city']
  }),
  // ...
});
```

---

*End of Step 8 — Engineering Strategies*

*Next: Step 9 — Documentation Plan, Git Strategy & Environment Variables*
