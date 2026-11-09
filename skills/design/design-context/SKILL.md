---
name: design-context
description: >
  Skill for maintaining design consistency across sessions. Triggers whenever a design
  task begins and no project context has been provided — or when the user mentions:
  "remember my design decisions", "keep it consistent", "use my existing style",
  "same as before", or "use my design system". Also triggers when starting any new
  UI or component work where visual decisions (colors, spacing, fonts, depth) need
  to be consistent with prior work. Prompts the user to paste their design context
  block, or helps them build one if it doesn't exist yet.
---

# Design Context

Claude has no memory between conversations. Every session starts fresh. Without a
design context block, decisions made in a previous session — your spacing grid, your
color palette, your depth strategy, your component patterns — are gone.

This skill solves that. At the start of any design session, paste your context block.
Claude will load it and apply it consistently throughout.

---

## At the Start of Every Design Session

If the user is beginning UI or component work, ask once:

> "Do you have a design context block to paste? If not, I can help you build one."

If they paste it — load it, confirm what was found, and apply it throughout.
If they don't have one — run the setup below.

---

## Setup: Building a Context Block

Ask these questions to establish the project's design decisions.
Keep answers short and concrete — this is a reference, not a document.

```
1. What type of product is this?
   (SaaS dashboard / marketing site / mobile app / developer tool / e-commerce / other)

2. What's the visual direction?
   (Precision & density / Warmth & approachability / Sophistication & trust /
    Boldness & clarity / Utility & function / Data & analysis)

3. Typography
   - Heading font:
   - Body font:
   - Base size: (default: 16px)

4. Color palette
   - Primary:
   - Background:
   - Surface (cards):
   - Border:
   - Text primary:
   - Text muted:
   - Success / Warning / Error:

5. Spacing
   - Base grid: (default: 4px)
   - Component padding: (e.g. 16px / 24px)
   - Section spacing: (e.g. 48px / 64px)

6. Depth strategy
   - Borders only / Shadows only / Mixed
   - Border radius: (e.g. 8px components, 16px cards)

7. Component patterns established
   - Button heights:
   - Input heights:
   - Any existing components to reference:

8. What to avoid
   - (List any rejected directions, colors, patterns)
```

Once answered, format as a context block (see below) and tell the user to save it somewhere they can paste at the start of future sessions.

---

## The Context Block Format

```
## Design Context — [Project Name]

Type: [product type]
Direction: [visual direction]

Typography:
  Heading: [font name]
  Body: [font name]
  Base: 16px

Colors:
  Primary:    [token → value]
  Background: [token → value]
  Surface:    [token → value]
  Border:     [token → value]
  Text:       [token → value]
  Muted:      [token → value]
  Error:      [token → value]

Spacing:
  Grid: 4px base
  Component padding: [value]
  Section spacing: [value]

Depth:
  Strategy: [borders-only / shadows / mixed]
  Radius: [component value] / [card value]

Components:
  Button height: [sm / md / lg values]
  Input height: [value]
  [Any other established patterns]

Avoid:
  [Rejected directions or patterns]
```

---

## Applying the Context

Once loaded, apply these rules throughout the session:

- **Before every component:** Silently check decisions against the context block
- **Colors:** Reference by token name from the context — never introduce new raw values
- **Spacing:** Verify against the grid and established padding
- **Typography:** Use the defined font stack — don't introduce new typefaces
- **Depth:** Apply the stated strategy consistently — don't mix shadow and border approaches
- **New patterns:** If a new component needs a decision not in the context, make it consistent with existing decisions and flag it so the user can add it to their block

---

## Updating the Context

When a new pattern is established during a session, surface it:

> "We've established [pattern]. Add this to your context block:
> `[formatted addition]`"

This keeps the context block growing as the design system matures.

---

## Anti-Patterns

- Starting a design session without checking for context
- Introducing new fonts, colors, or spacing values that weren't in the context
- Making depth decisions (shadow vs. border) that contradict the stated strategy
- Forgetting to flag new patterns for the user to save
- Asking for context repeatedly in the same session — load it once and apply it throughout
