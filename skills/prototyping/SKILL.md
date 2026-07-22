---
name: prototyping
description: >
  Expert skill for prototyping, Figma craft, prototype fidelity decisions, and design tool
  workflows. Use when the user asks about: prototyping, prototype fidelity, Figma techniques,
  interactive prototypes, clickable mockups, prototype flows, design file organization,
  component structure in Figma, auto layout, variants, prototyping tools (Figma, ProtoPie,
  Framer, Principle), or asks how to build, structure, or present a prototype. Also triggers
  for questions about when to prototype vs. ship, what fidelity level to use, or how to
  validate a design before development.
---

# Prototyping & Design Tools

Prototypes exist to answer questions. Before building one, define the question.
The fidelity of a prototype should match the fidelity of the question.

---

## Prototype Fidelity Decision Framework

| Fidelity | Use when | Tools |
|----------|----------|-------|
| **Sketch / paper** | Exploring structure and flow, early ideation, stakeholder alignment on concept | Paper, Whiteboards, Excalidraw |
| **Lo-fi wireframe** | Testing information architecture and flow logic, before visual design | Figma (gray boxes), Balsamiq |
| **Mid-fi** | Validating interaction patterns, flow testing with users | Figma with basic components |
| **Hi-fi** | Stakeholder sign-off, developer reference, usability testing | Figma with full design system |
| **Code prototype** | Testing real performance, complex interactions, animation | Framer, React, ProtoPie |

**Rule:** Don't over-prototype. A paper sketch can answer a flow question in 20 minutes.
A hi-fi Figma prototype to answer the same question wastes hours.

---

## What Every Prototype Must Cover

Regardless of fidelity, a complete prototype includes:

**Before first screen:**
- [ ] User goal defined (what task is this prototype testing?)
- [ ] Entry point clear (where does the user start?)
- [ ] Real or representative content (no Lorem Ipsum past lo-fi)
- [ ] Information architecture validated

**During the flow:**
- [ ] All decision points mapped (every branch the user can take)
- [ ] All states represented: loading, error, empty, success
- [ ] Mobile AND desktop versions (don't prototype desktop-only)
- [ ] Edge cases covered: empty list, very long names, zero permissions, network error

**For handoff:**
- [ ] Acceptance criteria defined per screen/flow
- [ ] Annotation layer with behavioral notes
- [ ] Token names referenced, not raw values

---

## Figma Craft Standards

### Auto Layout
Use Auto Layout on everything. Manual pinning is a maintenance nightmare.

```
Direction:     Horizontal / Vertical
Alignment:     Top-left as default; justify for stretching
Padding:       Use token values (4, 8, 12, 16, 24, 32px)
Gap:           Consistent within a component; use "Auto" for flexible gaps
Resizing:      Fixed for atoms, Fill for molecules stretching in a parent
```

### Components & Variants

Structure every component as:
```
Component set (Variants)
  └── Variant = [Property=Value, Property=Value]
      e.g. Size=md, Intent=primary, State=default
```

**Property naming conventions:**
- `Size`: sm / md / lg
- `Intent` or `Variant`: primary / secondary / ghost / danger
- `State`: default / hover / focus / active / disabled / loading / error / empty / success
- `Has icon`: true / false
- `Icon position`: left / right

**Rules:**
- Name every layer — no "Frame 247" or "Group 12"
- Create components for anything used more than twice
- Use variables/styles for all colors, typography, and spacing
- Never detach instances in a working file — create a new variant instead

### File Organization

```
📁 [Project Name]
  📄 Cover (thumbnail for project overview)
  📄 🗂 Design System (atoms, molecules, tokens)
  📄 📐 Wireframes (lo-fi flows)
  📄 🎨 UI Design (hi-fi screens, all states)
  📄 🔄 Prototype (connected flows for testing/handoff)
  📄 📋 Specs & Handoff (annotation layer, export assets)
```

**Page naming:** Use emoji prefixes to make page type scannable at a glance.

### Frames vs. Groups
- Use frames for: components, screen containers, sections, any element that needs constraints
- Use groups for: temporary grouping during editing only
- Set frame background colors rather than adding background rectangles inside

---

## Prototyping Interactions in Figma

### Interaction Anatomy
```
Trigger → Action → Destination + Animation

Trigger:     On click / On hover / On drag / Key press / Mouse enter / After delay
Action:      Navigate to / Open overlay / Scroll to / Back / Close overlay
Animation:   Instant / Dissolve / Move in / Move out / Push / Slide / Smart animate
```

### Smart Animate (for realistic motion)
Works when layers have the same name between frames. Use for:
- State transitions (button default → hover → clicked)
- Screen transitions that share elements
- Card expansion into detail view

Settings: 300ms / Ease out for entrances, 200ms / Ease in for exits

### Overlay vs. Navigate
- **Navigate:** New screen, changes URL (back button works)
- **Overlay:** Appears on top of current screen (modal, dropdown, tooltip)

---

## Prototype Flows to Always Build

For a complete product prototype:

1. **Onboarding flow** — from splash to first meaningful action
2. **Core task flow** — the primary thing users come to do
3. **Error flow** — what happens when the most common thing goes wrong
4. **Empty state** — what new users see before they have any data
5. **Settings / profile** — account management, critical settings
6. **Critical edge case** — the thing that breaks most similar products

---

## Testing Your Prototype

Before sharing with stakeholders or users:

**Internal review:**
- Walk through each flow yourself as if you're a first-time user
- Check that every interactive element has a connection
- Test on the actual device (Figma Mirror for mobile)
- Verify all states are reachable through the prototype

**Usability testing basics:**
- Give a task, not instructions ("Book a flight to Tokyo" not "Click the search button")
- Watch without intervening — silence is data
- 5 users will surface 85% of usability problems (Nielsen's law)
- Record or take notes; don't rely on memory

---

## Prototype Presentation

When presenting to stakeholders:
- Lead with context: "This prototype tests X user goal"
- State what's interactive and what isn't before they click
- Show the mobile version on a phone, not in a browser
- Share a direct Figma link, not a screenshot — let them click through
- Annotate the prototype with decision rationale, not just what it shows

---

---

## Dev-Ready Checklist

Before marking any frame ready for engineering:

- [ ] All layers named — no "Frame 247" or "Rectangle 12"
- [ ] Components used, not detached instances
- [ ] All tokens applied via Figma variables/styles — no raw values
- [ ] All states designed: hover, focus, active, disabled, loading, error, empty
- [ ] Mobile frame exists alongside desktop
- [ ] Interactions annotated (sticky notes or annotation layer)
- [ ] Edge cases noted: empty, overflow, very long strings, error
- [ ] Assets marked for export with correct format settings
- [ ] Prototype links attached where flow context matters
- [ ] Real content used — no Lorem Ipsum

---

## Asset Export Specs

| Asset type | Format | Notes |
|------------|--------|-------|
| Photos / raster | WebP + JPEG fallback | 1x and 2x |
| UI illustrations | SVG | Preferred — scales without quality loss |
| Icons | SVG | 16, 20, 24px variants |
| App icons | PNG | All required platform sizes |
| OG / social images | PNG or JPEG | 1200×630px |

**SVG rules:**
- Remove `width`/`height` attributes — let CSS control size
- Use `currentColor` for icon fill/stroke so they inherit text color
- Name all layers descriptively in Figma before export


## Anti-Patterns

- Hi-fi prototype before information architecture is validated
- Lorem Ipsum in anything shown to stakeholders or users
- Desktop-only prototype for a product that has mobile users
- Prototype with no defined test question — "make it clickable" is not a goal
- Over-prototyping — animating every micro-interaction before the flow is approved
- Detached instances — impossible to maintain as the design evolves
- Unnamed layers — makes developer handoff and collaboration painful
- Manual positioning instead of Auto Layout — breaks on resize
- Presenting desktop screens on mobile ("just imagine it smaller")
