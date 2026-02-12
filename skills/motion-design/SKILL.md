---
name: motion-design
description: >
  Expert skill for motion design, UI animation, and microinteractions. Use when the user
  asks about: animations, transitions, microinteractions, loading states, page transitions,
  hover effects, scroll animations, gesture feedback, or asks to make an interface feel
  more alive, polished, or responsive. Also triggers for: skeleton loaders, progress
  indicators, toast animations, modal transitions, drag-and-drop feedback, and any
  question about timing, easing, or how elements should move.
---

# Motion & Animation Design

Motion is not decoration — it is behavioral. Animation communicates system state, confirms
actions, guides attention, and establishes spatial relationships. When it's wrong, users
notice. When it's right, it's invisible.

---

## The Core Principle

> "What most designers think of as 'UI Animation' is the execution of a higher modality
> of design: the temporal behavior of interface objects." — Issara Willenskomer

Motion answers questions users don't know they're asking:
- Did my action register?
- Where did that element come from / go to?
- Is the system working?
- What's more important right now?

---

## Motion Tokens (Always Define These First)

```css
/* Duration */
--duration-instant:  0ms      /* No animation — immediate response */
--duration-fast:     100ms    /* Micro: toggles, checkboxes, focus rings */
--duration-normal:   200ms    /* Standard: hover states, fades, color changes */
--duration-slow:     300ms    /* Entrances/exits: modals, drawers, toasts */
--duration-slower:   500ms    /* Complex: page transitions, elaborate sequences */

/* Easing */
--ease-standard:  cubic-bezier(0.4, 0, 0.2, 1)   /* Most UI transitions */
--ease-decelerate: cubic-bezier(0, 0, 0.2, 1)     /* Elements entering the screen */
--ease-accelerate: cubic-bezier(0.4, 0, 1, 1)     /* Elements leaving the screen */
--ease-spring:    cubic-bezier(0.34, 1.56, 0.64, 1) /* Bouncy / playful interactions */
```

**Rule:** Elements entering use decelerate easing. Elements leaving use accelerate easing.
This matches physical intuition — things slow as they arrive, speed up as they leave.

---

## The 12 Motion Principles

Based on Willenskomer's UX in Motion Manifesto:

| Principle | What it does | Example |
|-----------|-------------|---------|
| **Easing** | Makes motion feel natural | All transitions use curves, never linear |
| **Offset & delay** | Creates visual hierarchy in sequences | List items stagger in 30ms apart |
| **Parenting** | Child elements follow parent motion | Icon scales with its button container |
| **Transformation** | Smoothly morphs between states | FAB expands into a modal |
| **Value change** | Animates changing numbers | Dashboard stat counts up on load |
| **Masking** | Reveals content through a crop | Navigation items slide in from behind header |
| **Overlay** | Communicates depth relationships | Dropdown appears above, shadows below |
| **Cloning** | Shared element continues between views | Card expands into a detail page |
| **Obscuration** | Content fades/blurs behind surfaces | Background blurs when modal opens |
| **Parallax** | Creates depth through differential speed | Hero image scrolls slower than content |
| **Dimensionality** | Implies 3D space | Sheet slides up from below the viewport |
| **Dolly & zoom** | Moves the camera, not the content | Map zoom vs. content scale |

---

## Motion by Component Type

### Hover States
- Duration: 100–150ms
- Easing: standard
- What changes: background color, shadow, slight scale (1.01–1.02 max)
- Never: large scale changes, color shifts that require re-reading the label

### Focus Rings
- Duration: 100ms
- Easing: standard
- Appear immediately — focus feedback must be instant

### Buttons (on click)
- Scale down slightly on press: `scale(0.97)` at 100ms
- Return to normal: 150ms
- Loading state: spinner fades in at 200ms (don't flash it for fast responses)

### Modals & Dialogs
- Enter: fade in + scale from 0.96 → 1.0, 200ms decelerate
- Exit: fade out, 150ms accelerate
- Backdrop: fade in 200ms, fade out 150ms

### Bottom Sheets & Drawers
- Enter: translate from off-screen, 300ms decelerate
- Exit: translate off-screen, 250ms accelerate
- Drag: follow finger 1:1 with slight rubber-band effect at boundaries

### Toasts & Notifications
- Enter: slide in from edge + fade, 300ms
- Auto-dismiss: fade out, 200ms
- Stack with stagger: 50ms between sequential toasts

### Skeleton Loaders
- Shimmer animation: 1.5–2s loop, left to right
- Show after 200ms delay (prevent flash on fast connections)
- Match the exact shape of the content it represents
- Fade out content in when loaded: 200ms

### Page / Route Transitions
- Crossfade: 200ms — safe default for most apps
- Slide: only when direction is meaningful (forward/back in a flow)
- Never use slide transitions for non-hierarchical navigation

### List Items (stagger)
- Stagger delay: 30–50ms per item
- Cap at 6–8 items — don't stagger 50 items
- Each item: fade in + translate Y (8–12px), 200ms decelerate

---

## Scroll-Triggered Animation

Use sparingly. Rules:
- Trigger when element is 20% into the viewport (not at the very edge)
- Fade in + subtle translate (20px max) — avoid dramatic entrances
- Duration: 400–600ms
- One animation per viewport height — don't animate everything at once
- Never animate content that users might need to read quickly (data tables, forms)

---

## Reduced Motion

**Always implement `prefers-reduced-motion`.**

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Replace motion with:
- Instant state changes
- Opacity transitions only (no position/scale)
- Static loading indicators instead of spinners

---

## CSS vs. JavaScript Animation

| Use CSS | Use JavaScript |
|---------|----------------|
| Hover states | Gesture-driven (drag, swipe) |
| Simple transitions | Physics-based spring animations |
| Keyframe animations | Scroll-linked animations |
| Most UI transitions | Complex sequencing |
| Performance-critical | Shared element transitions |

For React: use `framer-motion` for complex animations, CSS transitions for simple ones.

---

## Performance Rules

- Animate only `transform` and `opacity` — these run on the GPU without repainting
- Never animate `width`, `height`, `top`, `left`, `margin`, `padding` — causes layout thrash
- Use `will-change: transform` sparingly and only on elements that will animate
- Test at 60fps — animations should never drop below this threshold

---

## Anti-Patterns

- Linear easing on anything (always use a curve)
- Animating every element on screen simultaneously
- Transitions longer than 500ms for standard UI interactions
- Using animation to compensate for slow loading (don't distract — fix the speed)
- Entrance animations so long that content feels inaccessible
- Bouncy spring animations on serious/enterprise interfaces
- Forgetting `prefers-reduced-motion` — this is an accessibility requirement
- Scale animations that change an element's perceived size dramatically
