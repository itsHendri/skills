---
name: ux-flows
description: >
  Expert skill for designing user flows, interaction models, navigation structures, and
  information architecture. Use when the user asks about: user flows, task flows, navigation
  design, onboarding flows, information architecture, sitemaps, screen-to-screen logic,
  decision trees, app structure, multi-step forms, or how users move through a product.
  Also triggers for: login/signup flows, checkout flows, empty states, error flows,
  onboarding sequences, and any question about "how a user gets from A to B."
---

# UX Flows & Interaction Design

Flows define the behavior of an interface — how users move through it, what decisions they
make, and what the system does in response. Great flows are invisible; users just accomplish
their goals.

---

## Information Architecture First

Before designing any flow, define the structure it lives in.

**IA Deliverables:**
- **Sitemap** — All pages/screens and their hierarchical relationships
- **Taxonomy** — How content is categorized and labeled
- **Navigation model** — How users move between sections (hierarchical, flat, hub-and-spoke)

**Navigation Models:**
| Model | Use when | Examples |
|-------|----------|---------|
| **Hierarchical** (drill-down) | Deep content structures | Settings, file systems, e-commerce categories |
| **Flat** (tab-based) | 3–5 top-level destinations | Mobile apps, simple tools |
| **Hub & spoke** | One central screen, task-specific branches | Dashboards, home screens |
| **Sequential** | Linear task completion | Onboarding, checkout, multi-step forms |
| **Content-driven** | Content dictates navigation | Articles, documentation, media |

---

## User Flow Anatomy

Every flow needs:
```
Entry point → Decision nodes → Actions → System responses → Exit point(s)
```

Map ALL paths — not just the happy path:
- ✓ Happy path (user succeeds)
- ✓ Error path (something goes wrong)
- ✓ Edge cases (empty state, no permissions, timeout, offline)
- ✓ Exit/abandon path (user leaves mid-flow)
- ✓ Re-entry path (user returns after abandoning)

---

## Core Flow Patterns (Mobbin-Validated)

### Onboarding Flow
The most critical flow — first impressions determine activation.

```
Splash → Welcome/Value prop → Auth (SSO first, then email)
→ Verify → Account setup → Feature orientation → Home (with empty state)
```

**Rules:**
- Progressive disclosure — ask only what's needed at each step
- SSO (Google, Apple) before email — reduces friction significantly
- Never gate "Explore" — let users see value before fully committing
- Step indicator on every multi-step flow
- Always design the first-time empty state — it's part of the flow

### Authentication Flow
```
Login screen → [Forgot password branch] → Verify identity → Reset → Back to login
Signup → Verify email/phone → Account setup → Onboarding
```

**Rules:**
- One primary action per screen (Login OR Signup, not both equally weighted)
- "Forgot password" is a secondary action — don't compete with the primary CTA
- Verification: show progress, provide "resend code" immediately, display expiry time

### Multi-Step Forms
```
Step indicator → Form fields → Validation → Review → Confirmation
```

**Rules:**
- Never lose data on back navigation
- Validate on blur, not on every keystroke (exception: password strength)
- Show a summary screen before final submit on consequential actions
- One primary input task per step — don't batch 6 fields on one screen

### Checkout / Purchase Flow
```
Cart review → Delivery info → Payment → Review order → Confirmation
```

**Rules:**
- Show order summary persistently across all steps
- Never surprise users with new costs on the final step
- Guest checkout must be an option before account creation
- Confirmation screen should provide next steps, not just "You're done"

---

## Navigation Design by Platform

### Mobile — Tab Bar
- 3–5 destinations max
- Icons + labels (icon-only only for expert tools)
- Active state: filled icon + brand color
- Badge dot for notifications; badge number for counts
- FAB for the primary create action when used alongside tabs

### Web — Side Navigation
- Fixed left sidebar for apps with 4+ top-level sections
- Collapsed (icon-only) + expanded (icon + label) states
- Group items by section with separators
- Active item: background fill, not just text color change
- User account at the bottom, always

### Web — Top Navigation
- Logo left, primary nav center-left, CTAs right
- Sticky for marketing sites; hide-on-scroll acceptable for reading content
- Mobile: collapse to hamburger or bottom sheet — never just shrink it

### Command Palette
- Trigger: Cmd+K / Ctrl+K
- For complex apps where users have mastered the product (Figma, Notion, Linear, GitHub)
- Structure: recent actions → search results → keyboard shortcut hints
- Groups results by type: Commands / Files / People / Recent

---

## Empty States

Every data-driven screen needs one. There are 4 types:

| Type | Goal | Pattern |
|------|------|---------|
| **First-time use** | Activate — get to first "aha moment" | Illustration + headline + primary CTA that closes the loop |
| **No results** | Recover from dead-end | Icon + "No results for [x]" + escape path (clear filters / try nearby) |
| **Post-completion** | Delight + prompt next action | Celebratory moment + cross-sell or feature discovery |
| **Feature education** | Introduce unused feature | Feature icon + value prop + "Try it" CTA |

**Rule:** Never show ONLY "No results." Always provide an escape path.

---

## State Management in Flows

Define how every flow handles:
- **Loading** — Skeleton screens (preferred) or spinner for 200ms+ waits
- **Error** — What failed, why, what the user can do next
- **Partial success** — Some items succeeded, some didn't
- **Offline** — What's available, what's not, how to recover
- **Timeout** — Session expiry, form data preservation
- **Permission denied** — Why access is blocked, how to request it

---

## Flow Documentation Format

Document flows as:
1. **Flow name** and entry/exit conditions
2. **Screen list** with screen purpose (one sentence each)
3. **Decision points** — what triggers each branch
4. **System responses** — what the product does at each step
5. **Edge cases** — minimum 3 per flow
6. **Success metric** — how you'll know the flow is working

---

## Anti-Patterns

- Only designing the happy path
- Multi-step flows with no progress indicator
- Back navigation that loses user data
- Login walls before users have seen any value
- Error messages that say what went wrong but not how to fix it
- Navigation items that can't tell users where they are (no active state)
- Onboarding that asks for all information upfront instead of progressively
