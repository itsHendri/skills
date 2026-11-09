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

1. **Perceivable** — Information can be perceived by all users
2. **Operable** — All functionality is reachable via keyboard and assistive technology
3. **Understandable** — Content and operation are comprehensible
4. **Robust** — Works reliably with current and future assistive technologies

---

## Color Contrast

```
Normal text (< 18pt / < 14pt bold):  4.5:1 minimum
Large text (≥ 18pt / ≥ 14pt bold):   3:1 minimum
UI components and focus indicators:  3:1 minimum
Decorative elements:                 No requirement
```

**Common failures:**
- Gray placeholder text on white — almost always fails 4.5:1
- Light blue links on white
- Brand colors used directly on text — always verify, never assume

**Never communicate meaning through color alone:**
- Error fields: icon or text label, not just a red border
- Status indicators: label or pattern, not just a dot
- Charts: patterns or labels alongside color

---

## Semantic HTML

Use the right element — never a `<div>` when a semantic element exists.

| Purpose | Use | Not |
|---------|-----|-----|
| Primary actions | `<button>` | `<div onClick>` |
| Navigation links | `<a href>` | `<span onClick>` |
| Page regions | `<nav>` `<main>` `<header>` `<footer>` `<aside>` | `<div class="nav">` |
| Form controls | `<input>` `<select>` `<textarea>` | Styled divs |
| Headings | `<h1>`–`<h6>` in logical order | `<p class="big-text">` |
| Lists | `<ul>` `<ol>` `<dl>` | Divs with bullet characters |
| Tables | `<table>` with `<thead>` `<th scope>` | CSS grid pretending to be a table |

**Heading hierarchy:** One `<h1>` per page. Never skip levels. Headings define document structure, not visual size.

---

## ARIA

**First rule: don't use ARIA if native HTML works.**

```html
<!-- Icon-only controls — always label -->
<button aria-label="Close dialog">
  <XIcon aria-hidden="true" />
</button>

<!-- Loading state -->
<button aria-busy="true" aria-disabled="true">
  <Spinner aria-hidden="true" /> Saving...
</button>

<!-- Accessible disabled (still focusable for screen readers) -->
<button aria-disabled="true" onClick={handleDisabledClick}>Save</button>

<!-- Live regions — dynamic content announcements -->
<div aria-live="polite" aria-atomic="true">
  <!-- Toast messages injected here -->
</div>
<div aria-live="assertive">
  <!-- Critical errors, urgent alerts -->
</div>

<!-- Dialogs -->
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Delete project?</h2>
</div>

<!-- Form errors — linked to input -->
<input
  id="email"
  type="email"
  aria-invalid="true"
  aria-describedby="email-error"
/>
<p id="email-error" role="alert">Enter a valid email address</p>

<!-- Expandable sections -->
<button aria-expanded="false" aria-controls="panel-id">
  Show details
</button>
<div id="panel-id" hidden>...</div>

<!-- Progress -->
<div role="progressbar" aria-valuenow="65" aria-valuemin="0" aria-valuemax="100">
  65%
</div>

<!-- Status messages (non-urgent feedback) -->
<div role="status" aria-live="polite">
  3 results found
</div>
```

**Dynamic content rules:**
- Use `aria-live="polite"` for non-urgent updates (search results, status messages)
- Use `aria-live="assertive"` for critical errors only — it interrupts the user
- Use `role="alert"` for form validation errors (shorthand for assertive live region)
- Use `role="status"` for confirmations (shorthand for polite live region)
- When content updates without a page reload, announce the change

---

## Keyboard Navigation

Every interactive element must be reachable and operable via keyboard.

**Tab order:** Follows visual reading order (LTR, top-to-bottom). Skip links at the top of every page.

**Required keyboard behaviors:**

| Component | Keys |
|-----------|------|
| Buttons / links | Enter, Space (buttons only) |
| Dropdowns | Enter to open, Arrows to navigate, Enter/Space to select, Escape to close |
| Modal dialogs | Focus trap inside, Escape to close, focus returns to trigger on close |
| Tabs | Arrow keys to switch, Tab to move into panel |
| Checkboxes | Space to toggle |
| Radio groups | Arrow keys to select, Tab to next group |
| Sliders | Arrows to increment/decrement, Home/End for min/max |
| Combobox/autocomplete | Arrows to navigate suggestions, Enter to select, Escape to close |
| Date pickers | Arrows within calendar, Escape to close |
| Tree views | Arrows to navigate, Enter to select, Space to expand/collapse |

**Focus management:**
- Modal opens: focus moves to first interactive element inside
- Modal closes: focus returns to the element that triggered it
- Dynamic content loads: move focus to new content or announce via `aria-live`
- After form submission error: focus moves to the first error field

**Focus indicator — never remove, always replace:**
```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  border-radius: 2px;
}
/* Remove for mouse users only, keep for keyboard */
:focus:not(:focus-visible) {
  outline: none;
}
```

---

## Modern Interaction Primitives

### Modal focus trapping — use `inert`
No longer requires complex JavaScript. The `inert` attribute prevents all interaction
with background content while a modal is open:

```html
<!-- When modal is open -->
<main inert><!-- Everything behind modal is non-interactive and non-focusable --></main>

<dialog open>
  <h2>Modal Title</h2>
  <!-- Focus stays inside automatically -->
</dialog>
```

Or use the native `<dialog>` element which handles focus trapping natively:
```js
const dialog = document.querySelector('dialog');
dialog.showModal(); // Opens with focus trap, closes on Escape
```

### Tooltips and dropdowns — use the Popover API
For non-modal overlays, use native popovers instead of custom JS solutions:

```html
<button popovertarget="menu">Open menu</button>
<div id="menu" popover>
  <button>Option 1</button>
  <button>Option 2</button>
</div>
```

Benefits: light-dismiss (click outside closes automatically), proper top-layer stacking,
no z-index wars, keyboard accessible by default. Well-supported in all modern browsers.

### Roving tabindex for component groups
For tabs, menu items, and radio groups — one item is tabbable at a time;
arrow keys move within the group; Tab moves to the next component entirely:

```html
<div role="tablist">
  <button role="tab" tabindex="0">Tab 1</button>   <!-- currently selected -->
  <button role="tab" tabindex="-1">Tab 2</button>
  <button role="tab" tabindex="-1">Tab 3</button>
</div>
```

Arrow keys programmatically move `tabindex="0"` between items. This prevents users
from having to Tab through every item in a large group.

---

## Touch Targets

- **Minimum: 44×44px** (Apple HIG, WCAG 2.5.5)
- **Android Material: 48×48px**
- Spacing between targets: minimum 8px to prevent mis-taps
- Add padding to reach target size without changing visual size:

```css
.icon-button {
  /* Visual size: 20px icon */
  /* Touch target: 44px */
  padding: 12px;
}
```

---

## Images & Media

```html
<!-- Informative: describe what it shows -->
<img src="chart.png" alt="Bar chart showing 40% revenue increase in Q3" />

<!-- Decorative: empty alt, screen reader skips it -->
<img src="swoosh.png" alt="" role="presentation" />

<!-- Complex (charts, diagrams): extended description -->
<img src="arch.png" alt="System architecture diagram"
     aria-describedby="arch-desc" />
<p id="arch-desc" class="sr-only">Three tiers: client, API gateway, and database...</p>

<!-- Icon inside button — hide from screen reader -->
<button aria-label="Search">
  <SearchIcon aria-hidden="true" />
</button>
```

Video: captions required. Audio: transcripts required.
Animated GIFs > 5 seconds: provide pause control.

---

## Forms

Every input needs a label. No exceptions. No placeholder-as-label.

```html
<!-- Preferred: explicit label -->
<label for="email">Email address</label>
<input id="email" type="email" name="email"
       aria-describedby="email-hint" required />
<p id="email-hint">We'll send your receipt here</p>

<!-- Error state -->
<label for="email">Email address</label>
<input id="email" type="email"
       aria-invalid="true"
       aria-describedby="email-error" />
<p id="email-error" role="alert">Enter a valid email address</p>

<!-- Required fields -->
<label for="name">
  Full name
  <span aria-hidden="true"> *</span>
  <span class="sr-only">(required)</span>
</label>
<input id="name" type="text" required />
```

**Form error handling checklist:**
- [ ] Error announced via `role="alert"` or `aria-live="assertive"`
- [ ] Error message linked to input via `aria-describedby`
- [ ] `aria-invalid="true"` on the input
- [ ] Focus moves to first error field on submit
- [ ] Error conveys what to do, not just that something is wrong
- [ ] Error persists until actually fixed — don't clear on blur

---

## Cognitive Accessibility

- **Reduce cognitive load:** One primary action per screen
- **Predictability:** Consistent navigation, consistent patterns throughout
- **Plain language:** Short sentences, common words, active voice, grade 8 or below
- **Time limits:** Warn before sessions expire; allow extension
- **Motion:** Always respect `prefers-reduced-motion`
- **Error recovery:** Never require re-entering all data after an error
- **Progress:** Always show step count in multi-step flows

---

## Screen Reader Utility Class

```css
/* Visually hidden but accessible to screen readers */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

---

## Pre-Delivery Checklist

- [ ] Color contrast passes 4.5:1 normal text, 3:1 large text / UI elements
- [ ] All interactive elements keyboard reachable in logical order
- [ ] Focus indicator visible on all interactive elements
- [ ] All images have appropriate alt text
- [ ] All form inputs have associated labels
- [ ] Error messages linked to inputs via `aria-describedby`
- [ ] Modals trap focus and return focus on close
- [ ] Dynamic content updates announced via `aria-live` or `role="alert"`
- [ ] No meaning conveyed by color alone
- [ ] `prefers-reduced-motion` respected
- [ ] Touch targets minimum 44×44px
- [ ] Page has a logical heading hierarchy (one h1, no skipped levels)
- [ ] Skip-to-main-content link at top of page

---

## Anti-Patterns

- `outline: none` without a visible replacement — makes keyboard navigation invisible
- `<div role="button">` when `<button>` exists — misses built-in keyboard behavior
- Placeholder text as the only label — disappears, fails contrast, fails screen readers
- Color-only status indicators without text or icon
- Auto-playing media without controls
- Opening links in new tabs without warning
- Click targets smaller than 44×44px
- Focus traps outside modals — users get stuck
- `aria-hidden="true"` on elements that still receive focus
- Removing semantic list markup to fix spacing
- `aria-live="assertive"` for non-critical updates — interrupts unnecessarily
- Missing `role="alert"` on form errors — users don't hear them
- Dynamic content that updates silently — screen readers never announce it
