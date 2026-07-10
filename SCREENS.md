# HireTrack — Screen Specifications

> **Document Version:** 1.0  
> **Last Updated:** 2026-07-10  
> **Status:** Draft — Pending Approval  

---

## 1. Landing Page (`/`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Convert visitors into signups. Communicate value proposition. |
| **Layout** | Marketing layout (navbar + footer) |
| **Auth** | Public |

**Components:**
- `Navbar` — Logo, nav links (Features, Pricing, About), [Login] ghost button, [Get Started] primary button
- `HeroSection` — Headline, subtext, CTA button, hero illustration/screenshot
- `LogoCloud` — "Trusted by" — 5-6 company logos (muted grayscale)
- `FeaturesGrid` — 6 feature cards (icon + title + description) in 3×2 grid
- `HowItWorks` — 3-step numbered flow (Create Job → Track Candidates → Hire)
- `TestimonialsCarousel` — 3 testimonial cards with avatar, name, title, quote
- `CTABanner` — Full-width gradient banner with "Start hiring smarter" + signup button
- `Footer` — Logo, links (Product, Company, Legal), social icons, © copyright

**Interactions:** Scroll-triggered fade-in animations (Framer Motion), smooth anchor scroll.

**Responsive:** Mobile — stacked columns, hamburger nav, single-column features. Tablet — 2-column features.

---

## 2. Login (`/login`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Authenticate existing users |
| **Layout** | Auth layout (centered card, split-screen on desktop) |

**Components:**
- `LoginForm` — Email input, password input (with show/hide toggle), [Log In] primary button
- "Forgot password?" link below password field
- "Don't have an account? [Sign up]" link
- Brand logo above form
- Left panel (desktop only) — gradient background with tagline + illustration

**Interactions:** Form validation (real-time on blur, Zod). Loading spinner on submit. Error toast on failure. Redirect to `/dashboard` on success (or saved redirect URL).

**Responsive:** Mobile — full-width card, no split panel. Tablet+ — split screen.

---

## 3. Register (`/register`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Create new account + company |
| **Layout** | Auth layout |

**Components:**
- `RegisterForm` — First name, last name, email, password (with strength indicator), company name, [Create Account] button
- Password requirements checklist (✓/✗ for each rule)
- "Already have an account? [Log in]" link
- Terms & privacy checkbox

**Interactions:** Real-time password strength meter (weak/fair/strong). Inline validation. Success → redirect to "Check your email" screen.

**Responsive:** Same as Login.

---

## 4. Forgot Password (`/forgot-password`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Request password reset email |
| **Layout** | Auth layout |

**Components:**
- `ForgotPasswordForm` — Email input, [Send Reset Link] button
- "Back to login" link
- Success state: email icon + "Check your inbox" message

**Interactions:** Always show success (prevent email enumeration).

---

## 5. Reset Password (`/reset-password`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Set new password via token |
| **Layout** | Auth layout |

**Components:**
- `ResetPasswordForm` — New password, confirm password, [Reset Password] button
- Password strength indicator
- Invalid/expired token → error state with [Request New Link] button

---

## 6. Verify Email (`/verify-email`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Confirm email verification via token |
| **Layout** | Auth layout |

**Components:**
- Loading state → spinner + "Verifying your email..."
- Success state → checkmark animation + "Email verified!" + [Continue to Login] button
- Error state → "Invalid or expired link" + [Resend Verification] button

---

## 7. Dashboard (`/dashboard`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Overview of hiring activity. First screen after login. |
| **Layout** | Dashboard layout (sidebar + topbar) |

**Components:**
- `PageHeader` — "Dashboard" title, greeting ("Good morning, Sarah")
- `StatCards` (4 cards in row) — Open Jobs, Active Candidates, Interviews Today, Offers Pending (each with icon, value, % change from last period)
- `RecentApplicationsTable` — Last 5 applications (candidate name, job title, stage, applied date, actions)
- `UpcomingInterviews` — Next 3 interviews (candidate, job, time, interviewer avatars)
- `PipelineSummary` — Mini funnel chart showing conversion rates
- `QuickActions` — [Create Job], [Add Candidate], [Schedule Interview] shortcut buttons

**Interactions:** Stat cards animate count-up on mount. Cards clickable → navigate to detail. Auto-refresh every 60s via TanStack Query.

**Responsive:** Mobile — stat cards 2×2 grid, tables become card lists. Tablet — 2 columns.

---

## 8. Jobs (`/jobs`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | View and manage all job openings |
| **Layout** | Dashboard layout |

**Components:**
- `PageHeader` — "Jobs" title, [+ Create Job] primary button
- `JobFilters` — Status tabs (All, Open, Draft, Paused, Closed), department dropdown, location type dropdown, search input
- `JobsTable` / `JobsCardGrid` — Toggle between table and card view
  - Table columns: Title, Department, Location, Status (badge), Applicants count, Created date, Actions (⋯ menu)
  - Card: Job title, department badge, location, status pill, applicant count, posted date
- `DataTablePagination` — Page numbers, items per page selector

**Interactions:** Click row → navigate to `/jobs/[jobId]`. Status filter changes update URL params. Bulk select with checkboxes. ⋯ menu → Edit, Duplicate, Pause, Close, Archive.

**Responsive:** Mobile — card view only, filters in sheet drawer. Table hidden below `md`.

---

## 9. Create/Edit Job (`/jobs/new`, `/jobs/[jobId]/edit`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Create or edit a job opening |
| **Layout** | Dashboard layout |

**Components:**
- `PageHeader` — "Create Job" or "Edit Job" + [Cancel] ghost + [Save Draft] secondary + [Publish] primary
- `JobForm` (multi-section form) —
  - **Basic Info:** Title, department (select), employment type (select), experience level (select)
  - **Location:** Type (onsite/remote/hybrid), city, state, country (conditional)
  - **Compensation:** Salary range (min/max), currency, period
  - **Description:** Rich text editor (job description)
  - **Requirements:** Dynamic list (add/remove items)
  - **Skills:** Tag input (autocomplete)
  - **Pipeline:** Stage configurator (drag-to-reorder, add/remove stages, color picker)
  - **Team:** Hiring manager (user select), recruiters (multi-user select)
  - **Settings:** Openings count, deadline date picker

**Interactions:** Auto-save draft every 30s. Unsaved changes warning on navigate away. Form sections as accordion or stepper.

**Responsive:** Single-column form on mobile. Two-column layout on desktop (form left, preview right).

---

## 10. Job Detail + Pipeline (`/jobs/[jobId]`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | View job details and manage candidate pipeline |
| **Layout** | Dashboard layout |

**Components:**
- `PageHeader` — Job title, status badge, [Edit] secondary, [⋯] actions menu
- `JobInfoBar` — Department, location, type, salary, posted date, deadline, applicant count
- `Tabs` — Pipeline | Candidates List | Details | Activity
- **Pipeline Tab:**
  - `PipelineBoard` — Kanban board with columns per stage
  - `PipelineColumn` — Stage name, count badge, candidate cards
  - `CandidateCard` — Avatar, name, rating stars, source badge, applied date
- **Candidates List Tab:** Table view of all candidates in this job
- **Details Tab:** Full job description, requirements, skills
- **Activity Tab:** Timeline of all actions on this job

**Interactions:** Drag-and-drop candidates between stages. Click candidate card → slide-over panel with quick profile. Bulk actions toolbar on multi-select.

**Responsive:** Mobile — pipeline as horizontal scroll or stacked list view. Tabs as scrollable horizontal tabs.

---

## 11. Candidates (`/candidates`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Company-wide talent pool |
| **Layout** | Dashboard layout |

**Components:**
- `PageHeader` — "Candidates" title, [+ Add Candidate] button
- `CandidateFilters` — Search (name/email/skills), source dropdown, tags multi-select, experience range
- `CandidatesTable` — Name (avatar + name), email, current stage (if active app), source, skills (tags), rating, added date, actions
- `DataTablePagination`

**Interactions:** Click row → `/candidates/[candidateId]`. Bulk select → move, tag, export. Quick-add from table header.

**Responsive:** Mobile — card list with key info. Filters in bottom sheet.

---

## 12. Candidate Profile (`/candidates/[candidateId]`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Complete candidate view — all applications, notes, files, timeline |
| **Layout** | Dashboard layout |

**Components:**
- `CandidateHeader` — Avatar, name, headline, email, phone, social links, source badge, [Edit] button
- `Tabs` — Overview | Applications | Interviews | Files | Notes | Activity
- **Overview Tab:**
  - Skills tags, experience, current company/title, location
  - Resume viewer (PDF embed or download link)
  - Quick stats (total applications, interviews, avg rating)
- **Applications Tab:** List of all applications with job title, current stage, status, applied date, stage history
- **Interviews Tab:** All interviews with date, type, status, interviewers, feedback
- **Files Tab:** Uploaded documents (resume, cover letter, etc.) with download/delete
- **Notes Tab:** Internal notes with @mentions, chronological
- **Activity Tab:** Full timeline of all actions related to this candidate

**Interactions:** Inline note creation. File upload drag-and-drop. Click application → expand stage history.

**Responsive:** Mobile — tabs as scrollable chips, sections stacked.

---

## 13. Interviews (`/interviews`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | View all scheduled interviews |
| **Layout** | Dashboard layout |

**Components:**
- `PageHeader` — "Interviews" title, view toggle (List / Calendar), [+ Schedule] button
- `InterviewFilters` — Status tabs (Upcoming, Completed, Cancelled), type dropdown, interviewer select, date range
- `InterviewsTable` — Candidate (avatar + name), job title, type badge, date/time, duration, interviewers (avatar stack), status badge, actions
- `DataTablePagination`

**Interactions:** Click row → slide-over with interview details + feedback form. Quick cancel from ⋯ menu.

**Responsive:** Mobile — card list. Calendar view uses day view on mobile.

---

## 14. Calendar (`/interviews/calendar`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Visual calendar of interviews |
| **Layout** | Dashboard layout |

**Components:**
- `CalendarHeader` — Month/week/day toggle, today button, prev/next navigation, interviewer filter
- `CalendarGrid` — Monthly/weekly/daily views
- `InterviewEvent` — Colored block showing candidate name, job, time, type icon
- `EventPopover` — On click: full details + [Join] + [Reschedule] + [Cancel] buttons

**Interactions:** Click empty slot → open schedule interview form. Drag events to reschedule (week/day view). Color-coded by interview type.

**Responsive:** Mobile — day view only, swipe between days. Tablet — week view.

---

## 15. Team / Recruiters (`/team`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Manage team members |
| **Layout** | Dashboard layout |

**Components:**
- `PageHeader` — "Team" title, [+ Invite Member] button (admin only)
- `TeamGrid` — Card per member: avatar, name, email, role badge, department, status (active/inactive), joined date
- `InviteModal` — Email, first name, last name, role select

**Interactions:** Click card → slide-over with member details + assigned jobs. Admin actions: change role, deactivate/activate.

**Responsive:** Mobile — single-column card stack. Grid: 2 cols tablet, 3 cols desktop.

---

## 16. Analytics (`/analytics`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Hiring metrics and reports |
| **Layout** | Dashboard layout |

**Components:**
- `PageHeader` — "Analytics" title, date range picker, department filter
- `OverviewStats` — 4 stat cards (Time to Fill avg, Offer Acceptance Rate, Total Hires, Cost per Hire placeholder)
- `PipelineFunnel` — Vertical funnel chart showing conversion rates per stage
- `TimeToFillChart` — Bar chart grouped by department or job
- `SourceBreakdown` — Donut/pie chart showing applications per source
- `HiringTrend` — Line chart showing hires over time (monthly)
- `RecruiterPerformance` — Table with recruiter name, candidates screened, interviews scheduled, offers made, hires

**Interactions:** Charts animate on mount. Hover for tooltips. Click chart segments to filter. Date range changes update all charts.

**Responsive:** Mobile — charts stack vertically, full-width. Simplified charts (remove legends, use compact mode).

---

## 17. Notifications (`/notifications`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Central notification hub |
| **Layout** | Dashboard layout |

**Components:**
- `PageHeader` — "Notifications" title, [Mark All Read] ghost button
- `NotificationFilters` — Tabs: All, Unread
- `NotificationList` — Grouped by date (Today, Yesterday, Earlier)
  - `NotificationItem` — Icon (by type), title, message, timestamp, unread dot, click → navigate to related resource

**Interactions:** Click notification → mark as read + navigate to linked page. Infinite scroll pagination.

**Responsive:** Full-width on all breakpoints. Items have comfortable touch targets on mobile.

---

## 18. Settings (`/settings`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Application settings |
| **Layout** | Dashboard layout with settings sub-navigation |

**Components:**
- `SettingsNav` — Sidebar tabs: General, Company, Notifications
- **General:** Theme toggle (light/dark/system), language (future), timezone
- **Company** (`/settings/company`): Company name, logo upload, website, industry, size, address, default pipeline stages editor, brand color picker
- **Notifications** (`/settings/notifications`): Toggle switches for each notification type (email + in-app)

**Interactions:** Auto-save on change (debounced). Success toast on save. Logo upload with preview.

**Responsive:** Mobile — settings nav as horizontal scrollable tabs at top.

---

## 19. Profile (`/profile`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | User's own profile management |
| **Layout** | Dashboard layout |

**Components:**
- `ProfileHeader` — Large avatar (with upload overlay), name, role badge, email
- `ProfileForm` — First name, last name, phone, title, department, [Save] button
- `ChangePasswordSection` — Current password, new password, confirm password, [Update Password] button
- `ActiveSessions` — List of active sessions with device, IP, last active (future)

**Interactions:** Avatar upload with crop preview. Password change requires current password.

**Responsive:** Single-column form on all sizes.

---

## 20. Audit Logs (`/audit-logs`)

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Activity history for compliance |
| **Layout** | Dashboard layout |

**Components:**
- `PageHeader` — "Audit Logs" title
- `AuditFilters` — Actor (user select), action type dropdown, resource type dropdown, date range picker
- `AuditTable` — Timestamp, actor (avatar + name), action (verb badge), resource type, resource name, IP address
- `DataTablePagination`

**Interactions:** Click row → expand metadata (old value → new value diff). Export to CSV button.

**Responsive:** Mobile — card view with key fields only.

---

## 21. 404 Page

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Handle unknown routes |
| **Layout** | Minimal (no sidebar) |

**Components:**
- Large "404" display text
- "Page not found" heading
- "The page you're looking for doesn't exist or has been moved." description
- [Go to Dashboard] primary button, [Go Back] ghost button

---

## 22. Loading State

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Show during page/data loading |

**Components:**
- `PageSkeleton` — Skeleton matching the target page layout (header skeleton, card skeletons, table skeletons)
- `SpinnerOverlay` — For form submissions (semi-transparent overlay + spinner)
- `ProgressBar` — Top-of-page thin progress bar for route transitions

---

## 23. Mobile Navigation

| Attribute | Detail |
|-----------|--------|
| **Purpose** | Navigation on mobile viewports |

**Components:**
- `MobileNav` — Sheet drawer from left with full navigation menu
- Trigger: hamburger icon in topbar
- Content: Logo, user info (avatar + name + role), nav items with icons, [Logout] at bottom
- Overlay: dark backdrop, tap to close
- Animation: slide-in from left, 200ms

---

*End of Step 7 — Screen Specifications*

*Next: Step 8 — All Strategies (Caching, Security, Performance, Deployment, Testing, etc.)*
