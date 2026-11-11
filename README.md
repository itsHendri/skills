# Skills

A small set of skills for someone who designs by building: focused files that load when a task
needs them, and stay out of the way when it doesn't.

Currently 15 skills in five groups (core, design, web, 3d-print, video), so a machine installs only the workflows it needs.

This repo is the single source of truth. Any copy elsewhere is a snapshot of this.

## Why so few

A session lists every installed skill, and the model picks from that list by description. In November 2026 a scan of ten weeks of sessions showed 15 of 26 skills had never been used, and the broad ones lost even when their topic came up, because a description that claims every UI task singles out nothing. So the rule now: a skill stays if it gets used, a description says what the skill produces and when it stops, and guidance that several skills share lives in one place.

`python3 scripts/usage.py` reruns that scan.

## The skills, by group

### core: always installed (3, all slash only)

Slash-only skills are not in the session's list. Type the name to run one.

| Skill | What it owns |
|---|---|
| [`/retro`](skills/core/retro/SKILL.md) | End of a session: what went wrong, and where each lesson belongs (a skill, a project file, a feedback note). |
| [`/machine-handoff`](skills/core/machine-handoff/SKILL.md) | Auditing a Mac before wiping or handing it back: unpushed commits, uncommitted changes, stashes, repos with no remote, config git doesn't cover. |
| [`/doc-acceptance-test`](skills/core/doc-acceptance-test/SKILL.md) | Testing documentation an agent must build from: a fresh agent builds something real and reports the defects in the docs. |

### design: designing in code (8)

| Skill | What it owns |
|---|---|
| [`ux-flows`](skills/design/ux-flows/SKILL.md) | Flows, information architecture, navigation, and the flow-level paths (offline, timeout, partial success). |
| [`design-canvas`](skills/design/design-canvas/SKILL.md) | Every design round for a project on its own Design canvas, from wireframes and directions to versions, with each decision recorded. |
| [`design-system`](skills/design/design-system/SKILL.md) | One naming scheme for a project's variables, the component contract, and `references/STATES.md`, the one list of component states. |
| [`visual-ui`](skills/design/visual-ui/SKILL.md) | Layout, type, colour, spacing, dark mode, and avoiding the generic AI look. |
| [`motion-design`](skills/design/motion-design/SKILL.md) | How things move: durations, easing, per-component timing, reduced motion. |
| [`tune-live`](skills/design/tune-live/SKILL.md) | Finding feel values with tune-panel, baking the numbers in and removing the panel. |
| [`content-ux-writing`](skills/design/content-ux-writing/SKILL.md) | The words in the interface, after reading the brand's voice. |
| [`ui-audit`](skills/design/ui-audit/SKILL.md) | Reviewing existing UI through six lenses, with a fresh-eyes pass and the full accessibility check. |

### web: shipping for the web (installs design too) (2)

| Skill | What it owns |
|---|---|
| [`site-launch`](skills/web/site-launch/SKILL.md) | Getting a site ready to go public on any stack: metadata, share image, icons, the link preview, the hardening sweep, a health route. |
| [`codename`](skills/web/codename/SKILL.md) | Working with the Codename Chrome panel, which hands design changes over at token level. |

### 3d-print: Blender and 3D printing (2)

| Skill | What it owns |
|---|---|
| [`blender-workflow`](skills/3d-print/blender-workflow/SKILL.md) | Running Blender for someone with no 3D experience: the MCP connection or headless scripts, parametric builds, scene hygiene, preview renders. |
| [`3d-print-design`](skills/3d-print/3d-print-design/SKILL.md) | FDM design rules, the checks before calling a model done, headless slicing, handing a print over. Lessons per kind of part are in `references/lessons.md`. |

### video: Video (0)

Coming soon.

## The usual order

`ux-flows` → `design-canvas` → build the pick (`design-system`, `visual-ui`, `motion-design` → `tune-live`, `content-ux-writing`) → `ui-audit` → `site-launch` → `/retro`

Each skill names the next one at its end.

## One home for shared guidance

- Component states and their names: `design-system/references/STATES.md`
- The accessibility rules every interface follows: `global/AGENTS.md`. The check: the accessibility lens in `ui-audit`.
- Variable names: `design-system/references/NAMING.md`

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
| `./install.sh --check` | Every link resolves, every `name` matches its folder, descriptions are 1 to 1024 characters, SKILL.md is 500 lines at most, no duplicates |
| `python3 scripts/usage.py` | Uses per skill and per month from the Claude Code transcripts, and which skills were never used |
| `./install.sh --zip <group or skill>` | `dist/<skill>.zip`, for uploading to claude.ai, ChatGPT or Gemini, which take uploads only |

**A new computer:** clone, run `./install.sh` with the groups it needs, then the commands in [vendor.md](vendor.md) for the third-party skills. In Bionic, turn on Settings → Skills → "Use skills found in other apps".

**Just a few skills:** `npx skills add itsHendri/skills --skill visual-ui` copies one in (a snapshot; re-run to update).

**Project skills** (only true for one project) live in that project's `.claude/skills/`. If you use Codex there too, link `.agents/skills` to it.

## Changelog

See [CHANGELOG.md](CHANGELOG.md).

---

Background: [hendri.design/notes/ai-skill-system-for-designers](https://hendri.design/notes/ai-skill-system-for-designers)
