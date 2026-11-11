# Third-party skills

Skills I use but don't write. They're installed by their own tools, never copied into this repo, so updates come from their makers. On a new computer, run the ones for the groups you installed.

| Group | Skills | Install | Where they land |
|---|---|---|---|
| video | 12 `remotion-*` skills (best practices, captions, create, ...) | `npx skills add remotion-dev/skills` in the videos repo | that repo's `.agents/skills/`, pinned by its `skills-lock.json` |

Replaced:
- `framer` and `framer-code-components` (from `npx @framer/agent setup`): removed 2026-11-09 with the Framer CLI, in favour of the Framer MCP server. Don't reinstall them alongside it.

Not installed, kept for reference:
- `tuur-skills` (spec, plan, session; a zip from 2026-11-06 at commit e6cb8b7). Read as reference on 2026-11-11 and not installed: the chain line in descriptions, the closing "Next" line and the house kit idea came from it; its queue scripts and worker agents were left out.

Never edit these in place: the next setup run overwrites them. If one needs changing for my work, write a skill of my own that adds to it.

The Claude desktop app also writes `synced/` (my claude.ai skills) into `~/.claude/skills`. It's ignored here and left alone.
