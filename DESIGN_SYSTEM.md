# HireTrack — Design System

> **Document Version:** 1.0  
> **Last Updated:** 2026-07-10  
> **Status:** Draft — Pending Approval  
> **Aesthetic Inspiration:** Stripe, Linear, Vercel, Raycast, Notion

---

## 1. Typography

### Font Family

**Inter** — A variable font designed for computer screens. Clean, modern, highly legible.

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');

--font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

### Type Scale (8px Grid Aligned)

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|------|--------|-------------|----------------|-------|
| `display-xl` | 48px / 3rem | 700 | 56px | -0.02em | Landing hero |
| `display-lg` | 36px / 2.25rem | 700 | 44px | -0.02em | Section headers |
| `heading-1` | 30px / 1.875rem | 600 | 36px | -0.01em | Page titles |
| `heading-2` | 24px / 1.5rem | 600 | 32px | -0.01em | Section titles |
| `heading-3` | 20px / 1.25rem | 600 | 28px | -0.005em | Card titles |
| `heading-4` | 16px / 1rem | 600 | 24px | 0 | Sub-sections |
| `body-lg` | 16px / 1rem | 400 | 24px | 0 | Primary body |
| `body-md` | 14px / 0.875rem | 400 | 20px | 0 | Default body text |
| `body-sm` | 13px / 0.8125rem | 400 | 18px | 0 | Secondary text |
| `caption` | 12px / 0.75rem | 500 | 16px | 0.01em | Labels, badges |
| `overline` | 11px / 0.6875rem | 600 | 16px | 0.08em | Category labels (uppercase) |

---

## 2. Color System

### 2.1 Brand Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `brand-50` | `#EEF2FF` | `#1E1B4B` | Tinted backgrounds |
| `brand-100` | `#E0E7FF` | `#312E81` | Hover states |
| `brand-200` | `#C7D2FE` | `#3730A3` | Focus rings |
| `brand-300` | `#A5B4FC` | `#4338CA` | — |
| `brand-400` | `#818CF8` | `#4F46E5` | — |
| `brand-500` | `#6366F1` | `#6366F1` | **Primary** (buttons, links) |
| `brand-600` | `#4F46E5` | `#818CF8` | Primary hover |
| `brand-700` | `#4338CA` | `#A5B4FC` | — |
| `brand-800` | `#3730A3` | `#C7D2FE` | — |
| `brand-900` | `#312E81` | `#E0E7FF` | — |

### 2.2 Neutral Colors

| Token | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| `gray-50` | `#F9FAFB` | `#0A0A0B` | Page background |
| `gray-100` | `#F3F4F6` | `#111113` | Card background |
| `gray-200` | `#E5E7EB` | `#1C1C1F` | Subtle borders |
| `gray-300` | `#D1D5DB` | `#28282C` | Borders |
| `gray-400` | `#9CA3AF` | `#3E3E44` | Disabled text |
| `gray-500` | `#6B7280` | `#63636E` | Placeholder text |
| `gray-600` | `#4B5563` | `#8B8B96` | Secondary text |
| `gray-700` | `#374151` | `#B4B4BE` | Body text |
| `gray-800` | `#1F2937` | `#D4D4DC` | Strong text |
| `gray-900` | `#111827` | `#EDEDF0` | Headings |
| `gray-950` | `#030712` | `#FAFAFA` | Primary text |

### 2.3 Semantic Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| `success-bg` | `#F0FDF4` | `#052E16` | Success alert bg |
| `success` | `#16A34A` | `#4ADE80` | Success text/icons |
| `success-border` | `#BBF7D0` | `#166534` | Success borders |
| `warning-bg` | `#FFFBEB` | `#422006` | Warning alert bg |
| `warning` | `#D97706` | `#FBBF24` | Warning text/icons |
| `warning-border` | `#FDE68A` | `#92400E` | Warning borders |
| `error-bg` | `#FEF2F2` | `#450A0A` | Error alert bg |
| `error` | `#DC2626` | `#F87171` | Error text/icons |
| `error-border` | `#FECACA` | `#991B1B` | Error borders |
| `info-bg` | `#EFF6FF` | `#172554` | Info alert bg |
| `info` | `#2563EB` | `#60A5FA` | Info text/icons |
| `info-border` | `#BFDBFE` | `#1E40AF` | Info borders |

### 2.4 Pipeline Stage Colors

| Stage | Color | Hex |
|-------|-------|-----|
| Applied | Slate | `#64748B` |
| Screening | Blue | `#3B82F6` |
| Phone Screen | Cyan | `#06B6D4` |
| Interview | Violet | `#8B5CF6` |
| Final Round | Amber | `#F59E0B` |
| Offer | Emerald | `#10B981` |
| Hired | Green | `#16A34A` |
| Rejected | Red | `#EF4444` |

---

## 3. Spacing Scale (8px Grid)

| Token | Value | Usage |
|-------|-------|-------|
| `space-0` | 0px | — |
| `space-0.5` | 2px | Micro adjustments |
| `space-1` | 4px | Tight padding (badges) |
| `space-2` | 8px | Inline spacing, icon gaps |
| `space-3` | 12px | Input padding-x |
| `space-4` | 16px | Card padding, section gap |
| `space-5` | 20px | — |
| `space-6` | 24px | Card padding (large) |
| `space-8` | 32px | Section spacing |
| `space-10` | 40px | Page sections |
| `space-12` | 48px | Large gaps |
| `space-16` | 64px | Page padding |
| `space-20` | 80px | Hero sections |
| `space-24` | 96px | — |
| `space-32` | 128px | — |

---

## 4. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-none` | 0px | — |
| `radius-sm` | 4px | Small badges, tags |
| `radius-md` | 6px | **Default** — inputs, buttons, cards |
| `radius-lg` | 8px | Cards, dropdowns |
| `radius-xl` | 12px | Modals, large cards |
| `radius-2xl` | 16px | Feature cards |
| `radius-full` | 9999px | Avatars, pills, toggles |

---

## 5. Shadow System

| Token | Light Mode Value | Usage |
|-------|-----------------|-------|
| `shadow-xs` | `0 1px 2px rgba(0,0,0,0.05)` | Subtle elevation (inputs) |
| `shadow-sm` | `0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)` | Cards, buttons |
| `shadow-md` | `0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)` | Dropdowns, popovers |
| `shadow-lg` | `0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05)` | Modals, command palette |
| `shadow-xl` | `0 20px 25px rgba(0,0,0,0.1), 0 10px 10px rgba(0,0,0,0.04)` | Toast notifications |
| `shadow-ring` | `0 0 0 3px rgba(99,102,241,0.15)` | Focus ring (brand tint) |

**Dark Mode:** All shadows use `rgba(0,0,0,0.3)` base + subtle border instead (`1px solid gray-300`).

---

## 6. Animation Timing

| Token | Duration | Easing | Usage |
|-------|----------|--------|-------|
| `duration-instant` | 50ms | — | Active states |
| `duration-fast` | 100ms | `ease-out` | Hover effects, color changes |
| `duration-normal` | 150ms | `ease-in-out` | **Default** — transitions |
| `duration-smooth` | 200ms | `ease-in-out` | Dropdowns, modals entering |
| `duration-slow` | 300ms | `ease-in-out` | Page transitions, accordions |
| `duration-slower` | 500ms | `cubic-bezier(0.16,1,0.3,1)` | Skeleton loaders |

**Framer Motion Presets:**
```typescript
const fadeIn = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.15 } };
const slideUp = { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.2 } };
const scaleIn = { initial: { opacity: 0, scale: 0.95 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.15 } };
const stagger = { transition: { staggerChildren: 0.05 } };
```

---

## 7. Grid System

| Breakpoint | Width | Columns | Gutter | Container Max |
|-----------|-------|---------|--------|---------------|
| `xs` | 0–639px | 4 | 16px | 100% |
| `sm` | 640px+ | 8 | 16px | 640px |
| `md` | 768px+ | 12 | 24px | 768px |
| `lg` | 1024px+ | 12 | 24px | 1024px |
| `xl` | 1280px+ | 12 | 32px | 1280px |
| `2xl` | 1536px+ | 12 | 32px | 1440px |

**Dashboard Layout:**
```
┌──────────────────────────────────────────────────┐
│                    Topbar (64px)                 │
├────────────┬─────────────────────────────────────┤
│            │                                     │
│  Sidebar   │          Main Content               │
│  (240px)   │          (flex-1)                   │
│  collapsed │          padding: 24px              │
│  (64px)    │                                     │
│            │                                     │
└────────────┴─────────────────────────────────────┘
```

---

## 8. Component Design Tokens

### 8.1 Buttons

| Variant | Background | Text | Border | Hover | Active |
|---------|-----------|------|--------|-------|--------|
| **Primary** | `brand-500` | `white` | none | `brand-600` | `brand-700` |
| **Secondary** | `gray-100` | `gray-900` | `gray-300` | `gray-200` | `gray-300` |
| **Ghost** | transparent | `gray-700` | none | `gray-100` | `gray-200` |
| **Destructive** | `error` | `white` | none | `error` darker | — |
| **Outline** | transparent | `brand-500` | `brand-300` | `brand-50` | `brand-100` |
| **Link** | transparent | `brand-500` | none | underline | — |

| Size | Height | Padding-X | Font Size | Icon Size |
|------|--------|-----------|-----------|-----------|
| `sm` | 32px | 12px | 13px | 14px |
| `md` | 36px | 16px | 14px | 16px |
| `lg` | 40px | 20px | 14px | 18px |
| `xl` | 48px | 24px | 16px | 20px |

**States:** All buttons have `radius-md`, `duration-fast` transition, `shadow-ring` on focus.

### 8.2 Inputs

| Property | Value |
|----------|-------|
| Height | 36px (md), 40px (lg) |
| Padding-X | 12px |
| Border | 1px solid `gray-300` |
| Border (focus) | 1px solid `brand-500` + `shadow-ring` |
| Border (error) | 1px solid `error` |
| Background | `white` (light), `gray-100` (dark) |
| Placeholder | `gray-500` |
| Font Size | 14px |
| Border Radius | `radius-md` |
| Label | `caption` weight 500, `gray-700`, margin-bottom 6px |
| Helper Text | `caption`, `gray-500`, margin-top 4px |
| Error Text | `caption`, `error`, margin-top 4px |

### 8.3 Cards

| Property | Value |
|----------|-------|
| Background | `white` (light), `gray-100` (dark) |
| Border | 1px solid `gray-200` |
| Border Radius | `radius-lg` |
| Padding | 24px |
| Shadow | `shadow-xs` |
| Hover (interactive) | `shadow-sm`, border `gray-300` |

### 8.4 Modals / Dialogs

| Property | Value |
|----------|-------|
| Overlay | `rgba(0,0,0,0.4)` (light), `rgba(0,0,0,0.6)` (dark) |
| Width | 480px (sm), 640px (md), 800px (lg) |
| Max Height | 85vh |
| Border Radius | `radius-xl` |
| Padding | 24px |
| Shadow | `shadow-lg` |
| Animation | `scaleIn` (150ms) |
| Close Button | Top-right, ghost icon button |

### 8.5 Tables

| Property | Value |
|----------|-------|
| Header Background | `gray-50` (light), `gray-100` (dark) |
| Header Text | `overline`, `gray-600`, uppercase |
| Row Height | 48px |
| Row Hover | `gray-50` (light), `gray-200` (dark) |
| Border | Bottom 1px `gray-200` between rows |
| Cell Padding | 12px horizontal, 8px vertical |
| Selected Row | `brand-50` background |

### 8.6 Toasts

| Variant | Icon | Left Border Color | Background |
|---------|------|-------------------|------------|
| Success | ✓ circle | `success` | `success-bg` |
| Error | ✗ circle | `error` | `error-bg` |
| Warning | ⚠ triangle | `warning` | `warning-bg` |
| Info | ℹ circle | `info` | `info-bg` |

Position: Bottom-right, max 3 stacked, auto-dismiss 5s, slide-in from right.

### 8.7 Dropdowns / Menus

| Property | Value |
|----------|-------|
| Width | min 200px, max 320px |
| Item Height | 36px |
| Item Padding-X | 12px |
| Border Radius | `radius-lg` |
| Shadow | `shadow-md` |
| Separator | 1px `gray-200`, 4px vertical margin |
| Item Hover | `gray-100` background |
| Item Active | `brand-50` background, `brand-500` text |
| Animation | `slideUp` (150ms) |

### 8.8 Badges / Status Pills

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| Default | `gray-100` | `gray-700` | `gray-200` |
| Brand | `brand-50` | `brand-700` | `brand-200` |
| Success | `success-bg` | `success` | `success-border` |
| Warning | `warning-bg` | `warning` | `warning-border` |
| Error | `error-bg` | `error` | `error-border` |

Size: height 22px, padding 6px 8px, font `caption`, `radius-full`.

### 8.9 Pagination

| Property | Value |
|----------|-------|
| Button Size | 32px × 32px |
| Active | `brand-500` bg, `white` text |
| Inactive | ghost style |
| Disabled | `gray-400` text, no pointer |
| Gap | 4px between items |

### 8.10 Skeleton Loaders

| Property | Value |
|----------|-------|
| Base Color | `gray-200` (light), `gray-200` (dark) |
| Shimmer | Linear gradient sweep, `duration-slower`, infinite |
| Border Radius | Match target element |
| Text Lines | Height 14px, gap 8px, last line 60% width |
| Avatar | Circle, 40px |
| Card | Full card dimensions with internal placeholders |

### 8.11 Charts (Recharts / Chart.js)

| Property | Value |
|----------|-------|
| Color Palette | `brand-500`, `#06B6D4`, `#8B5CF6`, `#F59E0B`, `#EF4444`, `#10B981` |
| Grid Lines | `gray-200`, dashed |
| Axis Text | `caption`, `gray-500` |
| Tooltip | `shadow-md`, `radius-md`, white bg |
| Legend | Below chart, `body-sm`, dot indicators |
| Animation | 500ms ease-in-out on mount |

---

## 9. Empty States

| Element | Design |
|---------|--------|
| Illustration | Minimal line art, brand tinted (64px–128px) |
| Heading | `heading-3`, `gray-900` |
| Description | `body-md`, `gray-500`, max 300px centered |
| CTA Button | Primary button below description |
| Spacing | 16px between elements, centered vertically |

**Examples:**
- No jobs: "No jobs yet" + "Create your first job opening" + [Create Job] button
- No candidates: "Your talent pool is empty" + "Add candidates manually or wait for applications"
- No interviews: "Nothing scheduled" + "Schedule interviews from candidate profiles"

---

## 10. Error States

| Element | Design |
|---------|--------|
| Icon | Red circle with exclamation, 48px |
| Heading | `heading-3`, `gray-900`, e.g. "Something went wrong" |
| Description | `body-md`, `gray-500` |
| Action | [Try Again] primary button + [Go Home] ghost button |
| 404 | Large "404" display text + "Page not found" + [Go to Dashboard] |

---

## 11. Dark Mode Strategy

### Implementation
- CSS variables toggled via `data-theme="dark"` on `<html>`
- Persisted in `localStorage`
- Respects `prefers-color-scheme` on first visit
- Toggle in topbar settings dropdown
- Uses Tailwind `dark:` variants backed by CSS variables

### Token Mapping Summary
| Semantic Token | Light | Dark |
|---------------|-------|------|
| `--background` | `gray-50` (#F9FAFB) | `gray-50` (#0A0A0B) |
| `--foreground` | `gray-950` (#030712) | `gray-950` (#FAFAFA) |
| `--card` | white | `gray-100` (#111113) |
| `--card-foreground` | `gray-950` | `gray-950` (#FAFAFA) |
| `--border` | `gray-200` (#E5E7EB) | `gray-200` (#1C1C1F) |
| `--input` | `gray-300` (#D1D5DB) | `gray-300` (#28282C) |
| `--primary` | `brand-500` | `brand-500` |
| `--primary-foreground` | white | white |
| `--muted` | `gray-100` | `gray-100` (#111113) |
| `--muted-foreground` | `gray-600` | `gray-600` (#8B8B96) |
| `--accent` | `gray-100` | `gray-200` (#1C1C1F) |
| `--destructive` | `error` | `error` (dark variant) |
| `--ring` | `brand-500` | `brand-400` |

---

## 12. Responsive Strategy

| Breakpoint | Sidebar | Topbar | Cards | Table |
|-----------|---------|--------|-------|-------|
| Mobile (<768px) | Hidden (sheet drawer) | Hamburger + logo | Full-width stack | Horizontal scroll or card view |
| Tablet (768–1024px) | Collapsed (icons only, 64px) | Full | 2-column grid | Visible with fewer columns |
| Desktop (1024px+) | Expanded (240px) | Full | 3–4 column grid | Full table |
| Wide (1440px+) | Expanded | Full | 4 column grid | Full table, wider |

---

*End of Step 6 — Design System*

*Next: Step 7 — Screen Specifications*
