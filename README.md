# My UX Skill System

I work across design, frontend engineering, and product — moving between Figma, React, and
AI tools like Claude and Cursor. This is my personal skill system: 13 focused files that load
expert-level guidance exactly when a task needs it, without dragging irrelevant context into
every session.

## Why modular

One large skill file means every task loads everything — relevant or not. Smaller focused
files load only what the task actually needs. Each skill has a single responsibility, a
precise trigger, and its own anti-patterns. Together they cover the full arc from early
research and design decisions through to shipping production frontend code.

## How to use this system

Skills activate on language. When you describe a task — in any natural phrasing — the matching
skill loads. You don't need to name the skill or know it exists. The trigger descriptions in
each file show the vocabulary that skill responds to, so you can see which will activate for a
given task and deliberately invoke more than one when a task spans multiple domains.

## The 13 skills

### Core UX (9)

| Skill | What it owns |
|---|---|
| [`ux-foundations`](skills/ux-foundations/SKILL.md) | Base layer, always active. The shared mental models, heuristics, and decision frameworks underpinning every other skill. |
| [`design-systems`](skills/design-systems/SKILL.md) | Component libraries and tokens — Atomic Design, three-tier token architecture, component contracts, variant logic, the system context file. |
| [`ux-flows`](skills/ux-flows/SKILL.md) | How users move through a product — flows, IA, navigation, screen-to-screen logic, and full state management (loading, error, offline, empty, permission-denied). |
| [`visual-ui`](skills/visual-ui/SKILL.md) | What the interface looks and feels like — layout, colour, typography, spacing, grid, dark mode. Enforces distinctive production-grade quality, never generic AI aesthetics. |
| [`motion-design`](skills/motion-design/SKILL.md) | How the interface moves — animation principles, motion tokens, easing, per-component timing, and the performance constraints behind them. |
| [`content-ux-writing`](skills/content-ux-writing/SKILL.md) | Every word in the interface — labels, errors, empty states, dialogs, voice and tone. Copy is interaction design, not afterthought. |
| [`accessibility`](skills/accessibility/SKILL.md) | Cross-cutting quality layer, auto-applies to any UI output. WCAG 2.1 AA, semantic HTML, ARIA, keyboard, focus, contrast, touch targets. |
| [`design-handoff`](skills/design-handoff/SKILL.md) | The Figma-facing side of handoff — token specs, behaviour annotations, state docs, breakpoints, asset export, Dev Mode checklists, acceptance criteria. |
| [`prototyping`](skills/prototyping/SKILL.md) | Figma craft and prototype strategy — fidelity decisions, Auto Layout, variants, file organisation, Smart Animate, usability testing basics. |

### Designer-Developer (4)

| Skill | What it owns |
|---|---|
| [`design-to-react`](skills/design-to-react/SKILL.md) | Translating Figma into production React — component architecture, props, state patterns, Figma-to-Tailwind, accessibility in code. |
| [`design-communication`](skills/design-communication/SKILL.md) | Communicating decisions to engineers and PMs — tradeoff framing, specs, dev tickets, reviews, handling pushback, async formats. |
| [`technical-design`](skills/technical-design/SKILL.md) | The CSS knowledge that makes designs buildable — box model, flexbox vs. grid, custom properties as the token layer, what's expensive to animate. |
| [`design-research-synthesis`](skills/design-research-synthesis/SKILL.md) | Observations → patterns → insights → opportunities → recommendations. Affinity mapping, analytics as evidence, prioritisation. |

## How the skills work together

- **Designing a new component** — `ux-foundations` → `design-systems` → `visual-ui` → `accessibility` → `design-handoff`
- **Building it in code** — `design-systems` → `design-to-react` → `technical-design`
- **Shipping a feature end-to-end** — `ux-flows` → `prototyping` → `content-ux-writing` → `design-handoff` → `design-communication`
- **Getting alignment with the team** — `design-research-synthesis` → `design-communication`
- **Pushing back on a feasibility concern** — `technical-design` → `design-communication`
- **Auditing existing UI for quality** — `ux-foundations` → `accessibility` → `content-ux-writing` → `visual-ui`

## What's inside every skill file

Each file is consistent so they're easy to scan and extend:

- **Trigger description** — the exact language and scenarios that activate it
- **Core principles** — the non-negotiables for that domain
- **Practical rules and patterns** — specific, actionable, with real examples
- **Anti-patterns** — what not to do and why

---

Written up at [hendri.design/notes/ai-skill-system-for-designers](https://hendri.design/notes/ai-skill-system-for-designers).
