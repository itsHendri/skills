---
name: design-system
description: >
  Build, document and govern a design system on one naming scheme — three layers
  (background, card, foreground), hover and pressed on every colour that acts, one inactive
  set, a primary/secondary/tertiary hierarchy, brand in three levels — with Atomic Design
  for components. Use when the user mentions: design
  system, design tokens, variables, component library, pattern library, UI kit, style guide,
  atomic design, atoms/molecules/organisms, Storybook, dark mode setup, or asks to create,
  audit or extend a component. Apply whenever building reusable UI, even if the words are
  not used.
---

# Design system

A design system is three things together: a design language (the visual and
interaction principles), a component library (built, reusable pieces), and
documentation (usage, do/don't, governance). This skill gives all three one
vocabulary — the naming scheme — so a token, a component and a sentence in the
docs all say the same thing.

The scheme is in `references/NAMING.md`. Read it before writing any variable.

## 1. The variables

Every colour is named for what it is for, how much weight it carries, and
when it applies. Nothing else goes in a name.

```
--{role}[-{level}][-{state}]      --{role}-foreground for what sits on it
```

| | Names |
|---|---|
| Layers | `--background` (page) · `--card` (contained) · `--foreground` (text, icons, strokes) |
| Hierarchy | bare name is primary; `-secondary`, `-tertiary` are quieter: `--foreground-tertiary`, `--stroke-secondary`, `--card-secondary` |
| States | `-hover`, `-pressed` on anything that acts; `--focus` is a ring, not a colour with states |
| Inactive | `--inactive`, `--inactive-foreground` — one set, applied to anything switched off |
| Brand | `--brand`, `--brand-secondary`, `--brand-tertiary` (solid, tinted, text-only), each with states and `-foreground` |
| Status | `--success` `--warning` `--danger` `--info`, each with states and `-foreground` |
| Rhythm | `--space-1…8`, `--radius-sm` `--radius` `--radius-lg` `--radius-full` |
| Type | `--text-sm/base/lg/xl/2xl`, `--font-sans`, `--font-mono` |
| Elevation | `--shadow-card`, `--shadow-overlay` — a raised surface is a card with a shadow |

Two tiers, not three. **Primitives** — a palette of ramps like `blue-500` —
exist only to generate the named values and never appear in a component or a
stylesheet. **The named variables** are what everything uses. There are no
component tokens: when a component needs its own decision, that decision is a
level or a state, not a new role. `--button-bg` does not exist; a button uses
`--brand`.

Dark mode is the same names with other values, under both hooks a project
might set — `:root.dark` (next-themes, shadcn/ui, Tailwind's manual variant)
and `:root[data-theme="dark"]` (Bootstrap, Pico, most vendor systems) — with
the system preference as the fallback. Never a second set of classes.

## 2. Setting a project up

1. Copy `references/tokens.css` into the project's styles and replace the
   placeholder values with the project's own. The names are the contract; the
   numbers are not.
2. With Tailwind v4, use `references/tailwind.css`: it imports the tokens and
   maps them into Tailwind's namespaces with `@theme inline`, so the utilities
   read as the names do (`bg-card hover:bg-card-hover`, `text-foreground-secondary`,
   `border-stroke`, `disabled:bg-inactive`, `focus-visible:ring-focus`) and a
   dark hook repaints them without a second class.
3. Put the block from `references/CONTEXT.md` into the project's `CLAUDE.md`
   (or AGENTS.md), filled in with the components that exist, so every later
   session lands on the same names.
4. Check the result in the browser: every colour on the page resolves to one
   of these names, foreground passes contrast on both background and card, and
   setting the dark hook on `<html>` repaints the page with no other change.
   A tool that reads a page's variables should list exactly these names,
   grouped by what they hold.

## 3. Components: Atomic Design

Every component request maps to a level. Name the level before building.

| Level | Definition | Examples |
|---|---|---|
| Atom | Smallest functional unit | Button, Label, Input, Icon, Badge, Avatar, Divider, Toggle |
| Molecule | 2+ atoms forming one single-purpose unit | Search field, Form group, Card header, Nav item |
| Organism | A section made of molecules and atoms | Site header, Product card, Data table, Settings panel |
| Template | A page-level skeleton with placeholder content | Dashboard shell, Onboarding layout |
| Page | Template plus real content | The screen as users see it |

Design atoms first; never design a page without knowing its atoms. If a
molecule has its own internal layout logic, it is an organism.

### The component contract

```
Name:          [ComponentName]
Atomic level:  atom / molecule / organism
Level:         primary / secondary / tertiary   (→ --brand, --brand-secondary, --brand-tertiary)
Intent:        default / success / warning / danger / info
Size:          sm / md / lg
States:        default, hover, pressed, focus (ring), inactive, loading, invalid, empty
Variables:     the names it uses — never a raw value
Accessibility: role, keyboard behaviour, 44px touch target on mobile, contrast on background and on card
Do / Don't:    one of each, at least
```

Hover and pressed come from the variable's own states. Inactive is the
inactive set plus `aria-disabled`. Focus is `--focus` as a ring.

### React and Tailwind output

```jsx
// Variants as an object, never inline conditionals. Classes follow the names.
const levels = {
  primary:   'bg-brand text-brand-foreground hover:bg-brand-hover active:bg-brand-pressed',
  secondary: 'bg-brand-secondary text-brand-secondary-foreground hover:bg-brand-secondary-hover active:bg-brand-secondary-pressed',
  tertiary:  'bg-brand-tertiary text-brand-tertiary-foreground hover:bg-brand-tertiary-hover active:bg-brand-tertiary-pressed',
  danger:    'bg-danger text-danger-foreground hover:bg-danger-hover active:bg-danger-pressed',
};
const sizes = { sm: 'px-3 py-1 text-sm', md: 'px-4 py-2 text-base', lg: 'px-5 py-3 text-lg' };
const shared = 'rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus disabled:bg-inactive disabled:text-inactive-foreground';
```

- Tailwind core utilities only, on the mapped names; no `bg-blue-600`.
- `lucide-react` for icons.
- Every level and size combination; `aria-disabled` and `aria-busy` on interactive states.
- Export as default.

## 4. Documentation

Follow the tabbed template Carbon uses, one component per page:

1. **Usage** — when to use it, when not to, content guidelines
2. **Style** — anatomy; which variables carry its colour, spacing and type
3. **Code** — props, variants, examples
4. **Accessibility** — keyboard, ARIA, screen-reader notes

Every component has at least one Do and one Don't. Document *why* a
component exists, not only how to use it.

## 5. Governance

- A variable's value is a public API: changing `--brand` changes every button.
  Change the value in one place; never re-point a usage.
- No raw hex or px in components, ever. If a value is needed that no variable
  names, add a level or a state — and say why in the docs.
- Component names imply their atomic level. A breaking change to an atom means
  auditing every molecule and organism that uses it.
- Dark mode redefines the named variables only, never the primitives that
  generated them. Alpha is a smell: define an explicit overlay colour instead.
- Hand-off names variables, never values: *"Background: `--card`, padding
  `--space-4`, radius `--radius`"*, not *"#fff, 16px, 8px"*.

## 6. Token pipeline

```
Palette (Figma variables, or ramps generated from a few seed colours)
  → the named variables, light and dark (tokens.css)
    → Tailwind @theme (tailwind.css) · CSS custom properties · native constants
```

Exchange formats such as W3C design tokens (DTCG JSON) carry the names as
they are; a tool that reads or writes them should round-trip the scheme
without renaming anything.

## 7. Anti-patterns

- Raw hex or px in a component.
- A hue in a variable name (`--blue-500` in code) or a component in one (`--button-bg`).
- A second set of classes for dark mode instead of the same names with other values.
- An organism built before its atoms are defined.
- A component that only works in one place: that is a template element.
- Documentation that shows the happy state only.
