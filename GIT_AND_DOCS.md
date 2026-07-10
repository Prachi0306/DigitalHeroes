# HireTrack — Documentation, Git Strategy & Environment Variables

> **Document Version:** 1.0  
> **Last Updated:** 2026-07-10  
> **Status:** Draft — Pending Approval  

---

## 1. Documentation Plan

### 1.1 Repository Documentation

| Document | Location | Purpose |
|----------|----------|---------|
| `README.md` | Root | Project overview, setup instructions, tech stack, screenshots |
| `SRS.md` | Root | Product vision, personas, features |
| `ARCHITECTURE.md` | Root | System architecture, data flows |
| `FOLDER_STRUCTURE.md` | Root | Full folder tree, routing |
| `DATABASE.md` | Root | Schema design, indexes, relationships |
| `AUTH.md` | Root | Authentication & authorization flows |
| `API.md` | Root | REST API endpoint specifications |
| `DESIGN_SYSTEM.md` | Root | Colors, typography, component tokens |
| `SCREENS.md` | Root | Screen specifications |
| `STRATEGIES.md` | Root | Engineering strategies |
| `CONTRIBUTING.md` | Root | Contribution guidelines, PR process |
| `CHANGELOG.md` | Root | Version history (auto-generated) |
| `LICENSE` | Root | MIT License |

### 1.2 Code Documentation

| Type | Standard |
|------|----------|
| **Functions** | JSDoc for all exported functions with `@param`, `@returns`, `@throws` |
| **Components** | Props interface with JSDoc comments for each prop |
| **API Routes** | Inline comment block: method, auth, body, response |
| **Models** | Field-level comments for non-obvious fields |
| **Services** | Method-level JSDoc with business logic context |
| **Types** | TSDoc for complex types and enums |
| **Config** | Inline comments explaining each setting |

### 1.3 README Structure

```markdown
# HireTrack

> Modern Applicant Tracking System for fast-growing teams

![Dashboard Screenshot](screenshot.png)

## Features
- Job pipeline management with drag-and-drop Kanban
- Candidate tracking with resume management
- Interview scheduling with calendar view
- Real-time analytics dashboard
- Role-based access control
- Dark mode support

## Tech Stack
### Frontend
Next.js 15 · React 19 · TypeScript · Tailwind CSS · Shadcn UI · Framer Motion

### Backend
Node.js · Express.js · MongoDB · Redis · JWT · Cloudinary

## Getting Started

### Prerequisites
- Node.js 20+
- MongoDB Atlas account
- Redis instance
- Cloudinary account

### Installation
# Clone repo
# Install dependencies
# Setup environment variables
# Run development servers

## Project Structure
(brief tree)

## API Documentation
Link to API.md

## Contributing
Link to CONTRIBUTING.md

## License
MIT
```

---

## 2. Git Strategy

### 2.1 Branch Strategy

```
main (production)
  │
  ├── develop (integration branch)
  │     │
  │     ├── feature/auth-login
  │     ├── feature/jobs-crud
  │     ├── feature/candidate-pipeline
  │     ├── feature/interview-scheduling
  │     └── feature/analytics-dashboard
  │
  ├── fix/login-validation-error
  ├── fix/pipeline-drag-drop
  │
  └── hotfix/security-patch
```

| Branch | Purpose | Merges Into | Protection |
|--------|---------|-------------|------------|
| `main` | Production-ready code | — | Protected: require PR, CI pass |
| `develop` | Integration branch | `main` (via release PR) | Protected: require PR |
| `feature/*` | New features | `develop` | None |
| `fix/*` | Bug fixes | `develop` | None |
| `hotfix/*` | Urgent production fixes | `main` + `develop` | None |

### 2.2 Branch Naming Convention

```
<type>/<short-description>

Examples:
  feature/auth-login
  feature/jobs-crud
  feature/candidate-pipeline
  feature/dashboard-analytics
  fix/token-refresh-loop
  fix/pipeline-drag-drop
  hotfix/xss-vulnerability
  chore/update-dependencies
  docs/api-documentation
```

### 2.3 Workflow

```
1. Create branch from develop
   git checkout develop
   git pull origin develop
   git checkout -b feature/jobs-crud

2. Work on feature (commit often)
   git add .
   git commit -m "feat(jobs): add job creation form"

3. Push and create PR
   git push origin feature/jobs-crud
   → Open PR: feature/jobs-crud → develop

4. Code review + CI checks

5. Merge PR (squash merge)

6. When ready for release:
   → Open PR: develop → main
   → Tag release: v1.0.0
```

---

## 3. Conventional Commit Strategy

### 3.1 Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### 3.2 Types

| Type | Description | Example |
|------|-------------|---------|
| `feat` | New feature | `feat(jobs): add job creation endpoint` |
| `fix` | Bug fix | `fix(auth): resolve token refresh loop` |
| `docs` | Documentation | `docs(api): update jobs endpoint docs` |
| `style` | Formatting (no logic change) | `style(ui): fix button alignment` |
| `refactor` | Code restructure (no behavior change) | `refactor(services): extract cache logic` |
| `perf` | Performance improvement | `perf(queries): add compound index for jobs` |
| `test` | Adding/updating tests | `test(auth): add login integration tests` |
| `chore` | Maintenance, deps, config | `chore(deps): update mongoose to v8` |
| `ci` | CI/CD changes | `ci: add build check to PR workflow` |
| `build` | Build system changes | `build(docker): optimize Dockerfile layers` |

### 3.3 Scopes

| Scope | Area |
|-------|------|
| `auth` | Authentication/authorization |
| `jobs` | Job management |
| `candidates` | Candidate management |
| `interviews` | Interview scheduling |
| `analytics` | Analytics/dashboard |
| `notifications` | Notification system |
| `ui` | UI components |
| `api` | API layer |
| `db` | Database/models |
| `config` | Configuration |
| `deps` | Dependencies |

### 3.4 Rules

1. Subject line: imperative mood, lowercase, no period, max 72 chars
2. Body: explain WHAT and WHY (not HOW), wrap at 80 chars
3. Footer: reference issues (`Closes #123`)
4. Breaking changes: `BREAKING CHANGE:` in footer or `!` after type (`feat!:`)

### 3.5 Examples

```
feat(jobs): add configurable pipeline stages

Allow recruiters to customize hiring pipeline stages per job.
Stages can be reordered via drag-and-drop and assigned colors.

Closes #42

---

fix(auth): prevent refresh token reuse after rotation

If a revoked refresh token is reused, all tokens for that user
are now invalidated as a security measure against token theft.

BREAKING CHANGE: users will be logged out of all sessions on
token reuse detection

---

chore(deps): upgrade next.js to 15.1.0

Includes React 19 RC2 support and improved App Router caching.
```

---

## 4. Environment Variables

### 4.1 Backend (`server/.env`)

```bash
# ============================================
# Server
# ============================================
NODE_ENV=development                    # development | staging | production
PORT=5000                               # Server port
API_VERSION=v1                          # API version prefix

# ============================================
# Database
# ============================================
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/hiretrack?retryWrites=true&w=majority
DB_NAME=hiretrack

# ============================================
# Redis
# ============================================
REDIS_URL=redis://localhost:6379        # Redis connection URL
REDIS_PASSWORD=                         # Redis password (if required)

# ============================================
# Authentication
# ============================================
JWT_ACCESS_SECRET=<64-char-random>      # openssl rand -hex 32
JWT_ACCESS_EXPIRY=15m                   # Access token lifetime
JWT_REFRESH_SECRET=<64-char-random>     # openssl rand -hex 32
JWT_REFRESH_EXPIRY=7d                   # Refresh token lifetime

# ============================================
# Cloudinary
# ============================================
CLOUDINARY_CLOUD_NAME=                  # Cloudinary cloud name
CLOUDINARY_API_KEY=                     # Cloudinary API key
CLOUDINARY_API_SECRET=                  # Cloudinary API secret

# ============================================
# Email (Nodemailer)
# ============================================
SMTP_HOST=smtp.gmail.com               # SMTP server host
SMTP_PORT=587                          # SMTP port
SMTP_USER=                             # Email address
SMTP_PASS=                             # App password (not account password)
EMAIL_FROM=HireTrack <noreply@hiretrack.app>

# ============================================
# Client
# ============================================
CLIENT_URL=http://localhost:3000        # Frontend URL (for CORS + email links)

# ============================================
# Logging
# ============================================
LOG_LEVEL=debug                        # error | warn | info | debug

# ============================================
# Rate Limiting
# ============================================
RATE_LIMIT_WINDOW_MS=900000            # 15 minutes in ms
RATE_LIMIT_MAX=100                     # Max requests per window
```

### 4.2 Frontend (`client/.env.local`)

```bash
# ============================================
# API
# ============================================
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1    # Backend API base URL
NEXT_PUBLIC_APP_NAME=HireTrack                      # Display name
NEXT_PUBLIC_APP_URL=http://localhost:3000            # Self URL (for OG tags)

# ============================================
# Analytics (future)
# ============================================
# NEXT_PUBLIC_GA_ID=                    # Google Analytics ID
# NEXT_PUBLIC_SENTRY_DSN=              # Sentry error tracking
```

### 4.3 Environment Matrix

| Variable | Development | Staging | Production |
|----------|-------------|---------|------------|
| `NODE_ENV` | `development` | `staging` | `production` |
| `MONGODB_URI` | Atlas dev cluster | Atlas staging DB | Atlas prod DB |
| `REDIS_URL` | `localhost:6379` | Render Redis | Render Redis |
| `CLIENT_URL` | `localhost:3000` | Vercel preview URL | `https://hiretrack.app` |
| `LOG_LEVEL` | `debug` | `info` | `warn` |
| `JWT_ACCESS_EXPIRY` | `15m` | `15m` | `15m` |
| `RATE_LIMIT_MAX` | `1000` (relaxed) | `100` | `100` |

### 4.4 Security Rules

1. **Never commit `.env` files** — `.gitignore` includes all `.env*` except `.env.example`
2. **Use `.env.example`** — Template with placeholder values, committed to repo
3. **Rotate secrets** — JWT secrets and API keys rotated quarterly
4. **Different secrets per environment** — Dev, staging, and prod use separate keys
5. **Render/Vercel env vars** — Set via dashboard, never in code or CI scripts

---

## 5. `.gitignore`

```gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Build
.next/
dist/
build/
out/

# Environment
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
.env.staging

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Testing
coverage/
.nyc_output/

# Logs
*.log
npm-debug.log*

# Misc
*.tsbuildinfo
```

---

## 6. CI/CD Workflow (GitHub Actions)

### 6.1 CI — Pull Request Checks

```yaml
# .github/workflows/ci.yml
name: CI
on:
  pull_request:
    branches: [develop, main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }

      # Client
      - name: Install client deps
        run: cd client && npm ci
      - name: Lint client
        run: cd client && npm run lint
      - name: Type check client
        run: cd client && npx tsc --noEmit
      - name: Build client
        run: cd client && npm run build

      # Server
      - name: Install server deps
        run: cd server && npm ci
      - name: Lint server
        run: cd server && npm run lint
      - name: Type check server
        run: cd server && npx tsc --noEmit
      - name: Test server
        run: cd server && npm test
```

---

*End of Step 9 — Documentation, Git Strategy & Environment Variables*

---

## 🎯 Architecture Document Complete

All 9 steps are now finished. Here is a summary of all documents:

| # | Document | Content |
|---|----------|---------|
| 1 | `SRS.md` | Product vision, personas, features, MVP scope |
| 2 | `ARCHITECTURE.md` | System architecture, data flows, deployment |
| 3 | `FOLDER_STRUCTURE.md` | Full project tree, routing, role access |
| 4 | `DATABASE.md` | 10 collections, 45 indexes, ER diagram |
| 5 | `AUTH.md` | Auth flows, RBAC, token strategy |
| 6 | `API.md` | All REST endpoints, status codes |
| 7 | `DESIGN_SYSTEM.md` | Colors, typography, component tokens |
| 8 | `SCREENS.md` | 23 screen specifications |
| 9 | `STRATEGIES.md` | 12 engineering strategies |
| 10 | `GIT_AND_DOCS.md` | Git strategy, env vars, CI/CD |
