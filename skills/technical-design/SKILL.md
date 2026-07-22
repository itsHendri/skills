---
name: technical-design
description: >
  Expert skill for understanding the technical constraints that affect UI design decisions.
  Use when the user asks about: CSS fundamentals, how a layout works in code, whether a
  design is easy or hard to build, flexbox vs. grid, responsive breakpoints, CSS custom
  properties, what's expensive to animate, how tokens work in CSS, or any question about
  how a design decision translates to implementation. Also triggers for: "is this buildable",
  "how would this work in CSS", "why is the engineer saying this is hard", "what's the
  performance cost of X."
---

# Technical Design

Knowing how your designs are implemented makes you a better designer — not because you
need to write all the code, but because you make decisions that are feasible, performant,
and respected by the engineers you work with.

---

## The Box Model (Everything Is a Box)

Every element in CSS is a rectangular box with four layers:

```
┌─────────────────────────────────┐
│           margin                │  ← Outside the element; pushes others away
│  ┌───────────────────────────┐  │
│  │         border            │  │  ← The visible edge
│  │  ┌─────────────────────┐  │  │
│  │  │      padding        │  │  │  ← Inside the border; space between border and content
│  │  │  ┌───────────────┐  │  │  │
│  │  │  │    content    │  │  │  │  ← Text, images, child elements
│  │  │  └───────────────┘  │  │  │
│  │  └─────────────────────┘  │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

**Design implications:**
- `padding` adds space inside — the background color fills it
- `margin` adds space outside — transparent, no background
- In Figma, "padding" = CSS padding. "Auto layout gap" = CSS gap.
- `box-sizing: border-box` (always set this) — width includes padding and border

---

## Flexbox vs. Grid

Both are layout tools. Choosing the wrong one causes engineering pain.

### Flexbox — one direction at a time
Use for: rows of items, stacks, aligning things along one axis, navigation bars, button groups

```css
.nav {
  display: flex;
  flex-direction: row;      /* or column */
  align-items: center;      /* cross axis */
  justify-content: space-between; /* main axis */
  gap: 16px;
}
```

**Figma equivalent:** Auto layout (horizontal or vertical)

### CSS Grid — two directions simultaneously
Use for: page layouts, card grids, anything with rows AND columns, complex alignments

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 equal columns */
  gap: 24px;
}

/* Responsive version */
.card-grid {
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
```

**Figma equivalent:** There's no direct Figma equivalent — this is why "Figma to code" tools struggle

### Decision guide
```
Items in a line (nav, buttons, tags)?           → Flexbox
Items need to wrap to multiple rows?            → Flexbox with flex-wrap OR Grid
Card grid with equal columns?                   → Grid
Complex page layout (sidebar + main + aside)?   → Grid
Centering something?                            → Flexbox (align/justify center)
Items should align to BOTH rows and columns?    → Grid
```

---

## Responsive Design in Code

Breakpoints are minimum widths (mobile-first):

```css
/* Mobile first — no media query needed, this is the base */
.card { width: 100%; }

/* Tablet and up */
@media (min-width: 768px) {
  .card { width: 50%; }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .card { width: 33.33%; }
}
```

**In Tailwind:** `md:w-1/2 lg:w-1/3` — same thing, shorter

**Design implications:**
- Design mobile first — it's harder, and engineering matches this approach
- Breakpoints are guidelines, not pixel-perfect boundaries — test in a browser, not just Figma
- "The content breaks" is the real breakpoint, not arbitrary numbers

---

## CSS Custom Properties (Design Tokens in Code)

This is how your Figma token system lives in CSS:

```css
:root {
  /* Primitive tokens */
  --blue-500: #3B82F6;
  --gray-100: #F3F4F6;

  /* Semantic tokens — these go in components */
  --color-primary: var(--blue-500);
  --color-surface: var(--gray-100);
  --space-4: 16px;
  --radius-md: 8px;
}

/* Component uses semantic tokens, never primitives */
.button-primary {
  background: var(--color-primary);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
}

/* Dark mode: override semantic tokens only */
@media (prefers-color-scheme: dark) {
  :root {
    --color-primary: var(--blue-400);
    --color-surface: var(--gray-900);
  }
  /* All components update automatically */
}
```

**Design implication:** When you change a token in your design system, every component
using that token updates in code. This is why token discipline matters — one change, system-wide effect.

---

## What's Cheap vs. Expensive to Build/Animate

### Cheap (quick to build, fast to render)
- Color changes
- Opacity transitions
- Transform (translate, scale, rotate) — GPU-accelerated
- Box shadow changes
- Border radius changes
- Simple show/hide with CSS

### Moderate (takes engineering time but performs fine)
- Complex responsive layouts
- Multi-step forms with validation
- Filtering and sorting lists
- Skeleton loaders

### Expensive (requires engineering discussion)
- Drag and drop with sorting
- Real-time collaborative editing
- Large data tables (10,000+ rows)
- Complex canvas/custom rendering
- Shared element transitions between pages
- Video manipulation or real-time effects

### Never animate these (causes layout thrash — poor performance)
```
width, height      → use transform: scaleX/scaleY instead
top, left          → use transform: translateX/Y instead
margin, padding    → restructure layout instead
```

---

## Positioning: When Things Need to Overlap

```css
position: static;   /* Default — flows with the document */
position: relative; /* Offset from normal position; establishes stacking context */
position: absolute; /* Removed from flow; positioned relative to nearest relative parent */
position: fixed;    /* Stays on screen as user scrolls (sticky headers, FABs) */
position: sticky;   /* Flows normally until threshold, then sticks */
```

**Design implications:**
- Dropdowns, tooltips, modals: `absolute` or `fixed`
- Sticky nav: `sticky`
- Badges on icons: `absolute` inside a `relative` container
- "Why is my dropdown hidden behind X?" → z-index and stacking context issues

---

## Typography in CSS

```css
/* Everything from your type scale */
font-size: 1rem;        /* 16px — always use rem, not px, for accessibility */
font-weight: 600;
line-height: 1.5;       /* Relative — preferred over px */
letter-spacing: -0.02em; /* Relative — preferred for headings */
text-overflow: ellipsis; /* Truncation — requires: overflow: hidden + white-space: nowrap */
```

**Common design problems:**
- Text overflow: requires `overflow: hidden`, `white-space: nowrap`, `text-overflow: ellipsis` together — it's 3 properties
- Multi-line truncation: `-webkit-line-clamp: 3` (now well-supported)
- Font rendering varies slightly across OS — always test on Windows and Mac

---

## What Engineers Mean When They Say "That's Hard"

| Engineer says | What it usually means | Designer response |
|---------------|----------------------|-------------------|
| "That'll be hard to build" | Overlapping layout, complex state, or no existing pattern | Ask: "Is it the layout, the interaction, or the data?" |
| "Can we just use [existing component]?" | They want to avoid new code | Ask: "What does the existing component not do?" |
| "That'll be slow" | Animation affects layout (width/height), or too many DOM elements | Propose transform-only animation alternative |
| "We'll need to refactor for that" | Architectural change, not just UI | Acknowledge the cost; decide if the UX value justifies it |
| "That'll break on mobile" | Fixed widths, no responsive design, or touch targets too small | Show mobile spec; ask what breaks specifically |

---

## Vertical Rhythm

Line-height should be the base unit for all vertical spacing. If body text has
`line-height: 1.5` on 16px type (= 24px), spacing values should be multiples of 24px.
This creates subconscious harmony — text and space share a mathematical foundation.

```css
/* Base: 16px × 1.5 = 24px rhythm unit */
--line-height-body: 1.5;
--space-rhythm: 1.5rem; /* = 24px */

p { margin-bottom: var(--space-rhythm); }
h2 { margin-top: calc(var(--space-rhythm) * 2); } /* 48px — visual separation */
```

**Non-obvious:** increase line-height for light text on dark backgrounds. Perceived
weight is lighter, so text needs more breathing room — add 0.05–0.1 to your normal
line-height.

---

## Optical Adjustments

Geometry and perception don't always agree. Trust your eyes, not the numbers.

- **Text optical alignment:** text at `margin-left: 0` *looks* indented due to
  letterform whitespace (the space inside a capital 'T', curved side of 'C', etc.).
  Use a small negative margin (`-0.03em` to `-0.05em`) to optically align headlines
  to their container edge.

- **Icon centering:** geometrically centered icons often look off-center. Play icons
  (triangles) need to shift slightly right toward their direction. Arrows shift toward
  the direction they point. When something looks wrong but measurements say it's right,
  the measurements are wrong.

- **Button padding:** equal padding top/bottom rarely looks equal — optical weight
  varies by font. Reduce top padding by 1–2px if the label looks low.

- **Icon-to-label alignment:** align icons to the cap-height of the label text, not
  the line-height midpoint. This is usually `align-items: center` with a tiny negative
  `margin-top` on the icon.

---

## Anti-Patterns

- Designing fixed-width layouts that can't flex — use min/max widths, not fixed
- Ignoring text overflow — every text element needs a truncation or wrapping strategy
- Animating width/height — always use transform instead
- Assuming Figma Auto Layout = CSS Flexbox exactly (it doesn't, especially for Grid layouts)
- Designing overlapping elements without thinking about z-index and stacking
- Using `px` for font sizes in designs that need to respect browser accessibility settings (use rem)
- Designing hover states that don't have keyboard equivalents — they're the same interaction
