---
name: design-handoff
description: >
  Expert skill for technical design-to-code handoff — the artifacts that go into Figma
  for developers. Use when the user needs to produce or improve: Figma annotations,
  design token specs, CSS value mappings, component state documentation, responsive
  breakpoint specs, asset export settings, Dev Mode checklists, behavior specification
  format, or acceptance criteria. Also triggers for: token pipelines (Figma → JSON →
  CSS), naming layers for handoff, marking assets for export, and any question about
  how to prepare a Figma file so a developer can build from it without a sync call.
  This skill covers the TECHNICAL spec artifacts — for communicating decisions and
  presenting design work to humans, use design-communication instead.
---

# Design Handoff & Design-to-Code

The #1 handoff failure: sharing pixels without behavioral logic.
Developers don't just need to know what it looks like — they need to know how it behaves,
what it does in every state, and why it was designed that way.

---

## What a Complete Handoff Includes

Incomplete handoffs cause rework. A complete handoff has six layers:

| Layer | What it covers |
|-------|---------------|
| **Visual specs** | Spacing, color (as token names), typography, radius, shadow |
| **Behavior annotations** | What happens on click, hover, scroll, swipe, keyboard |
| **State definitions** | Every state designed: default, hover, focus, active, disabled, loading, error, empty |
| **Responsive specs** | Layout at each breakpoint; what changes, what doesn't |
| **Content specs** | Max/min character counts, image aspect ratios, copy rules |
| **Edge cases** | Empty state, very long content, zero items, many items, offline, error |

---

## Design Token Handoff

Always reference tokens by name — never raw values.

**Wrong:**
```
Background: #3B82F6
Padding: 16px
Border radius: 8px
Font size: 14px / weight: 500
```

**Right:**
```
Background: --color-primary
Padding: --space-4 (16px)
Border radius: --radius-md (8px)
Font: --font-label-sm (14px / 500 / 1.2)
```

**Token pipeline (Figma → Code):**
```
Figma Variables
  → Export as JSON (Tokens Studio / Figma Variables API)
    → Transform (Style Dictionary / Token Transformer)
      → Platform outputs:
          CSS custom properties
          Tailwind config
          iOS Swift constants
          Android XML resources
```

---

## Annotation Standards

Every component handoff should annotate:

### Spacing
- Use token names with pixel equivalents in parentheses
- Annotate all four sides of padding, and gaps between elements
- Note which spacing values are fixed vs. flexible

### Color
- Token name + hex for reference
- State-specific colors (hover, error, focus ring)

### Typography
- Token name + rendered value (size/weight/line-height/letter-spacing)
- Where text truncates, wraps, or scales

### Interactions
Use plain-language behavioral notes:
```
On hover:    Background → --color-surface-hover, transition 150ms ease
On click:    Scale 0.97, 100ms — scale back 150ms
On focus:    Show 2px --color-primary ring, 2px offset
On disabled: Opacity 40%, pointer-events none, aria-disabled="true"
Loading:     Replace label with spinner after 300ms (prevent flash)
```

### Responsive behavior
For each breakpoint, annotate:
```
< 768px (mobile):
  - Layout: single column
  - Navigation: hidden, accessible via hamburger → bottom sheet
  - Card grid: 1 column
  - Font sizes: scale down 2px per level

768px–1024px (tablet):
  - Card grid: 2 columns
  - Side nav: collapsed (icon-only)

≥ 1024px (desktop):
  - Card grid: 3–4 columns
  - Side nav: expanded
```

---

## Asset Export Specs

| Asset type | Format | Sizes |
|------------|--------|-------|
| Raster images (photos) | WebP + JPEG fallback | 1x, 2x |
| UI illustrations | SVG (preferred) | — |
| Icons | SVG sprite or icon font | 16, 20, 24px |
| App icons | PNG | All required platform sizes |
| OG / social images | PNG or JPEG | 1200×630px |

**SVG rules:**
- Remove unnecessary `width`/`height` attributes — let CSS control size
- Use `currentColor` for icon fill/stroke so they inherit text color
- Name layers descriptively in Figma before export

---

## Figma Dev Mode Handoff Checklist

Before marking a frame ready for dev:
- [ ] All layers named (no "Frame 247" or "Rectangle 12")
- [ ] Components used, not detached instances
- [ ] All tokens applied via styles/variables (no raw values)
- [ ] All states designed (hover, focus, active, disabled, loading, error)
- [ ] Mobile frame exists alongside desktop frame
- [ ] Interactions annotated in sticky notes or annotations
- [ ] Edge cases noted (empty, overflow, error)
- [ ] Assets marked for export
- [ ] Prototype links attached where flow matters

---

## Behavior Specification Format

For complex components, use this format in annotations or a spec doc:

```
Component: [Name]
Trigger:   [User action — click, hover, keyboard, scroll]
Condition: [When does this behavior apply?]
Action:    [What the UI does]
Duration:  [Animation timing if applicable]
State after: [What state is the component in after the action?]

Example:
Component: Dropdown menu
Trigger:   Click on trigger button
Condition: Menu is closed
Action:    Menu opens below trigger, first item receives focus
Duration:  200ms, ease-decelerate
State after: Open
```

---

## Common Handoff Mistakes & Fixes

| Mistake | Fix |
|---------|-----|
| Mobile design missing | Always design and hand off mobile alongside desktop |
| States not all designed | Use a component state matrix — row per component, column per state |
| Raw values instead of tokens | Audit Figma styles — every value should map to a variable |
| No edge case annotations | Add a "Content rules" section: max chars, image ratios, item limits |
| Annotation only on design, not behavior | Add interaction notes in sticky notes or a linked spec doc |
| Assets not exported / wrong format | Set export settings in Figma before handoff; mark SVGs for icons |
| No acceptance criteria | Define "done": what behavior must be implemented for the component to ship |

---

## Acceptance Criteria Template

Include with every component handoff:

```
Component: [Name]
Done when:
  ✓ All visual states match the spec (default, hover, focus, active, disabled, loading, error)
  ✓ Keyboard navigation works as documented
  ✓ Screen reader announces component correctly
  ✓ Responsive layout matches spec at sm/md/lg breakpoints
  ✓ Animation timing matches motion spec
  ✓ Tokens used in code match token names in spec
  ✓ Edge cases handled: empty, overflow, error state
  ✓ Passes color contrast at AA
```

---

## Anti-Patterns

- Handing off only the happy state with "the other states should be obvious"
- Using raw hex colors instead of token names — breaks theming and dark mode
- Desktop-only designs — #1 handoff failure identified by engineering teams
- Designs that look right at one screen size but were never tested at breakpoints
- Annotating only spacing, not behavior — spatial specs without interaction specs
- "Final" designs that haven't accounted for real content (Lorem Ipsum in handoff)
- Missing empty states — developers will implement something, probably wrong
- Acceptance criteria that says "looks like the design" — that's not testable
