# Skills

A modular skill system: focused files that load expert-level guidance exactly when a task
needs it, without dragging irrelevant context into every session.

Currently 14 design, UX, and frontend skills. Process and other domains are in progress.

This repo is the **single source of truth**. Any copy elsewhere — a local `.claude/skills`
directory, a Claude project, a blog write-up — is a snapshot of this.

## Why modular

One large skill file means every task loads everything, relevant or not. Smaller focused files
load only what the task actually needs. Each skill has a single responsibility, a precise
trigger, and its own anti-patterns.

## How activation works

Skills activate on language. Describe a task in natural phrasing and the matching skill loads —
you don't need to name it. The `description` frontmatter in each `SKILL.md` lists the vocabulary
that triggers it, so you can see which fires for a given task and deliberately invoke more than
one when a task spans domains.

## The 14 skills

### Core UX (10)

| Skill | What it owns |
|---|---|
| [`ux-foundations`](skills/ux-foundations/SKILL.md) | Base layer, always active. Shared mental models, heuristics, decision frameworks. |
| [`design-systems`](skills/design-systems/SKILL.md) | Component libraries and tokens — Atomic Design, three-tier architecture, variant logic, governance, the token pipeline. |
| [`ux-flows`](skills/ux-flows/SKILL.md) | Flows, IA, navigation, screen-to-screen logic, and full state management. |
| [`visual-ui`](skills/visual-ui/SKILL.md) | Layout, colour, typography, spacing, dark mode — distinctive production-grade visuals. |
| [`motion-design`](skills/motion-design/SKILL.md) | Animation principles, motion tokens, easing, per-component timing. |
| [`content-ux-writing`](skills/content-ux-writing/SKILL.md) | Every word in the interface — labels, errors, empty states, voice and tone. |
| [`accessibility`](skills/accessibility/SKILL.md) | WCAG 2.1 AA baseline. Auto-applies to any UI output. |
| [`prototyping`](skills/prototyping/SKILL.md) | Figma craft, fidelity decisions, Dev Mode prep, asset export, prototype strategy. |
| [`ui-audit`](skills/ui-audit/SKILL.md) | Reviewing and critiquing *existing* UI — six lenses, prioritised findings. |
| [`design-context`](skills/design-context/SKILL.md) | Cross-session consistency — load a context block at the start of a design session. |

### Designer-Developer (4)

| Skill | What it owns |
|---|---|
| [`design-to-react`](skills/design-to-react/SKILL.md) | Figma into production React — architecture, props, state, Tailwind. |
| [`design-communication`](skills/design-communication/SKILL.md) | Framing decisions, specs, dev tickets, reviews, acceptance criteria, pushback. |
| [`technical-design`](skills/technical-design/SKILL.md) | The CSS and implementation knowledge that makes designs buildable and performant. |
| [`design-research-synthesis`](skills/design-research-synthesis/SKILL.md) | Research and analytics into prioritised design recommendations. |

## How the skills work together

- **Design a new component** — `ux-foundations` → `design-systems` → `visual-ui` → `accessibility`
- **Build it in code** — `design-systems` → `design-to-react` → `technical-design`
- **Ship a feature end-to-end** — `ux-flows` → `prototyping` → `content-ux-writing` → `design-communication`
- **Get team alignment** — `design-research-synthesis` → `design-communication`
- **Push back on a feasibility concern** — `technical-design` → `design-communication`
- **Audit existing UI** — `ui-audit` (runs its own lenses; pull in `accessibility` or `visual-ui` for depth)
- **Keep work consistent across sessions** — `design-context`, loaded once at session start

## What's inside every skill file

- **Trigger description** — the language and scenarios that activate it
- **Core principles** — the non-negotiables for that domain
- **Practical rules and patterns** — specific, actionable, with real examples
- **Anti-patterns** — what not to do and why

## Install

**Symlink (recommended if you're editing these).** Clone once, point your skills directory at it,
and every edit is live everywhere immediately:

```bash
git clone https://github.com/itsHendri/skills.git ~/skills
ln -s ~/skills/skills ~/.claude/skills
```

**Copy in.** Works across any Agent Skills harness (Claude Code, Cursor, Codex). Installs a
snapshot — re-run to update:

```bash
npx skills add itsHendri/skills
```

**Manually.** Copy folders from `skills/` into `~/.claude/skills` (personal) or a project's
`.claude/skills` (shared via that project's git).

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

---

Background: [hendri.design/notes/ai-skill-system-for-designers](https://hendri.design/notes/ai-skill-system-for-designers)
