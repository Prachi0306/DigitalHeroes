# HireTrack — Software Requirement Specification

> **Document Version:** 1.0  
> **Last Updated:** 2026-07-10  
> **Authors:** Engineering & Product Team  
> **Status:** Draft — Pending Stakeholder Approval  

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Target Users](#2-target-users)
3. [User Personas](#3-user-personas)
4. [Core Problems](#4-core-problems)
5. [Feature Breakdown](#5-feature-breakdown)
   - 5.1 MVP Features
   - 5.2 Advanced Features
   - 5.3 Future Scope
6. [Success Metrics](#6-success-metrics)
7. [Assumptions & Constraints](#7-assumptions--constraints)

---

## 1. Product Vision

### 1.1 Mission Statement

**HireTrack** is a modern, developer-first Applicant Tracking System (ATS) built to eliminate the chaos from hiring workflows. It gives recruiting teams a single source of truth — from opening a requisition to extending an offer — with real-time collaboration, actionable analytics, and a candidate experience that reflects their employer brand.

### 1.2 Vision

To become the default hiring platform for fast-growing startups and mid-market companies (50–2,000 employees) by replacing fragmented spreadsheets, email threads, and legacy ATS platforms with a unified, intelligent hiring OS.

### 1.3 Value Proposition

| Dimension | Legacy ATS (Greenhouse, Lever) | HireTrack |
|-----------|-------------------------------|-----------|
| **Setup Time** | 2–4 weeks | Under 30 minutes |
| **Learning Curve** | Training required | Self-serve, intuitive |
| **Collaboration** | Email-based | Real-time, in-platform |
| **Analytics** | Retroactive reports | Live dashboards |
| **Pricing Model** | Per-seat, enterprise-only | Tiered, startup-friendly |
| **Customization** | Rigid pipelines | Fully configurable stages |
| **Candidate Experience** | Generic portals | Branded, fast, mobile-first |

### 1.4 Product Principles

1. **Speed over ceremony** — Every interaction should complete in under 200ms perceived latency.
2. **Opinionated defaults, flexible overrides** — Ship smart defaults (pipeline stages, email templates, scorecard criteria) but let teams customize everything.
3. **Collaboration is not optional** — Hiring is a team sport. Every feature should assume multiple concurrent users.
4. **Data-driven decisions** — Surface insights proactively; don't wait for users to build reports.
5. **Accessibility first** — WCAG 2.1 AA compliance is a baseline, not a stretch goal.

---

## 2. Target Users

### 2.1 Primary Market

| Segment | Company Size | Hiring Volume | Pain Level |
|---------|-------------|---------------|------------|
| **Seed–Series B Startups** | 10–200 employees | 5–50 hires/quarter | High — using spreadsheets or outgrown free tools |
| **Mid-Market Tech Companies** | 200–2,000 employees | 50–200 hires/quarter | Medium — locked into expensive legacy ATS |
| **Recruiting Agencies** | 5–100 recruiters | 100+ placements/quarter | High — need multi-client pipeline management |

### 2.2 Secondary Market

| Segment | Use Case |
|---------|----------|
| **Remote-first companies** | Distributed hiring across time zones |
| **University career services** | Campus recruitment management |
| **Internal mobility teams** | Internal transfer and promotion tracking |

### 2.3 User Roles

| Role | Platform Access Level | Key Workflows |
|------|----------------------|---------------|
| **Super Admin** | Full system configuration, billing, team management | Company setup, role management, audit logs |
| **Admin** | Full recruiting access + settings | Job creation, pipeline config, analytics |
| **Recruiter** | Job management, candidate management, scheduling | Source candidates, screen, schedule, collaborate |
| **Hiring Manager** | View assigned jobs, review candidates, leave feedback | Scorecard reviews, interview feedback, approvals |
| **Interviewer** | View scheduled interviews, submit feedback | Interview prep, scorecard submission |
| **Viewer** | Read-only access to assigned jobs | Pipeline visibility, reporting |

---

## 3. User Personas

### 3.1 Persona: Sarah Chen — Head of Talent

| Attribute | Detail |
|-----------|--------|
| **Age** | 32 |
| **Company** | Series A SaaS startup, 85 employees |
| **Team** | 2 recruiters, 12 hiring managers |
| **Current Tools** | Google Sheets, Calendly, Gmail, Notion |
| **Hiring Volume** | 15–25 roles open simultaneously |
| **Primary Frustration** | "I spend 3 hours every Monday compiling hiring updates from spreadsheets for the leadership meeting." |
| **Goals** | Real-time dashboards, automated pipeline tracking, one platform for everything |
| **Technical Comfort** | Power user — comfortable with integrations and automation |

**Jobs to Be Done:**
- See pipeline health across all open roles at a glance
- Identify bottlenecks (which stage has the most drop-offs?)
- Report time-to-fill and cost-per-hire to the CEO weekly
- Ensure consistent interview processes across all teams

### 3.2 Persona: Marcus Rivera — Senior Recruiter

| Attribute | Detail |
|-----------|--------|
| **Age** | 28 |
| **Company** | Mid-market fintech, 450 employees |
| **Roles Managed** | 8–12 concurrent requisitions |
| **Current Tools** | Greenhouse (frustrated with UX), LinkedIn Recruiter |
| **Primary Frustration** | "Moving candidates between stages takes too many clicks. I live in my ATS 8 hours a day — it should be faster." |
| **Goals** | Keyboard shortcuts, bulk actions, fast candidate search, email templates |
| **Technical Comfort** | Moderate — prefers intuitive UI over configuration |

**Jobs to Be Done:**
- Move 30+ candidates through pipeline stages daily
- Schedule interviews without leaving the platform
- Send personalized rejection/progression emails at scale
- Track source effectiveness (which channels produce the best hires?)

### 3.3 Persona: David Park — Engineering Manager (Hiring Manager)

| Attribute | Detail |
|-----------|--------|
| **Age** | 36 |
| **Company** | Series B dev tools company, 200 employees |
| **Hiring Involvement** | Reviews candidates for 2–3 roles on his team |
| **Current Tools** | Slack messages from recruiters, email chains |
| **Primary Frustration** | "I get pinged on Slack to review candidates but have no idea where to find their resume or what stage they're in." |
| **Goals** | Clear candidate profiles, structured scorecards, minimal time investment |
| **Technical Comfort** | High — engineer, values clean UX |

**Jobs to Be Done:**
- Review candidate profiles with resume, portfolio, and interview notes in one place
- Submit structured feedback via scorecards
- See who's interviewing this week without asking the recruiter
- Approve/reject candidates with one click

### 3.4 Persona: Priya Sharma — Contract Recruiter (Agency)

| Attribute | Detail |
|-----------|--------|
| **Age** | 30 |
| **Company** | Independent recruiting agency, 8 recruiters |
| **Clients** | 5 active client companies |
| **Current Tools** | Airtable, WhatsApp, email |
| **Primary Frustration** | "I manage candidates across 5 different companies and have no unified view." |
| **Goals** | Multi-company workspace, candidate ownership tracking, placement analytics |
| **Technical Comfort** | Low-to-moderate — needs a simple, guided experience |

**Jobs to Be Done:**
- Manage separate pipelines per client company
- Track which candidates were submitted to which client
- Report placement rates and time-to-fill per client
- Avoid duplicate candidate submissions

---

## 4. Core Problems

### 4.1 Problem Matrix

| # | Problem | Affected Persona | Severity | Current Workaround |
|---|---------|------------------|----------|-------------------|
| P1 | **Fragmented hiring data** — Candidate info scattered across email, spreadsheets, Slack, and calendars | All | Critical | Manual data entry across tools |
| P2 | **No pipeline visibility** — Leadership cannot see hiring progress without manual reports | Sarah, David | High | Weekly spreadsheet compilations |
| P3 | **Slow candidate processing** — Too many clicks to move candidates between stages | Marcus | High | Batch processing in spreadsheets |
| P4 | **Scheduling hell** — Coordinating interviews across multiple calendars is manual and error-prone | Marcus, David | High | Calendly + email back-and-forth |
| P5 | **Inconsistent evaluation** — No standardized scorecards leads to biased hiring decisions | David | Medium | Unstructured Slack feedback |
| P6 | **Poor candidate experience** — Candidates receive no status updates and face slow response times | All | Medium | Manual email follow-ups |
| P7 | **No recruitment analytics** — Teams cannot measure time-to-fill, source ROI, or funnel conversion rates | Sarah | High | Manual calculations in spreadsheets |
| P8 | **Collaboration gaps** — Hiring managers and recruiters lack a shared workspace | Marcus, David | Medium | Slack channels per role |
| P9 | **Compliance risk** — No audit trail for hiring decisions, creating legal exposure | Sarah | Medium | None |
| P10 | **Multi-client chaos** — Agency recruiters have no way to manage cross-company pipelines | Priya | High | Separate spreadsheets per client |

### 4.2 Problem Prioritization (ICE Framework)

| Problem | Impact (1-10) | Confidence (1-10) | Ease (1-10) | ICE Score | MVP? |
|---------|:---:|:---:|:---:|:---:|:---:|
| P1 — Fragmented data | 10 | 9 | 7 | 630 | ✅ |
| P2 — No pipeline visibility | 9 | 9 | 8 | 648 | ✅ |
| P3 — Slow processing | 8 | 8 | 8 | 512 | ✅ |
| P7 — No analytics | 8 | 8 | 6 | 384 | ✅ |
| P5 — Inconsistent evaluation | 7 | 7 | 7 | 343 | ✅ |
| P4 — Scheduling hell | 9 | 8 | 4 | 288 | ✅ (basic) |
| P8 — Collaboration gaps | 7 | 7 | 6 | 294 | ✅ |
| P6 — Poor candidate experience | 7 | 6 | 5 | 210 | Partial |
| P9 — Compliance risk | 6 | 7 | 6 | 252 | ✅ (audit logs) |
| P10 — Multi-client chaos | 8 | 6 | 3 | 144 | ❌ (v2) |

---

## 5. Feature Breakdown

### 5.1 MVP Features (v1.0)

#### F1: Authentication & Authorization
| Feature | Description | Priority |
|---------|-------------|----------|
| F1.1 | Email/password registration with email verification | P0 |
| F1.2 | Login with JWT access tokens + refresh tokens | P0 |
| F1.3 | Forgot password / reset password flow | P0 |
| F1.4 | Role-based access control (RBAC) — 6 roles | P0 |
| F1.5 | Session management with Redis | P0 |
| F1.6 | Secure logout (invalidate refresh tokens) | P0 |

#### F2: Company & Team Management
| Feature | Description | Priority |
|---------|-------------|----------|
| F2.1 | Company profile setup (name, logo, domain, industry) | P0 |
| F2.2 | Invite team members via email | P0 |
| F2.3 | Role assignment and modification | P0 |
| F2.4 | Team member directory with search/filter | P1 |
| F2.5 | Deactivate/reactivate team members | P1 |

#### F3: Job Management
| Feature | Description | Priority |
|---------|-------------|----------|
| F3.1 | Create job with title, department, location, type, salary range, description | P0 |
| F3.2 | Configurable hiring pipeline stages per job (e.g., Applied → Screening → Interview → Offer → Hired) | P0 |
| F3.3 | Job status management (Draft, Open, Paused, Closed, Archived) | P0 |
| F3.4 | Job listing with filters (status, department, location, date) | P0 |
| F3.5 | Assign hiring managers and recruiters to jobs | P0 |
| F3.6 | Duplicate job (clone configuration) | P1 |
| F3.7 | Job description rich text editor | P1 |

#### F4: Candidate & Application Management
| Feature | Description | Priority |
|---------|-------------|----------|
| F4.1 | Add candidates manually (name, email, phone, resume, source) | P0 |
| F4.2 | Candidate profile page (consolidated view of all applications, notes, files, timeline) | P0 |
| F4.3 | Resume upload and storage (Cloudinary) | P0 |
| F4.4 | Move candidates between pipeline stages (drag-and-drop Kanban + list view) | P0 |
| F4.5 | Candidate search with full-text search and filters (stage, source, rating, date) | P0 |
| F4.6 | Reject/archive candidates with customizable rejection reasons | P0 |
| F4.7 | Candidate source tracking (LinkedIn, Referral, Job Board, Direct, etc.) | P0 |
| F4.8 | Bulk actions (move stage, reject, tag, export) | P1 |
| F4.9 | Candidate tags and custom labels | P1 |
| F4.10 | Duplicate candidate detection (email-based) | P1 |

#### F5: Interview Management
| Feature | Description | Priority |
|---------|-------------|----------|
| F5.1 | Schedule interviews with date, time, duration, interviewers | P0 |
| F5.2 | Interview calendar view (day, week, month) | P0 |
| F5.3 | Structured scorecards with configurable criteria | P0 |
| F5.4 | Interview feedback submission by interviewers | P0 |
| F5.5 | Interview status tracking (Scheduled, Completed, Cancelled, No-Show) | P0 |
| F5.6 | Interview reminders (in-app notifications) | P1 |
| F5.7 | Multi-round interview support | P1 |

#### F6: Collaboration
| Feature | Description | Priority |
|---------|-------------|----------|
| F6.1 | Internal notes on candidates (visible only to team) | P0 |
| F6.2 | @mention team members in notes | P1 |
| F6.3 | Activity timeline per candidate (all actions logged) | P0 |
| F6.4 | Real-time notification system (in-app) | P0 |

#### F7: Analytics Dashboard
| Feature | Description | Priority |
|---------|-------------|----------|
| F7.1 | Overview dashboard (open jobs, active candidates, interviews today, offers pending) | P0 |
| F7.2 | Pipeline funnel visualization (conversion rates per stage) | P0 |
| F7.3 | Time-to-fill analytics per job/department | P0 |
| F7.4 | Source effectiveness report (applications and hires per source) | P0 |
| F7.5 | Recruiter performance metrics | P1 |
| F7.6 | Department-level hiring trends | P1 |

#### F8: Settings & Configuration
| Feature | Description | Priority |
|---------|-------------|----------|
| F8.1 | User profile management (name, avatar, password change) | P0 |
| F8.2 | Company settings (branding, default pipeline stages) | P0 |
| F8.3 | Notification preferences | P1 |
| F8.4 | Audit log viewer (who did what, when) | P0 |

---

### 5.2 Advanced Features (v2.0)

| Feature | Description | Complexity |
|---------|-------------|------------|
| A1 | **Email integration** — Send/receive emails to candidates directly from platform (Nodemailer) | High |
| A2 | **Calendar sync** — Google Calendar / Outlook integration for interview scheduling | High |
| A3 | **Custom application forms** — Configurable questions per job | Medium |
| A4 | **Offer management** — Generate, send, and track offer letters | Medium |
| A5 | **Candidate portal** — Self-service portal for candidates to check application status | Medium |
| A6 | **Advanced permissions** — Field-level access control, custom roles | High |
| A7 | **Report builder** — Custom report creation with export (PDF, CSV) | Medium |
| A8 | **Bulk import** — CSV/Excel candidate import with mapping | Medium |
| A9 | **Multi-company workspaces** — Agency mode with separate client pipelines | High |
| A10 | **Webhooks** — Event-driven notifications to external systems | Medium |
| A11 | **Two-factor authentication (2FA)** — TOTP-based MFA | Medium |
| A12 | **Email templates** — Customizable templates for candidate communication | Low |

---

### 5.3 Future Scope (v3.0+)

| Feature | Description | Horizon |
|---------|-------------|---------|
| FS1 | **AI resume parsing** — Extract structured data from resumes automatically | 6 months |
| FS2 | **AI candidate matching** — Score candidates against job requirements | 6 months |
| FS3 | **Video interview** — Built-in video interviewing with recording | 9 months |
| FS4 | **Career page builder** — Drag-and-drop branded career site | 9 months |
| FS5 | **Slack/Teams integration** — Pipeline notifications and actions in chat | 6 months |
| FS6 | **Job board syndication** — One-click posting to LinkedIn, Indeed, Glassdoor | 9 months |
| FS7 | **Referral management** — Employee referral tracking with incentive programs | 6 months |
| FS8 | **Mobile app** — React Native companion app for on-the-go hiring | 12 months |
| FS9 | **SSO** — SAML/OIDC enterprise single sign-on | 9 months |
| FS10 | **Internationalization (i18n)** — Multi-language support | 12 months |
| FS11 | **GDPR compliance toolkit** — Data retention policies, right-to-erasure workflows | 6 months |
| FS12 | **Predictive analytics** — ML-based time-to-fill predictions and pipeline health scoring | 12 months |

---

## 6. Success Metrics

### 6.1 Product KPIs

| Metric | Target (6 months post-launch) | Measurement |
|--------|-------------------------------|-------------|
| **Monthly Active Users (MAU)** | 500+ | Auth events |
| **Companies Onboarded** | 50+ | Company registrations |
| **Jobs Created** | 1,000+ | Job document count |
| **Candidates Processed** | 10,000+ | Application document count |
| **Average Session Duration** | > 8 minutes | Analytics tracking |
| **Feature Adoption Rate** | > 60% of features used per company | Feature usage tracking |
| **NPS Score** | > 50 | In-app surveys |

### 6.2 Engineering KPIs

| Metric | Target | Measurement |
|--------|--------|-------------|
| **API Response Time (p95)** | < 200ms | Server monitoring |
| **Page Load Time (LCP)** | < 1.5s | Web Vitals |
| **Uptime** | 99.9% | Status monitoring |
| **Test Coverage** | > 80% | CI/CD pipeline |
| **Lighthouse Score** | > 90 (all categories) | Automated audits |
| **Zero Critical Bugs** | 0 P0 bugs in production | Bug tracking |

---

## 7. Assumptions & Constraints

### 7.1 Assumptions

1. Users have modern browsers (Chrome 90+, Firefox 90+, Safari 14+, Edge 90+).
2. Users have reliable internet connectivity (minimum 1 Mbps).
3. Initial user base is English-speaking.
4. Companies have fewer than 2,000 employees (no enterprise-grade compliance needs in v1).
5. Interview scheduling does not require external calendar integration in v1 (internal calendar only).
6. File uploads are limited to resumes and documents (no video in v1).

### 7.2 Constraints

| Constraint | Impact | Mitigation |
|------------|--------|------------|
| **Free-tier hosting (Render)** | Cold starts, limited compute | Aggressive caching, code splitting |
| **MongoDB Atlas free tier** | 512MB storage limit | Efficient schema design, pagination |
| **No WebSocket budget in v1** | No real-time updates | Polling-based notifications, TanStack Query refetch |
| **Single developer timeline** | Limited scope per milestone | Strict MVP scoping, component reuse |
| **Cloudinary free tier** | 25GB bandwidth/month | Image optimization, lazy loading |

### 7.3 Out of Scope (v1)

- Social login (Google, GitHub)
- Native mobile application
- Real-time multiplayer editing (e.g., collaborative note editing)
- Payment/billing system
- White-labeling
- Third-party ATS data migration

---

*End of Step 1 — Software Requirement Specification*

*Next: Step 2 — System Architecture, Folder Structure, Routing Structure*
