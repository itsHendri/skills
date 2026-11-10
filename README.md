# Skills

A modular skill system: focused files that load expert-level guidance exactly when a task
needs it, without dragging irrelevant context into every session.

Currently 23 skills in five groups (core, design, web, 3d-print, video), so a machine installs only the workflows it needs.

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

## The skills, by group

### core: Always installed (2)

| Skill | What it owns |
|---|---|
| [`machine-handoff`](skills/core/machine-handoff/SKILL.md) | Auditing a Mac before wiping or handing it back: unpushed commits, uncommitted changes, stashes, repos with no remote, and machine config git doesn't cover. |
| [`doc-acceptance-test`](skills/core/doc-acceptance-test/SKILL.md) | Testing documentation an *agent* must build from — isolate a fresh agent, make it build something real, harvest a critique of the docs. |

### design: UX and visual design (14)

| Skill | What it owns |
|---|---|
| [`ux-foundations`](skills/design/ux-foundations/SKILL.md) | Base layer, always active. Shared mental models, heuristics, decision frameworks. |
| [`visual-ui`](skills/design/visual-ui/SKILL.md) | Layout, colour, typography, spacing, dark mode — distinctive production-grade visuals. |
| [`ux-flows`](skills/design/ux-flows/SKILL.md) | Flows, IA, navigation, screen-to-screen logic, and full state management. Plus an appendix for publishing a finished flow to an infinite canvas as an engineer-ready handoff board. |
| [`accessibility`](skills/design/accessibility/SKILL.md) | WCAG 2.1 AA baseline. Auto-applies to any UI output. |
| [`content-ux-writing`](skills/design/content-ux-writing/SKILL.md) | Every word in the interface — labels, errors, empty states, voice and tone. |
| [`motion-design`](skills/design/motion-design/SKILL.md) | Animation principles, motion tokens, easing, per-component timing. |
| [`tune-live`](skills/design/tune-live/SKILL.md) | Finding feel values (springs, easing, shader parameters) with tune-panel, the studio's own temporary panel themed per brand, then baking the numbers in and removing the panel. |
| [`prototyping`](skills/design/prototyping/SKILL.md) | Figma craft, fidelity decisions, Dev Mode prep, asset export, prototype strategy. |
| [`ui-audit`](skills/design/ui-audit/SKILL.md) | Reviewing and critiquing *existing* UI — six lenses, prioritised findings. |
| [`design-context`](skills/design/design-context/SKILL.md) | Cross-session consistency — load a context block at the start of a design session. |
| [`design-system`](skills/design/design-system/SKILL.md) | One naming scheme for a project's variables — three layers, states on every colour that acts, one inactive set, a primary/secondary/tertiary hierarchy — plus Atomic Design, the component contract, governance and the token pipeline. |
| [`design-research-synthesis`](skills/design/design-research-synthesis/SKILL.md) | Research and analytics into prioritised design recommendations. |
| [`design-communication`](skills/design/design-communication/SKILL.md) | Framing decisions, specs, dev tickets, reviews, acceptance criteria, pushback. |
| [`design-canvas`](skills/design/design-canvas/SKILL.md) | Every design round for a project on its own Design canvas, from wireframes through drafts, versions and iterations to release, with each decision recorded. |

### web: Building and shipping for the web (installs design too) (5)

| Skill | What it owns |
|---|---|
| [`design-to-react`](skills/web/design-to-react/SKILL.md) | Figma into production React — architecture, props, state, Tailwind. |
| [`technical-design`](skills/web/technical-design/SKILL.md) | The CSS and implementation knowledge that makes designs buildable and performant. |
| [`framer-marketplace`](skills/web/framer-marketplace/SKILL.md) | Taking a Framer component from "it works" to listed — the pre-submission sweep, listing screenshots, a recorded interaction loop, and the copy. Carries the capture recipes and the traps that silently produce broken assets. |
| [`client-update`](skills/web/client-update/SKILL.md) | The one-page artifact a client reads after work lands on staging: what to test, what simply changed, and nothing else. Carries the studio identity, so the updates accumulate as a run of issued documents. |
| [`codename`](skills/web/codename/SKILL.md) | Working with the Codename Chrome panel: it reads the design system a live page runs, lets a person edit it, and hands the change to the agent at token level over a local MCP bridge. |

### 3d-print: Blender and 3D printing (2)

| Skill | What it owns |
|---|---|
| [`blender-workflow`](skills/3d-print/blender-workflow/SKILL.md) | Running Blender for someone with no 3D experience: the MCP connection or headless scripts, parametric builds with every dimension in one place, scene hygiene, preview renders. |
| [`3d-print-design`](skills/3d-print/3d-print-design/SKILL.md) | FDM design rules (watertight geometry, clearances, overhangs, minimum features), the checks before calling a model done, headless slicing with Bambu Studio, and handing a print to someone else. |

### video: Video (0)

Coming soon.

## How the skills work together

- **Design a new component** — `ux-foundations` → `design-system` → `visual-ui` → `accessibility`
- **Build it in code** — `design-system` → `design-to-react` → `technical-design`
- **Dial in how something moves**: `motion-design` → `tune-live`
- **Get the layout right before building** — `ux-flows` → `design-canvas` → `visual-ui`
- **Ship a system others build from** — `design-system` → `design-communication` → `doc-acceptance-test`
- **Ship a feature end-to-end** — `ux-flows` → `prototyping` → `content-ux-writing` → `design-communication`
- **Hand a flow to engineering on a board** — `ux-flows` (design the flow, then its canvas appendix) → `design-communication` for the spec content the cards carry
- **Get team alignment** — `design-research-synthesis` → `design-communication`
- **Push back on a feasibility concern** — `technical-design` → `design-communication`
- **Audit existing UI** — `ui-audit` (runs its own lenses; pull in `accessibility` or `visual-ui` for depth)
- **Keep work consistent across sessions** — `design-context`, loaded once at session start
- **Ship a component to the Framer Marketplace** — `ui-audit` (fix P0/P1 first) → `framer-marketplace` → `content-ux-writing` for the listing copy
- **Hand finished work to a client for review** — `client-update` → `content-ux-writing` if the test steps need tightening

## What's inside every skill file

- **Trigger description** — the language and scenarios that activate it
- **Core principles** — the non-negotiables for that domain
- **Practical rules and patterns** — specific, actionable, with real examples
- **Anti-patterns** — what not to do and why

## Install

One copy of the repo, linked into every tool, so an edit made from any tool lands back here in git.

```bash
git clone https://github.com/itsHendri/skills.git
cd skills
./install.sh core design web      # core is always included; web pulls in design
```

`install.sh` links each skill into `~/.claude/skills` (Claude Code) and `~/.agents/skills` (Codex, Cursor, Copilot, Gemini CLI, opencode and others). It never deletes a real folder: anything in the way is reported and left alone. It also adds one import line to `~/.claude/CLAUDE.md` and links `~/.codex/AGENTS.md`, both pointing at `global/AGENTS.md`, the working preferences every session loads (that file is mine; replace it with your own).

| Command | Does |
|---|---|
| `./install.sh` | Re-link the groups already installed (after `git pull`) and prune dead links |
| `./install.sh --list` | Groups, their skills, and what's installed |
| `./install.sh --remove <group>` | Unlink one group |
| `./install.sh --check` | Every link resolves, every `name` matches its folder, descriptions are 1 to 1024 characters, no duplicates |
| `./install.sh --zip <group or skill>` | `dist/<skill>.zip`, for uploading to claude.ai, ChatGPT or Gemini, which take uploads only |

**A new computer:** clone, run `./install.sh` with the groups it needs, then the commands in [vendor.md](vendor.md) for the third-party skills. In Bionic, turn on Settings → Skills → "Use skills found in other apps".

**Just a few skills:** `npx skills add itsHendri/skills --skill visual-ui` copies one in (a snapshot; re-run to update).

**Project skills** (only true for one project) live in that project's `.claude/skills/`. If you use Codex there too, link `.agents/skills` to it.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

---

Background: [hendri.design/notes/ai-skill-system-for-designers](https://hendri.design/notes/ai-skill-system-for-designers)
