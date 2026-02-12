---
name: visual-ui
description: >
  Expert skill for visual design and UI aesthetics. Use when the user asks about: layout,
  color systems, typography, spacing, grids, iconography, visual hierarchy, UI components,
  card design, dashboard design, responsive layouts, dark mode, or asks to make something
  look better, more polished, or more professional. Also triggers for: "design a screen",
  "create a UI", "style this component", "improve the visual design", landing pages,
  marketing pages, and any request where the primary output is a visually designed interface.
  Always produces distinctive, production-grade UI — never generic AI aesthetics.
---

# Visual & UI Design

Visual design is the discipline of communicating through layout, color, typography, and
space. Its job is to make interfaces clear, trustworthy, and memorable — not just beautiful.

---

## Design Thinking Before Output

Before touching any layout or color, commit to a clear aesthetic direction:

- **Purpose** — What problem does this interface solve? Who uses it?
- **Tone** — Pick a direction and execute it with precision:
  Brutally minimal / Editorial / Luxury refined / Playful / Industrial / Organic / Retro-futuristic
- **Differentiation** — What makes this unforgettable?

**Critical:** Bold maximalism and refined minimalism both work.
The key is intentionality — never a default.

---

## Typography

Typography carries 80% of an interface's personality.

**Rules:**
- Never use Inter, Roboto, Arial, or system-ui as the sole font — they signal zero design investment
- Pair a distinctive display/heading font with a clean body font
- Use Google Fonts or system fonts with clear character: DM Sans, Syne, Outfit, Plus Jakarta Sans, Fraunces, Cabinet Grotesk, Bricolage Grotesque
- Type scale: Display → H1 → H2 → H3 → H4 → Body-lg → Body → Body-sm → Caption → Label
- Line heights: tight (1.1–1.2) for display/headings, relaxed (1.5–1.6) for body
- Letter spacing: negative (–0.02em) for large headings, 0 for body, positive (+0.05em) for labels/caps

**Scale (minimum):**
```
Display:  48–72px / 700
H1:       36–48px / 700
H2:       24–32px / 600
H3:       20–24px / 600
Body:     16px / 400
Body-sm:  14px / 400
Caption:  12px / 400
Label:    12–14px / 500–600
```

---

## Color

**Rules:**
- Define a full token system before applying color to any component (see design-systems.skill)
- Dominant brand color + 1–2 neutrals + semantic colors (success/warning/error/info)
- Dark backgrounds with light text can be more distinctive than white — consider both
- Always verify contrast: body text ≥ 4.5:1, large text ≥ 3:1, UI elements ≥ 3:1
- Brand colors often fail contrast — use lighter/darker variants, not the exact brand hex

**Building a color palette:**
```
1. Pick a primary (brand color)
2. Generate a 10-step scale (50→950) using HSL adjustments
3. Map semantic roles: primary, surface, border, text, error, success, warning
4. Test all combinations for WCAG AA compliance
5. Define dark mode equivalents
```

---

## Spacing & Layout

**4px base grid** — all spacing is a multiple of 4:
```
4, 8, 12, 16, 24, 32, 48, 64, 96, 128px
```

**Layout principles:**
- Establish a clear reading hierarchy through size and weight contrast, not color alone
- Generous negative space signals quality — padding should feel almost too much before it feels right
- Align everything to a grid; break the grid deliberately and sparingly for emphasis
- Desktop containers: max-width 1280px for content, 1536px for full-bleed layouts
- Mobile: 16px outer padding min; 24px preferred

**Visual hierarchy checklist:**
1. Can you identify the single most important element in 3 seconds?
2. Is there enough contrast between heading and body text sizes?
3. Is the primary CTA the most visually prominent action on screen?
4. Do related elements group together with less space than unrelated elements?

---

## Backgrounds & Visual Depth

Never default to flat white/gray. Create atmosphere:

- Gradient meshes and subtle noise textures for landing pages and hero sections
- Card elevation through shadow + slight background offset (not just border)
- Layered surfaces: page → card → raised element (3 levels minimum in complex UIs)
- Dark interfaces: use multiple gray values (not just one dark background) to create depth

---

## Iconography

- Use a consistent icon library — never mix styles within a product
- Recommended: Lucide, Phosphor, Heroicons, Radix Icons (all MIT licensed)
- Icon + label is always clearer than icon alone — use icon-only for established conventions (close, search, hamburger) or with tooltips
- Icon size: 16px for inline/dense, 20px for standard UI, 24px for prominent actions
- Stroke weight should match the overall visual weight of the typography

---

## Component Visual Standards

### Buttons
- Primary: filled background, high contrast, most prominent element
- Secondary: outlined or low-fill, clearly subordinate to primary
- Ghost: text only, lowest visual weight — use for tertiary actions
- Danger: red, reserved for destructive actions only
- Min height: 36px (sm), 40px (md), 48px (lg) — never below 36px

### Cards
- Consistent border-radius across the system (never mix pill and sharp in the same context)
- Shadow or border to separate from background — not both unless intentional
- Consistent image aspect ratios within a grid (16:9 or 3:4, never mixed)
- Clear visual hierarchy inside: image → meta → title → description → action

### Forms
- Input height: 40px (md default), 36px (sm), 48px (lg)
- Label above input, always (never placeholder-as-label)
- Error state: red border + red error message below + optional icon
- Focus state: colored ring with 2–3px offset

---

## Dark Mode

Every production UI should support dark mode.

**Rules:**
- Dark mode is NOT just inverting colors — surfaces invert, text inverts, but saturation often needs adjustment
- Use separate semantic token values for light and dark (not CSS `invert()`)
- Cards in dark mode: slightly lighter than the page background (not darker)
- Colored elements: desaturate slightly in dark mode — full-saturation brand colors can look harsh

---

## Responsive Design

Mobile-first. Design for the smallest screen first, add complexity at larger breakpoints.

```
sm:   480px   (mobile)
md:   768px   (tablet)
lg:   1024px  (desktop)
xl:   1280px  (large desktop)
```

Layout shifts at breakpoints:
- Single column → 2-col → 3-col → 4-col (cards/grids)
- Side nav appears at md or lg (not on mobile)
- Typography scales up 2–4px per level at md+
- Outer padding: 16px (mobile) → 24px (tablet) → 32px+ (desktop)

---

## Anti-Patterns

- Purple gradients on white backgrounds — the default "AI aesthetic"
- Inter as the only font with no typographic distinction
- Generic card grids with no visual personality
- Using color as the ONLY differentiator for interactive states
- Shadows that are too dark, opaque, or spread too wide
- Mixing icon styles or icon libraries in the same interface
- Placeholder-as-label on form inputs
- Making every heading the same weight/size to "keep it clean"
