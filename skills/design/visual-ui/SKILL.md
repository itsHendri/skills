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

## The AI Aesthetic Trap

These are the patterns AI generates by default. Producing any of them is a failure.

**Typography traps:**
- Inter, Roboto, Arial, Open Sans, or system-ui as the only font — zero design investment
- Monospace typography used as lazy shorthand for "technical/developer" vibes
- Large rounded icons above every heading — templated, signals no design thought
- Every heading the same weight and size to "keep it clean" — eliminates hierarchy

**Color traps:**
- Pure black (#000) or pure white (#fff) — always tint; pure black/white never appears in nature
- Gray text on colored backgrounds — looks washed out; use a shade of the background color instead
- The AI palette: cyan-on-dark, purple-to-blue gradients, neon accents on dark backgrounds
- Gradient text on headings or metrics — decorative, not meaningful
- Defaulting to dark mode with glowing accents — looks "cool" without requiring design decisions

**Layout traps:**
- Wrapping everything in cards — not everything needs a container
- Nesting cards inside cards — flatten the hierarchy
- Identical card grids: same-sized cards, icon + heading + text, repeated endlessly
- The hero metric layout: big number, small label, supporting stats, gradient accent — template not design
- Centering everything — left-aligned text with asymmetric layouts feels more designed
- Identical spacing everywhere — without rhythm, layouts feel monotonous

**Component traps:**
- Glassmorphism: blur effects, glass cards, glow borders used decoratively
- Rounded rectangles with a thick colored border on one side — a lazy accent, rarely intentional
- Sparklines as decoration — tiny charts that look sophisticated but convey nothing
- Modals for everything — lazy; find a better pattern unless truly required
- Generic drop shadows on rounded rectangles — safe, forgettable, could be any AI output

---

## Typography

Typography carries 80% of an interface's personality.

**Rules:**
- Never use Inter, Roboto, Arial, or system-ui as the sole font
- Pair a distinctive display/heading font with a clean body font
- **Marketing / content pages:** use fluid sizing with `clamp()` — text dominates the layout and needs to breathe across viewports
- **App UIs, dashboards, data-dense interfaces:** use fixed `rem` scales — no major design system (Material, Polaris, Carbon, Primer) uses fluid type in product UI; fixed scales give the spatial predictability container-based layouts need
- Body text stays fixed even on marketing pages — the size difference across viewports is too small to warrant fluid scaling
- Vary font weights and sizes to create clear visual hierarchy — sameness is the enemy
- Recommended: DM Sans, Syne, Outfit, Plus Jakarta Sans, Fraunces, Cabinet Grotesk, Bricolage Grotesque

**Scale (minimum):**
```
Display:  48–72px / 700    line-height: 1.1
H1:       36–48px / 700    line-height: 1.2
H2:       24–32px / 600    line-height: 1.3
H3:       20–24px / 600    line-height: 1.4
Body:     16px / 400       line-height: 1.5–1.6
Body-sm:  14px / 400       line-height: 1.5
Caption:  12px / 400
Label:    12–14px / 500–600  letter-spacing: +0.05em
```

Letter spacing: negative (–0.02em) for large headings, 0 for body, positive for labels/caps.

---

## Color

**Rules:**
- Define a full token system first (see design-systems)
- Use modern CSS color functions: `oklch()`, `color-mix()`, `light-dark()` — perceptually uniform, maintainable
- OKLCH critical rule: **as you move toward white or black, reduce chroma** — high chroma at extreme lightness looks garish. A light blue at 85% lightness needs ~0.08 chroma, not the 0.15 of your base color
- Tint your neutrals toward your brand hue — `oklch(95% 0.01 250)` vs `oklch(95% 0 0)`. The chroma is tiny but perceptible; it creates subconscious cohesion between your brand color and your UI
- **60-30-10 rule:** 60% neutral backgrounds/surfaces, 30% secondary (text, borders, inactive), 10% accent (CTAs, highlights, focus). Accent colors work *because they're rare* — overuse kills their power. Most apps work fine with one accent color; adding more creates decision fatigue
- Dominant brand color + 1–2 neutrals + semantic colors (success/warning/error/info)
- Always verify contrast: body text ≥ 4.5:1, large text ≥ 3:1, UI elements ≥ 3:1
- Brand colors often fail contrast — use lighter/darker variants, not the exact brand hex

**Building a color palette:**
```
1. Pick a primary (brand color)
2. Generate a 10-step scale (50→950) using oklch for perceptual uniformity
3. Map semantic roles: primary, surface, border, text, error, success, warning
4. Tint neutrals toward primary hue — even subtle saturation adds cohesion
5. Test all text/background combinations for WCAG AA
6. Define dark mode equivalents as separate semantic token values
```

---

## Spacing & Layout

**4px base grid** — all spacing is a multiple of 4:
```
4, 8, 12, 16, 24, 32, 48, 64, 96, 128px
```

**Layout principles:**
- Create visual rhythm through varied spacing — tight groupings with generous separations
- Use clamp() for fluid spacing that breathes on larger screens
- Use asymmetry and unexpected compositions; break the grid deliberately for emphasis
- Generous negative space signals quality — padding should feel almost too much
- Desktop containers: max-width 1280px for content, 1536px for full-bleed
- Mobile: 16px outer padding min; 24px preferred

**Visual hierarchy checklist:**
1. Can you identify the single most important element in 3 seconds?
2. Is there enough contrast between heading and body text sizes?
3. Is the primary CTA the most visually prominent action on screen?
4. Do related elements group with less space than unrelated ones?
5. Is every decorative element intentional — not templated?

---

## Backgrounds & Visual Depth

Never default to flat white/gray. Create atmosphere:

- Gradient meshes and subtle noise textures for landing pages and hero sections
- Card elevation through shadow + slight background offset (not just border)
- Layered surfaces: page → card → raised element (3 levels minimum in complex UIs)
- Dark interfaces: use multiple gray values to create depth — not one flat dark background

---

## Iconography

- Use one consistent icon library — never mix styles
- Recommended: Lucide, Phosphor, Heroicons, Radix Icons (all MIT licensed)
- Icon + label is always clearer than icon alone
- Icon-only acceptable for: close, search, hamburger — always with tooltips elsewhere
- Icon size: 16px inline/dense, 20px standard UI, 24px prominent actions
- Stroke weight must match the visual weight of the typography

---

## Component Visual Standards

### Buttons
- Primary: filled background, high contrast, most prominent element
- Secondary: outlined or low-fill, clearly subordinate to primary
- Ghost: text only, lowest visual weight — tertiary actions only
- Danger: red, reserved for destructive actions only
- Min height: 36px (sm), 40px (md), 48px (lg) — never below 36px
- Don't make every button primary — hierarchy requires contrast

### Cards
- Consistent border-radius (never mix pill and sharp in same context)
- Shadow OR border — not both unless intentional
- Consistent image aspect ratios within a grid (16:9 or 3:4, never mixed)
- Clear hierarchy inside: image → meta → title → description → action
- Don't wrap everything in a card — not every element needs a container

### Forms
- Input height: 40px (md default), 36px (sm), 48px (lg)
- Label above input, always — never placeholder-as-label
- Error state: border change + message below + icon — never color alone
- Focus state: 2px ring with 2–3px offset

---

## Dark Mode

Every production UI should support dark mode.

**Rules:**
- Dark mode is NOT inverting colors — saturation needs adjustment too
- Use separate semantic token values for light and dark — not CSS invert()
- Cards in dark mode: slightly lighter than page background (not darker)
- Colored elements: desaturate slightly — full-saturation brand colors look harsh against dark
- Don't default to dark mode as a design shortcut — earn it with real decisions

---

## Responsive Design

Mobile-first. Smallest screen first, add complexity at larger breakpoints.
Use @container queries for component-level responsiveness — adapt, don't amputate.

```
sm:   480px   (mobile)
md:   768px   (tablet)
lg:   1024px  (desktop)
xl:   1280px  (large desktop)
```

Hide critical features on mobile only when genuinely replaced by a better mobile pattern.

---

## Anti-Patterns (Full Reference)

Typography: Inter/Roboto/Arial as sole typeface — monospace as "developer" shorthand — identical heading weights — large icons above every section heading

Color: Pure #000 or #fff (always tint) — gray on colored backgrounds — cyan/purple/neon AI palette — gradient text — dark mode with glow accents as a design avoidance strategy

Layout: Wrapping everything in cards — nested cards — identical repeating card grids — hero metric template — centering everything — uniform spacing with no rhythm

Components: Glassmorphism used decoratively — single-side colored border as lazy accent — sparklines as decoration — modals as default pattern — generic rounded rectangles with drop shadows
