---
name: accessibility
description: >
  Expert skill for accessibility and inclusive design. Use when the user asks about: WCAG,
  a11y, screen readers, keyboard navigation, color contrast, focus management, ARIA,
  accessible forms, accessible color palettes, touch targets, cognitive accessibility,
  or asks to audit/fix/improve accessibility in a UI. Also triggers whenever producing
  any UI output — accessibility is a cross-cutting requirement, not an optional feature.
  Automatically apply contrast checks, semantic HTML rules, and keyboard behavior to
  every component produced by any other skill.
---

# Accessibility & Inclusive Design

Accessibility is not a checklist item added at the end — it is a quality standard built in
from the start. An inaccessible interface is an incomplete interface.

**Target standard: WCAG 2.1 AA minimum. Aim for AAA where feasible.**

---

## The Four WCAG Principles

Every accessible interface must be:

1. **Perceivable** — Information can be perceived by all users (not just sighted/hearing)
2. **Operable** — All functionality is reachable via keyboard and assistive technology
3. **Understandable** — Content and operation are comprehensible
4. **Robust** — Works reliably with current and future assistive technologies

---

## Color Contrast

**Minimum ratios (WCAG AA):**
```
Normal text (< 18pt / < 14pt bold):  4.5:1
Large text (≥ 18pt / ≥ 14pt bold):  3:1
UI components and focus indicators:  3:1
Decorative elements:                 No requirement
```

**Testing tools:** WebAIM Contrast Checker, Figma Able plugin, browser DevTools
**Common failures:**
- Gray placeholder text on white backgrounds (often fails 4.5:1)
- Light blue links on white (often fails)
- Brand colors — check every color before using it on text

**Never communicate meaning through color alone:**
- Error fields need an icon or text label, not just a red border
- Status indicators need a label or pattern, not just a green/red dot
- Charts need patterns or labels, not just different colors

---

## Semantic HTML

Use the right element for the job — never a `<div>` when a semantic element exists.

| Purpose | Correct element | Not this |
|---------|----------------|----------|
| Primary actions | `<button>` | `<div onClick>` |
| Navigation links | `<a href>` | `<span onClick>` |
| Page regions | `<nav>`, `<main>`, `<header>`, `<footer>`, `<aside>` | `<div class="nav">` |
| Form controls | `<input>`, `<select>`, `<textarea>` | Styled divs |
| Headings | `<h1>`–`<h6>` in logical order | `<p class="big-text">` |
| Lists | `<ul>`, `<ol>`, `<dl>` | Divs with bullet characters |
| Tables | `<table>` with `<thead>`, `<th scope>` | CSS grid pretending to be a table |

**Heading hierarchy:**
- One `<h1>` per page (the page title)
- Never skip levels (no h1 → h3)
- Headings communicate document structure — not just visual size

---

## ARIA

Use ARIA only when semantic HTML is insufficient. The first rule of ARIA:
**Don't use ARIA if you can use native HTML instead.**

**Common required ARIA attributes:**

```html
<!-- Icon-only buttons -->
<button aria-label="Close dialog">
  <Icon name="x" />
</button>

<!-- Loading states -->
<button aria-busy="true" aria-label="Saving...">
  <Spinner />
</button>

<!-- Disabled state (accessible) -->
<button aria-disabled="true">Save</button>

<!-- Live regions for dynamic updates -->
<div aria-live="polite" aria-atomic="true">
  <!-- Toast messages injected here -->
</div>

<!-- Dialogs -->
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Delete project?</h2>
</div>

<!-- Form errors -->
<input aria-invalid="true" aria-describedby="email-error" />
<p id="email-error" role="alert">Enter a valid email address</p>
```

---

## Keyboard Navigation

Every interactive element must be reachable and operable via keyboard.

**Tab order rules:**
- Follows the visual reading order (left-to-right, top-to-bottom)
- Skip links at the top of every page: "Skip to main content"
- Never remove focus outlines (`:focus-visible`) — only customize them

**Required keyboard behaviors by component:**

| Component | Keys |
|-----------|------|
| Buttons / links | Enter, Space (buttons only) |
| Dropdowns / select | Enter to open, Arrow keys to navigate, Enter/Space to select, Escape to close |
| Modal dialogs | Focus trap inside, Escape to close, focus returns to trigger on close |
| Tabs | Arrow keys to switch tabs, Tab to move into tab panel |
| Checkboxes | Space to toggle |
| Radio groups | Arrow keys to select, Tab to move to next group |
| Sliders | Arrow keys to increment/decrement |
| Date pickers | Arrow keys within calendar, Escape to close |
| Autocomplete | Arrow keys to navigate suggestions, Enter to select, Escape to close |

**Focus management:**
- When a modal opens: focus moves to the first interactive element inside
- When a modal closes: focus returns to the element that triggered it
- When content loads dynamically: move focus to the new content or announce it via `aria-live`

**Focus indicator style:**
```css
/* Never just remove outline — always provide a visible replacement */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}
```

---

## Touch Targets

Minimum touch target: **44×44px** (Apple HIG and WCAG 2.5.5)

- Small icons or links: add padding to reach 44px even if visual size is smaller
- Spacing between targets: minimum 8px to prevent mis-taps
- For Android Material: 48×48px is the recommendation

---

## Images & Media

```html
<!-- Informative image: describe what it shows -->
<img src="chart.png" alt="Bar chart showing 40% increase in Q3 revenue" />

<!-- Decorative image: empty alt, screen reader skips it -->
<img src="decorative-swoosh.png" alt="" role="presentation" />

<!-- Complex images (charts, diagrams): provide extended description -->
<img src="architecture-diagram.png" alt="System architecture diagram"
     aria-describedby="arch-description" />
<p id="arch-description">The diagram shows three tiers: client, API gateway, and database...</p>
```

- Video: captions required, transcripts recommended
- Audio: transcripts required
- Animated GIFs: provide pause control if longer than 5 seconds

---

## Forms

Every input needs a label. No exceptions.

```html
<!-- Explicit label (preferred) -->
<label for="email">Email address</label>
<input id="email" type="email" name="email" />

<!-- Implicit label -->
<label>
  Email address
  <input type="email" name="email" />
</label>

<!-- When visual label isn't possible -->
<input type="search" aria-label="Search products" />
```

**Error handling:**
- Errors announced via `role="alert"` or `aria-live="assertive"`
- Error linked to input via `aria-describedby`
- Required fields: use `required` attribute + communicate in label or helper text
- Never rely only on color to indicate error state

---

## Cognitive Accessibility

Often overlooked — design for users with cognitive disabilities, ADHD, anxiety:

- **Reduce cognitive load:** One primary action per screen
- **Predictability:** Consistent navigation, consistent patterns
- **Plain language:** Short sentences, common words, active voice
- **Time limits:** Warn before sessions expire; allow extension
- **Motion:** Always respect `prefers-reduced-motion`
- **Reading level:** Aim for grade 8 or below for consumer products
- **Error recovery:** Never require users to re-enter all data after an error

---

## Accessibility Testing Checklist

Before delivering any UI:
- [ ] Color contrast passes 4.5:1 for normal text, 3:1 for large text and UI elements
- [ ] All interactive elements are keyboard reachable in logical order
- [ ] Focus indicator is visible on all interactive elements
- [ ] All images have appropriate alt text
- [ ] All form inputs have labels
- [ ] Error messages are programmatically associated with their inputs
- [ ] Modals trap focus and return focus on close
- [ ] Dynamic content updates are announced via `aria-live`
- [ ] No meaning conveyed by color alone
- [ ] `prefers-reduced-motion` is respected

---

## Anti-Patterns

- `outline: none` without a visible replacement — makes keyboard navigation invisible
- `<div role="button">` when `<button>` exists — misses built-in keyboard behavior
- Placeholder text as the only label — disappears, fails contrast, fails screen readers
- Color-only status indicators (red dot = error) without text or icon
- Auto-playing video or audio without controls
- Opening links in new tabs without warning the user
- Click targets smaller than 44×44px
- Focus traps outside of modals — keyboard users can get stuck
- `aria-hidden="true"` on elements that still receive focus
- Removing semantic list markup to "fix" spacing issues
