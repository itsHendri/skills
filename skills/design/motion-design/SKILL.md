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
actions, guides attention, and establishes spatial relationships. When it's right, it's
invisible. When it's wrong, everyone notices.

> "The best animations are the ones you don't notice." — Emil Kowalski

---

## Core Philosophy

Animation should be invisible. When done right, users don't notice the animation —
they notice that the interface feels *good*. The moment someone says "nice animation,"
you've probably overdone it.

Motion answers questions users don't know they're asking:
- Did my action register?
- Where did that element come from / go to?
- Is the system working?
- What's more important right now?

---

## Motion Tokens (Define These First)

```css
/* Duration */
--duration-instant:  0ms      /* Immediate — toggles, focus rings */
--duration-fast:     150ms    /* Micro-interactions — hovers, presses */
--duration-normal:   200ms    /* Standard — fades, state changes */
--duration-slow:     300ms    /* Entrances/exits — modals, drawers, toasts */
--duration-slower:   500ms    /* Complex — page transitions */

/* Easing — never use linear for UI */
--ease-out:      cubic-bezier(0.22, 1, 0.36, 1)      /* Entrances — natural deceleration */
--ease-in:       cubic-bezier(0.4, 0, 1, 1)           /* Exits — acceleration away */
--ease-in-out:   cubic-bezier(0.4, 0, 0.2, 1)         /* Point-to-point movement */
--ease-spring:   cubic-bezier(0.34, 1.56, 0.64, 1)    /* Playful — use sparingly */
--ease-snappy:   cubic-bezier(0.16, 1, 0.3, 1)        /* Confident, decisive */
```

**Rule:** Entrances use ease-out (decelerate arriving). Exits use ease-in (accelerate leaving).
Elements moving between positions use ease-in-out.

---

## Timing Rules

- **Micro-interactions (hovers, toggles, presses):** 150–250ms. Faster = instant (good). Slower = sluggish (bad).
- **Standard transitions (modals, menus, panels):** 200–350ms. Bread and butter.
- **Complex sequences (page transitions, staggered reveals):** 400–600ms total. Never longer without reason.
- **Exit animations should be faster than entrances.** Users are waiting. Enter 300ms, exit 200ms.
- **Stagger delays: 30–60ms between items.** Longer staggers feel like a slideshow.
- **Never animate longer than 1 second total.** If it takes longer, it's not an animation — it's a loading screen.
- **Hover: instant on (0ms), 150ms off.** Respond immediately on hover; ease out when leaving so it doesn't snap.

---

## What to Animate (and What Not To)

**Always safe — GPU-accelerated, no layout thrash:**
```css
transform: translateX/Y/Z, scale, rotate
opacity
```

**Never animate these — causes expensive layout recalculation:**
```css
width, height      → use transform: scaleX/Y instead
top, left          → use transform: translateX/Y instead
margin, padding    → restructure layout instead
```

**Movement distances — keep them small:**
- Micro-interactions: 4–16px
- Larger reveals: 20–40px
- Anything more looks cartoony

**Always: opacity should accompany movement.** Don't just fade — fade AND move.
`opacity: 0 + translateY(8px)` → `opacity: 1 + translateY(0)`.

---

## Component-by-Component Specs

### Hover States
- **Instant on (0ms), 150ms ease-in off**
- Scale: 1.01–1.02 max for cards. Never go above 1.05.
- Active/pressed: `scale(0.97–0.98)`. Never below 0.95 — that's cartoon territory.
- Disabled elements: no hover animation. Disabled means disabled.

### Focus Rings
- Appear immediately (0ms) — focus feedback must never be delayed
- Never animate the ring itself — animate the element, not the indicator

### Buttons
- Press: `scale(0.97)` at 100ms, return 150ms
- Loading state: spinner fades in after 200ms (prevents flash on fast responses)

### Modals & Dialogs
- **Enter:** `scale(0.96) + opacity:0` → `scale(1) + opacity:1`, 200ms ease-out
- **Exit:** opacity fade, 150ms ease-in
- **Never start from scale(0)** — looks like it popped from nothing. Start nearly there.
- Backdrop: fade in 200ms, fade out 150ms

### Menus & Dropdowns
- Scale from `transform-origin` at the trigger — dropdowns bloom from their source
- `scale(0.97) + opacity:0` → `scale(1) + opacity:1`, 150ms ease-out

### Bottom Sheets & Drawers
- Enter: `translateY(100%)` → `translateY(0)`, 300ms ease-out
- Exit: `translateY(0)` → `translateY(100%)`, 250ms ease-in
- Drag: follow 1:1, slight rubber-band at boundaries

### Toasts & Notifications
- Enter: slide from edge + fade, 300ms ease-out
- Exit: slide back to edge, 200ms ease-in — exit in the same direction it entered
- Stagger sequential toasts: 50ms between

### Skeleton Loaders
- Shimmer: 1.5–2s loop, left to right gradient sweep
- Show after 200ms delay — prevents flash on fast connections
- Match the exact shape of the content it represents
- Fade content in on load: 200ms

### List Items (stagger)
- 30–50ms per item. Cap at 6–8 items — don't stagger 50 items.
- Lead with the most important element
- Exit: reverse order or all at once — don't just ignore the exit
- Each item: `opacity:0 + translateY(8px)` → `opacity:1 + translateY(0)`, 200ms ease-out

### Page / Route Transitions
- Crossfade 200ms — safe default for most apps
- Slide only when direction is meaningful (forward/back in a sequential flow)
- Never slide for non-hierarchical navigation

---

## Orchestration Rules

- **Background elements first, foreground last:** Backdrop → container → content → actions
- **Lead with the most important element** in any stagger sequence
- **One focal animation at a time** — one hero, everything else static or secondary
- **Keep stagger groups small (6–8 items)** — the last item in a 20-item stagger waits too long
- **Exit in reverse or all at once** — mirrors the entrance or snaps clean

---

## CSS Implementation Patterns

```css
/* Fade + rise — the standard entrance */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}
.entering { animation: fadeInUp 250ms var(--ease-out) forwards; }

/* Hover: instant on, ease off */
.card { transition: transform 150ms var(--ease-in); }
.card:hover { transform: translateY(-2px); transition-duration: 0ms; }

/* Stagger */
.item { animation: fadeInUp 200ms var(--ease-out) backwards; }
.item:nth-child(1) { animation-delay: 0ms; }
.item:nth-child(2) { animation-delay: 40ms; }
.item:nth-child(3) { animation-delay: 80ms; }
.item:nth-child(4) { animation-delay: 120ms; }
```

## Framer Motion Patterns (React)

```jsx
/* Standard fade + rise */
<motion.div
  initial={{ opacity: 0, y: 8 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: 4 }}
  transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
/>

/* Press feedback */
<motion.button
  whileTap={{ scale: 0.97 }}
  transition={{ type: "spring", stiffness: 400, damping: 25 }}
/>

/* Stagger children */
<motion.ul
  initial="hidden"
  animate="visible"
  variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
>
  {items.map(item => (
    <motion.li
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0 },
      }}
    />
  ))}
</motion.ul>

/* Exit before enter */
<AnimatePresence mode="wait">
  <motion.div
    key={currentView}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.15 }}
  />
</AnimatePresence>
```

---

## Reduced Motion (Non-Negotiable)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

In React: check `window.matchMedia('(prefers-reduced-motion: reduce)')` before applying motion.

---

## When NOT to Animate

- Form validation errors — use color/icon changes, not motion
- Critical error states — don't delay bad news
- Content the user is actively reading
- High-frequency updates (live data, timers)
- Anything the user sees hundreds of times per session
- Scroll-linked animations on mobile — too janky

---

## Performance

- `transform` and `opacity` only — GPU-accelerated, no layout thrash
- `will-change: transform` sparingly — only on elements about to animate, remove after
- Test on low-end devices — that M3 Mac animation is a slideshow on a $200 Android
- 60fps minimum — profile before shipping

---

## Anti-Patterns

- **Linear easing on anything** — real objects never move linearly
- **Bounce/elastic easing by default** — dated, draws attention to itself; use only for celebration moments
- **scale(0) entrances** — starts from nothing. Use scale(0.95–0.97).
- **Slow fades over 200ms** — feels like lag, not elegance
- **Animating every element simultaneously** — chaos, not choreography
- **Transitions longer than 500ms** for standard UI — feels broken
- **Animating to hide slow code** — fix the speed, don't mask it
- **Forgetting exit animations** — things snapping away is jarring
- **Inconsistent directions** — if modals enter from bottom, they exit to bottom
- **Staggering too many items** — cap at 6–8
- **Animating on every re-render** — only on mount or genuine state changes
- **Forgetting `prefers-reduced-motion`** — this is an accessibility requirement, not optional
