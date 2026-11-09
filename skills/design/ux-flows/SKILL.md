---
name: ux-flows
description: >
  Expert skill for designing user flows, interaction models, navigation structures, and
  information architecture — and for publishing a finished flow onto an infinite canvas as a
  handoff artifact. Use when the user asks about: user flows, task flows, navigation
  design, onboarding flows, information architecture, sitemaps, screen-to-screen logic,
  decision trees, app structure, multi-step forms, or how users move through a product.
  Also triggers for: login/signup flows, checkout flows, empty states, error flows,
  onboarding sequences, and any question about "how a user gets from A to B."
  The canvas half triggers for: flow map, flow diagram, put this on a board, whiteboard,
  infinite canvas, FigJam, swimlanes, spec card, screen-by-screen handoff, or
  "document this flow for engineering."
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

---
---

# Appendix — Publishing a flow to an infinite canvas

Everything above is about *designing* a flow. This appendix is about *publishing* a finished one
onto an infinite canvas (FigJam, or any board that can hold images, text and connectors) as an
artifact an engineer can build from
without a sync call.

Load this half only when the task is publishing. Two boundaries:

- **`wireframe`** deliberately says *don't* push to external design tools unless asked. This is the
  case where the user has asked.
- **`design-communication`** owns spec *content* — its spec template and acceptance criteria are the
  source of truth for what a spec says. This appendix owns only how a spec is *rendered on a board*.

## Decide the track first

Two different jobs get called "a flow map". Pick one deliberately; mixing them is the most common
way these boards go wrong.

| Track | Goal | Screens are… | Deliverable |
|---|---|---|---|
| **Design hand-off** | build the real thing | componentised, real design-system instances | an editable design file |
| **Flow documentation** | share fast, hand to engineering | raw captures of a running build | a connected board |

For documentation, rebuilding screens is overhead *and* introduces drift — the map should show
exactly what ships. Capture the running build and skip the rebuild.

## The canvas-independent flow model

Model the flow before touching any tool. Everything below maps onto every canvas.

| Element | Role |
|---|---|
| **Screen node** | one captured state, named `NN · Screen name` so order survives sorting |
| **Decision node** | a real fork, with the condition written *on* the node |
| **Lane** | a titled phase grouping consecutive screens |
| **Edge** | a transition, carrying one semantic role (below) |
| **Hotspot** | a marker on the exact control that triggers an edge |
| **Panel** | framed context: title, entry points, legend, divergences |
| **Spec card** | the per-screen handoff detail, placed under its screen |

## Semantic edge roles

Define roles by *meaning*, then bind each to a colour from the project's own tokens. Read the
project's token source first (theme file, CSS variables, design-system doc) and never use the canvas
tool's default swatches when the project has a palette — a board in stock colours reads as a
different product.

| Role | Line | Means |
|---|---|---|
| **Main path** | solid | the primary route through the flow |
| **Variation / sub-flow** | dashed | an alternative route to the same outcome |
| **Opens a modal layer** | dashed | a sheet or picker on top of the current screen |
| **State / reference** | dashed, muted | an error/empty/loading example of a screen |
| **Risk** | solid, alert | a destructive or irreversible path |
| **Decision** | — | fill for the fork node itself |

Keep a **visual legend** built from real marks — actual short connectors, a real fork node, a real
hotspot dot — not text descriptions. A legend drawn any other way drifts from the canvas.

## Layout system

- **Context cluster, top-left, before the flow starts:** title + one-line subtitle (what was
  captured, from where) · entry points and their routing conditions · the visual legend ·
  divergences. Put divergences *here*, not at the bottom where nobody scrolls.
- **Horizontal rail**, left to right, at a generous column pitch so connector gutters stay clear.
- **Phase lanes** wrapping consecutive screens: a saturated title bar over a light-tint body,
  uniform height.
- **Spec card directly beneath its screen**, narrower than the column pitch.
- **Sub-flow band** below the cards: variations, modal layers and states, each under its parent
  column, linked from a hotspot on the triggering control.

## Spec card

The board renders it; `design-communication` defines what a spec says. Render as a rounded rect with
rich text — bold title, bold field labels, regular values — not a sticky note, which caps at a size
that forces you to cut detail.

Beyond the standard spec fields, a flow board needs four of its own:

- **Branches** — where each action goes, with its condition
- **Edge cases** — error, empty, loading, skip, back
- **Actor** — user · system · external (which third party)
- **Hotspot** — which on-screen control triggers each outgoing edge

Write unknowns as **"TBD — confirm with eng"**, never blank. A blank field reads as "nothing
required"; an explicit TBD is a visible question. Values that can only come from the running system
(analytics event names, endpoints) should be **sourced from the codebase** where the build is
available, not invented.

## Capture pipeline

1. **Capture from the highest-fidelity real build.** A web fallback for a native app, or a
   componentised rebuild, both drift from what ships.
2. **Add a capture seed** — a dev-only deep link or route parameter that jumps straight to any
   state with realistic data. Without one, state-machine flows have no addressable steps and every
   re-capture is manual. This is the difference between a board you update and a board you abandon.
3. **Pre-grant OS permissions** before capturing, or a system dialog lands in the middle of your
   screenshots.
4. **Name each file after its screen.** On most canvases the filename becomes the layer name, which
   is what keeps screen-to-image mapping correct at scale.
5. **On change, re-capture and swap the fill.** Connectors, lanes and cards stay. Never rebuild the
   board for a visual change.

A capture succeeding means the screen *rendered*, not that it rendered *correctly* — a screen with
no data behind it still produces a valid image of an empty state. Verify against the build's logs.

## Canvas adapters

Write the flow model first, adapt to the tool second. Canvas automation comes in two shapes, and
which one you have changes the order you build in:

| | **Imperative** — script node by node | **Declarative** — submit a spec |
|---|---|---|
| **Construction** | create each node, set its properties | describe all items in one payload |
| **Order** | create, then connect by node id | items first, connectors last, by alias |
| **Failure mode** | partial builds if a step throws mid-script | whole payload rejected on one bad line |
| **Discovery** | check which node types the editor mode allows | fetch the spec format before writing any |

FigJam is the imperative case and the one verified here. Its specifics:

- **Node types are editor-scoped.** Connectors, sections and shape-with-text exist in whiteboard
  mode but not the design editor of the same tool. Confirm from the file URL which editor you are in
  before assuming an API exists.
- **Direct image creation from a URL is unavailable.** The working path is upload → asset handle →
  shape with an image fill.
- **Upload filenames become layer names**, so name files `NN Screen name` before uploading and the
  board arrives pre-ordered.
- **Screenshots render a node in isolation.** A background rectangle with text as a *sibling*
  screenshots as an empty rectangle. Build panels and cards as frames containing their own text, and
  they become verifiable in one call.

For any other canvas — declarative or custom — the model maps to any renderer that supports
positioned images, text, filled shapes and polylines. Export the flow model as data and render it;
the value is in the model, not the tool.

## Routing

- **Explicit side magnets, never auto.** Auto-routing draws lines straight across screen bodies.
  Anchor the source to the side facing a clear gutter and the target to the edge facing it.
- **Elbowed connectors**, arrow end-cap.
- **Crossing lines mean the layout is fighting the flow.** Re-order the rail; don't re-route the
  line.

## Completeness checklist

A board is engineer-ready when:

- [ ] Every screen has purpose, fields, validation, data-out, branches, edge cases
- [ ] Every decision node states its condition explicitly
- [ ] Every branch has a destination *and* a condition
- [ ] Entry and exit points are marked, including re-entry after abandon
- [ ] Every external dependency is attributed to an actor
- [ ] Unknowns say "TBD — confirm with eng" rather than sitting blank
- [ ] No connector crosses another
- [ ] The legend matches the marks actually used on the canvas

## Anti-patterns

- Putting every variation on the main rail — the single biggest cause of unreadable boards. Main
  path is the spine; variations go in the sub-flow band or their own board.
- Auto-routing connectors and accepting lines across screens.
- Sticky notes for specs, then cutting detail to fit them.
- A text-described legend that no longer matches the canvas.
- Rebuilding screens for a documentation board, then presenting the rebuild as what ships.
- Screenshotting the flow at a fidelity that hides the real design system.
- No capture seed, so the board is a one-off that rots on the next design change.
- Divergences from production buried at the bottom of the board.
