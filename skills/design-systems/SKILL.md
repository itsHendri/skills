---
name: design-systems
description: >
  Expert skill for building, documenting, and governing design systems using Atomic Design
  methodology (Brad Frost). Use when the user mentions: design system, component library,
  pattern library, UI kit, style guide, design tokens, atomic design, atoms/molecules/organisms,
  Storybook, or asks to create/audit/extend a component. Also triggers for token architecture,
  variant logic, component naming, and system governance questions. Always apply when building
  reusable UI components — even if the user hasn't used the word "design system."
---

# Design Systems

Design systems are not just component libraries. They are the combination of:
1. **Design language** — Visual and interaction principles
2. **Component library** — Built, coded, reusable UI pieces
3. **Documentation** — Usage guidelines, do/don't examples, governance rules

---

## Atomic Design Hierarchy

Every component request maps to a level. Always identify and label the level before building.

| Level | Definition | Examples |
|-------|-----------|---------|
| **Atom** | Smallest functional unit; cannot be broken down further | Button, Label, Input, Icon, Badge, Avatar, Divider, Toggle |
| **Molecule** | 2+ atoms forming a single-purpose unit | Search field, Form group, Card header, Nav item, Price display |
| **Organism** | Complex section made of molecules + atoms | Site header, Product card, Data table, Settings panel |
| **Template** | Page-level layout skeleton with placeholder content | Dashboard shell, Onboarding layout, Article page |
| **Page** | Template + real representative content | Final rendered screen as users see it |

**Golden rule:** Design atoms first. Never design a page without knowing its atoms.
**Anti-pattern:** "Molecule creep" — if a molecule has its own internal layout logic, it's an organism.

---

## Design Token Architecture

Three-tier system. Always follow this structure — never use raw values in components.

```
Tier 1 — Primitive tokens (raw values, never used directly)
  --blue-500: #3B82F6
  --space-4: 16px

Tier 2 — Semantic tokens (purpose-driven, used in components)
  --color-primary: var(--blue-500)
  --space-component-padding: var(--space-4)

Tier 3 — Component tokens (optional per-component overrides)
  --btn-primary-bg: var(--color-primary)
```

### Required Token Sets

**Color**
```
--color-primary / --color-primary-hover / --color-primary-subtle
--color-bg / --color-surface / --color-surface-raised
--color-border / --color-border-strong
--color-text-primary / --color-text-secondary / --color-text-muted
--color-success / --color-warning / --color-error / --color-info
```

**Spacing** — 4px base unit: 4, 8, 12, 16, 24, 32, 48, 64, 96px

**Typography** — Define size + weight + line-height for: Display, H1–H4, Body-lg, Body, Body-sm, Caption, Label, Code

**Radius** — sm (4px), md (8px), lg (16px), xl (24px), full (9999px)

**Shadow** — sm (subtle), md (cards), lg (dropdowns), xl (modals), focus (3px ring)

**Motion** — fast (100ms), normal (200ms), slow (300ms) + easing curves

---

## Component Contract

Every component must define:

```
Name:         [ComponentName]
Atomic level: [Atom / Molecule / Organism]
Variants:     size (sm/md/lg), intent (primary/secondary/ghost/danger)
States:       default, hover, focus, active, disabled, loading, error, empty, success
Props:        [list with types and defaults]
Tokens used:  [list semantic token names — never raw values]
Accessibility: ARIA role, keyboard behavior, min touch target (44px mobile), contrast ratio
Do:           [one or two correct usage examples]
Don't:        [one or two incorrect usage examples]
```

---

## React/JSX Output Standard

```jsx
// Group variants as an object — never inline conditionals
const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
  secondary: "bg-white text-gray-900 border border-gray-300 hover:bg-gray-50",
  ghost: "text-gray-600 hover:bg-gray-100",
  danger: "bg-red-600 text-white hover:bg-red-700",
}

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
}
```

- Use Tailwind core utilities only (no compiler extensions)
- Use `lucide-react` for icons
- Always include all variant + size combinations
- Export as default
- Include `aria-disabled`, `aria-busy` on interactive states

---

## Documentation Standard

Follow IBM Carbon's tabbed template — the industry standard:

1. **Usage** — When to use this component, when not to, content guidelines
2. **Style** — Anatomy, spacing, color, typography specs
3. **Code** — Props, variants, code examples
4. **Accessibility** — Keyboard behavior, ARIA, screen reader notes

Every component needs at least one **Do** and one **Don't** example.

---

## Governance Rules

- Token changes propagate everywhere — treat them like a public API
- Never hardcode values in components that should be tokens
- Component names must imply their atomic level to all team members
- Breaking changes to atoms require auditing all molecules and organisms that use them
- Document *why* a component exists, not just how to use it (Atlassian's most-cited differentiator)

---

## System Context File

Maintain a short context file that gets pasted into any AI session generating UI.
This keeps every output aligned with your design system — preventing drift across sessions.

```
## Design System Context

Token → Tailwind class mappings:
- Primary:    bg-primary / text-primary / border-primary
- Surface:    bg-surface
- Border:     border-border
- Text:       text-foreground / text-muted
- Error:      text-destructive / bg-destructive/10

Existing components (don't recreate):
- Button: intent (primary/secondary/ghost/danger), size (sm/md/lg)
- Input:  size (sm/md/lg), state (default/error/disabled)
- Badge:  intent (default/success/warning/error)

Typography scale:
- H1: text-4xl font-bold  |  H2: text-2xl font-semibold
- Body: text-base         |  Label: text-sm font-medium

Rules:
- No raw hex values or hardcoded px — use token classes only
- Spacing: 4px grid (space-1 through space-24)
- Radius: rounded-sm / rounded-md / rounded-lg
- Always include all interactive states
```

---

## Anti-Patterns

- Using raw hex values or pixel numbers directly in components
- Building organisms without first defining their atoms
- Creating components that only work in one place — that's a template element, not an organism
- Skipping the token layer and theming directly in component classes
- Documentation that only shows the happy state — all variants and states must be shown
