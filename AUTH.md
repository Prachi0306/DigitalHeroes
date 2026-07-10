# HireTrack — Authentication & Authorization

> **Document Version:** 1.0  
> **Last Updated:** 2026-07-10  
> **Status:** Draft — Pending Approval  

---

## 1. Authentication Flows

### 1.1 Registration Flow

```
┌──────────┐          ┌──────────┐          ┌──────────┐          ┌──────────┐
│  Client  │          │  Server  │          │ MongoDB  │          │  Email   │
└────┬─────┘          └────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │                     │
     │ POST /auth/register │                     │                     │
     │ {firstName, lastName,│                    │                     │
     │  email, password,   │                     │                     │
     │  companyName}       │                     │                     │
     │────────────────────>│                     │                     │
     │                     │                     │                     │
     │                     │ Validate with Zod   │                     │
     │                     │ Hash password (bcrypt, 12 rounds)         │
     │                     │ Generate verification token               │
     │                     │                     │                     │
     │                     │ Create Company      │                     │
     │                     │────────────────────>│                     │
     │                     │                     │                     │
     │                     │ Create User (role:  │                     │
     │                     │ super_admin)        │                     │
     │                     │────────────────────>│                     │
     │                     │                     │                     │
     │                     │ Send verification email                   │
     │                     │─────────────────────────────────────────>│
     │                     │                     │                     │
     │ 201 { message:      │                     │                     │
     │  "Check your email" }                     │                     │
     │<────────────────────│                     │                     │
     │                     │                     │                     │
     │ User clicks email link                    │                     │
     │ GET /auth/verify-email?token=xxx          │                     │
     │────────────────────>│                     │                     │
     │                     │ Hash token, find user│                    │
     │                     │ Set isEmailVerified: true                 │
     │                     │────────────────────>│                     │
     │                     │                     │                     │
     │ 200 { message:      │                     │                     │
     │  "Email verified" } │                     │                     │
     │<────────────────────│                     │                     │
```

**Validation Rules:**
| Field | Rule |
|-------|------|
| `firstName` | Required, 2-50 chars, alphabetic |
| `lastName` | Required, 2-50 chars, alphabetic |
| `email` | Required, valid email, unique |
| `password` | Required, min 8 chars, must contain: uppercase, lowercase, digit, special char |
| `companyName` | Required, 2-100 chars |

**Error Scenarios:**
| Scenario | Status | Error Code |
|----------|--------|------------|
| Email already registered | 409 | `EMAIL_ALREADY_EXISTS` |
| Validation fails | 400 | `VALIDATION_ERROR` |
| Server error | 500 | `INTERNAL_ERROR` |

---

### 1.2 Login Flow

```
┌──────────┐          ┌──────────┐          ┌──────────┐          ┌──────────┐
│  Client  │          │  Server  │          │ MongoDB  │          │  Redis   │
└────┬─────┘          └────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │                     │
     │ POST /auth/login    │                     │                     │
     │ {email, password}   │                     │                     │
     │────────────────────>│                     │                     │
     │                     │                     │                     │
     │                     │ Find user by email  │                     │
     │                     │────────────────────>│                     │
     │                     │ User found          │                     │
     │                     │<────────────────────│                     │
     │                     │                     │                     │
     │                     │ Compare password    │                     │
     │                     │ (bcrypt.compare)    │                     │
     │                     │                     │                     │
     │                     │ Check: isActive?    │                     │
     │                     │ Check: isEmailVerified?                   │
     │                     │                     │                     │
     │                     │ Generate access token (JWT, 15min)        │
     │                     │ Generate refresh token (crypto, 7 days)   │
     │                     │                     │                     │
     │                     │ Store refresh token │                     │
     │                     │ hash in MongoDB     │                     │
     │                     │────────────────────>│                     │
     │                     │                     │                     │
     │                     │ Cache user session  │                     │
     │                     │ in Redis            │                     │
     │                     │─────────────────────────────────────────>│
     │                     │                     │                     │
     │                     │ Update lastLoginAt  │                     │
     │                     │────────────────────>│                     │
     │                     │                     │                     │
     │                     │ Log activity        │                     │
     │                     │────────────────────>│                     │
     │                     │                     │                     │
     │ 200 { user, accessToken }                 │                     │
     │ Set-Cookie: refreshToken (httpOnly,       │                     │
     │   secure, sameSite: strict, path: /api/auth)                   │
     │<────────────────────│                     │                     │
     │                     │                     │                     │
     │ Store accessToken   │                     │                     │
     │ in memory (state)   │                     │                     │
```

**JWT Access Token Payload:**
```typescript
{
  userId: string;       // User._id
  email: string;
  role: string;         // User.role
  companyId: string;    // User.company
  iat: number;          // issued at
  exp: number;          // expires in 15 minutes
}
```

**Error Scenarios:**
| Scenario | Status | Error Code |
|----------|--------|------------|
| Invalid email or password | 401 | `INVALID_CREDENTIALS` |
| Email not verified | 403 | `EMAIL_NOT_VERIFIED` |
| Account deactivated | 403 | `ACCOUNT_DEACTIVATED` |
| Too many login attempts | 429 | `TOO_MANY_ATTEMPTS` |

---

### 1.3 Token Refresh Flow

```
┌──────────┐          ┌──────────┐          ┌──────────┐          ┌──────────┐
│  Client  │          │  Server  │          │ MongoDB  │          │  Redis   │
└────┬─────┘          └────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │                     │
     │ Access token expired│                     │                     │
     │ (401 from any API)  │                     │                     │
     │                     │                     │                     │
     │ POST /auth/refresh  │                     │                     │
     │ Cookie: refreshToken│                     │                     │
     │────────────────────>│                     │                     │
     │                     │                     │                     │
     │                     │ Extract token from  │                     │
     │                     │ httpOnly cookie     │                     │
     │                     │                     │                     │
     │                     │ Hash token, find in │                     │
     │                     │ RefreshTokens       │                     │
     │                     │────────────────────>│                     │
     │                     │ Found + not expired │                     │
     │                     │<────────────────────│                     │
     │                     │                     │                     │
     │                     │ ── TOKEN ROTATION ──│                     │
     │                     │ Revoke old refresh  │                     │
     │                     │ token               │                     │
     │                     │────────────────────>│                     │
     │                     │                     │                     │
     │                     │ Generate new access │                     │
     │                     │ + refresh tokens    │                     │
     │                     │                     │                     │
     │                     │ Store new refresh   │                     │
     │                     │ token hash          │                     │
     │                     │────────────────────>│                     │
     │                     │                     │                     │
     │                     │ Update Redis session│                     │
     │                     │─────────────────────────────────────────>│
     │                     │                     │                     │
     │ 200 { accessToken } │                     │                     │
     │ Set-Cookie: new     │                     │                     │
     │ refreshToken        │                     │                     │
     │<────────────────────│                     │                     │
```

**Refresh Token Rotation Security:**
- Every refresh creates a NEW refresh token and invalidates the old one
- If a revoked token is reused → **invalidate ALL tokens for that user** (potential theft detected)
- Refresh tokens are stored as SHA-256 hashes (never plaintext)

---

### 1.4 Forgot Password Flow

```
┌──────────┐          ┌──────────┐          ┌──────────┐          ┌──────────┐
│  Client  │          │  Server  │          │ MongoDB  │          │  Email   │
└────┬─────┘          └────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │                     │
     │ POST /auth/         │                     │                     │
     │   forgot-password   │                     │                     │
     │ { email }           │                     │                     │
     │────────────────────>│                     │                     │
     │                     │                     │                     │
     │                     │ Find user by email  │                     │
     │                     │────────────────────>│                     │
     │                     │                     │                     │
     │                     │ Generate reset token│                     │
     │                     │ (crypto.randomBytes) │                    │
     │                     │ Hash + store with   │                     │
     │                     │ 1-hour expiry       │                     │
     │                     │────────────────────>│                     │
     │                     │                     │                     │
     │                     │ Send reset email    │                     │
     │                     │─────────────────────────────────────────>│
     │                     │                     │                     │
     │ 200 { message:      │                     │                     │
     │  "Check email" }    │                     │                     │
     │<────────────────────│                     │                     │
     │                     │                     │                     │
     │ NOTE: Always return │                     │                     │
     │ 200 even if email   │                     │                     │
     │ not found (prevent  │                     │                     │
     │ email enumeration)  │                     │                     │
```

### 1.5 Reset Password Flow

```
┌──────────┐          ┌──────────┐          ┌──────────┐
│  Client  │          │  Server  │          │ MongoDB  │
└────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │
     │ POST /auth/         │                     │
     │   reset-password    │                     │
     │ { token, password } │                     │
     │────────────────────>│                     │
     │                     │                     │
     │                     │ Hash token, find    │
     │                     │ user where:         │
     │                     │ resetToken matches  │
     │                     │ AND expiry > now    │
     │                     │────────────────────>│
     │                     │                     │
     │                     │ Hash new password   │
     │                     │ Clear reset token   │
     │                     │ Revoke ALL refresh  │
     │                     │ tokens (force       │
     │                     │ re-login everywhere)│
     │                     │────────────────────>│
     │                     │                     │
     │ 200 { message:      │                     │
     │  "Password reset" } │                     │
     │<────────────────────│                     │
```

---

### 1.6 Logout Flow

```
┌──────────┐          ┌──────────┐          ┌──────────┐          ┌──────────┐
│  Client  │          │  Server  │          │ MongoDB  │          │  Redis   │
└────┬─────┘          └────┬─────┘          └────┬─────┘          └────┬─────┘
     │                     │                     │                     │
     │ POST /auth/logout   │                     │                     │
     │ Cookie: refreshToken│                     │                     │
     │────────────────────>│                     │                     │
     │                     │                     │                     │
     │                     │ Revoke refresh token│                     │
     │                     │────────────────────>│                     │
     │                     │                     │                     │
     │                     │ Delete Redis session│                     │
     │                     │─────────────────────────────────────────>│
     │                     │                     │                     │
     │                     │ Log activity        │                     │
     │                     │────────────────────>│                     │
     │                     │                     │                     │
     │ 200 { message }     │                     │                     │
     │ Clear-Cookie:       │                     │                     │
     │ refreshToken        │                     │                     │
     │<────────────────────│                     │                     │
     │                     │                     │                     │
     │ Clear accessToken   │                     │                     │
     │ from memory         │                     │                     │
     │ Redirect to /login  │                     │                     │
```

---

## 2. Authorization (RBAC) System

### 2.1 Permission Matrix

| Permission | Super Admin | Admin | Recruiter | Hiring Manager | Interviewer | Viewer |
|-----------|:---:|:---:|:---:|:---:|:---:|:---:|
| **Company** | | | | | | |
| Update company settings | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Manage billing | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **Team** | | | | | | |
| Invite users | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Change user roles | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Deactivate users | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View team directory | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Jobs** | | | | | | |
| Create job | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Edit any job | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| Edit assigned job | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Delete/archive job | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| View all jobs | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| View assigned jobs | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Candidates** | | | | | | |
| Add candidate | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Edit candidate | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| View all candidates | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| View assigned candidates | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| Move pipeline stage | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Reject candidate | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| **Interviews** | | | | | | |
| Schedule interview | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Cancel interview | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| View all interviews | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| View own interviews | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Submit feedback | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| **Analytics** | | | | | | |
| View full analytics | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| View limited analytics | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ |
| **Audit Logs** | | | | | | |
| View audit logs | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

### 2.2 Role Hierarchy

```
super_admin (all permissions)
    └── admin (all except billing)
        └── recruiter (job + candidate + interview management)
            └── hiring_manager (view assigned + feedback)
                └── interviewer (own interviews + feedback)
                    └── viewer (read-only on assigned resources)
```

### 2.3 Middleware Implementation Strategy

```typescript
// Role-based middleware
const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new ApiError(401, 'UNAUTHORIZED', 'Authentication required');
    }
    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, 'FORBIDDEN', 'Insufficient permissions');
    }
    next();
  };
};

// Usage in routes
router.post('/jobs', authenticate, authorize('super_admin', 'admin', 'recruiter'), createJob);
router.delete('/jobs/:id', authenticate, authorize('super_admin', 'admin'), deleteJob);
```

### 2.4 Resource-Level Authorization

Beyond role checks, some endpoints require resource-level ownership verification:

```typescript
// Check if user is assigned to the job
const authorizeJobAccess = async (req: Request, res: Response, next: NextFunction) => {
  const job = await Job.findById(req.params.jobId);
  
  if (!job) throw new ApiError(404, 'NOT_FOUND', 'Job not found');
  
  // Admins can access any job
  if (['super_admin', 'admin'].includes(req.user.role)) return next();
  
  // Recruiters must be assigned
  if (req.user.role === 'recruiter') {
    if (!job.recruiters.includes(req.user.userId)) {
      throw new ApiError(403, 'FORBIDDEN', 'Not assigned to this job');
    }
    return next();
  }
  
  // Hiring managers must be assigned
  if (req.user.role === 'hiring_manager') {
    if (job.hiringManager?.toString() !== req.user.userId) {
      throw new ApiError(403, 'FORBIDDEN', 'Not assigned to this job');
    }
    return next();
  }
  
  throw new ApiError(403, 'FORBIDDEN', 'Insufficient permissions');
};
```

---

## 3. Security Measures

### 3.1 Password Security

| Measure | Implementation |
|---------|---------------|
| Hashing | bcrypt with 12 salt rounds |
| Minimum length | 8 characters |
| Complexity | Uppercase + lowercase + digit + special char |
| Breach check | Validate against common password list (top 10,000) |
| History | Prevent reuse of last 3 passwords (v2) |

### 3.2 Token Security

| Measure | Implementation |
|---------|---------------|
| Access token signing | HS256 with 256-bit secret |
| Refresh token | 64 bytes from `crypto.randomBytes` |
| Token storage | Refresh: httpOnly cookie; Access: in-memory only |
| Refresh rotation | New token on every refresh, old one revoked |
| Theft detection | Reuse of revoked token → revoke ALL user tokens |

### 3.3 Rate Limiting

| Endpoint | Window | Max Requests | Action on Exceed |
|----------|--------|:---:|---------|
| `POST /auth/login` | 15 min | 5 | 429 + lockout message |
| `POST /auth/register` | 1 hour | 3 | 429 |
| `POST /auth/forgot-password` | 1 hour | 3 | 429 |
| `POST /auth/refresh` | 1 min | 10 | 429 |
| All other endpoints | 15 min | 100 | 429 |

### 3.4 Cookie Configuration

```typescript
const COOKIE_OPTIONS = {
  httpOnly: true,         // Not accessible via JavaScript
  secure: true,           // HTTPS only (production)
  sameSite: 'strict',     // CSRF protection
  path: '/api/v1/auth',   // Only sent to auth endpoints
  maxAge: 7 * 24 * 60 * 60 * 1000  // 7 days
};
```

---

## 4. Frontend Auth State Management

### 4.1 Auth Store (Zustand)

```typescript
interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<string>;
  setUser: (user: User) => void;
  clearAuth: () => void;
}
```

### 4.2 Axios Interceptor (Auto-Refresh)

```typescript
// Request interceptor — attach access token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — auto-refresh on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const newToken = await useAuthStore.getState().refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch {
        useAuthStore.getState().clearAuth();
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);
```

### 4.3 Route Protection (Next.js Middleware)

```typescript
// middleware.ts — runs on Edge before every page load
export function middleware(request: NextRequest) {
  const refreshToken = request.cookies.get('refreshToken');
  const { pathname } = request.nextUrl;

  const isPublicRoute = ['/', '/login', '/register', 
    '/forgot-password', '/reset-password', '/verify-email']
    .includes(pathname);

  const isAuthRoute = ['/login', '/register'].includes(pathname);

  // Logged-in user trying to access login/register → redirect to dashboard
  if (refreshToken && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Not logged in trying to access protected route → redirect to login
  if (!refreshToken && !isPublicRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
};
```

---

*End of Step 4 — Authentication & Authorization*

*Next: Step 5 — REST API Design*
