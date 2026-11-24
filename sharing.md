# Sharing skills

How the skills in this repo reach each place, and how to share them with a team.

## Where they reach now

| Place | How | Stays current |
|---|---|---|
| Claude Code and Codex on a machine with the repo | `./install.sh` links each skill into `~/.claude/skills` and `~/.agents/skills` | Yes: an edit is live at once. On a second machine, add a nightly `git pull && ./install.sh` |
| claude.ai, ChatGPT, Gemini | `./install.sh --zip <group or skill>`, then upload by hand | No: upload again when a skill changes |
| Anyone else | `npx skills add itsHendri/skills --skill <name>` | No: a snapshot, run again to update |

For one person this is enough. Nothing extra to run or pay for.

## Sharing with a team

Not set up yet. When it's time:

### 1. Answer three questions first

1. Which tools does the team use: Claude Code, Codex or other agents, claude.ai? Each one gets skills a different way (see step 2).
2. Does the team have its own Claude Team or Enterprise organisation? If so, check whether its admin can give skills to everyone in claude.ai directly. That would replace the zip uploads.
3. Should the team be able to change the skills, or only use them?

### 2. Pick the setup from the answers

- Claude Code users, who only use the skills: make this repo a plugin marketplace. Add `.claude-plugin/marketplace.json` that lists only the skills meant for the team. Each person runs `/plugin marketplace add itsHendri/skills` once, and gets each update you push. It's free, and there's still one source.
- Codex and other agents: `npx skills add itsHendri/skills --skill <name>`, run again to update. Or they clone the repo and run `./install.sh`.
- claude.ai users: zips from `./install.sh --zip`, or the organisation's own skills, if question 2 says yes.
- The team edits skills too: move the shared skills into a repo under the team's GitHub, with its own `install.sh` and pull requests. This repo keeps only the personal ones and installs the team repo next to it.

### 3. What stays personal

Never shared: `global/AGENTS.md` (Hendri's working preferences), `hendri-figures` and `hendri-slides` (Hendri's own look) and `machine-handoff`. The design and web groups are the likely team set, once each skill is read for Hendri-only setup.

## Considered and left out for now

- Tailscale Aperture: an AI governance product (blog post, 10 November 2026: "Skill sharing with Aperture"). It holds personal and organisation skills, decides by identity who gets which, and delivers them to agents through the Skills over MCP extension. It imports from uploads, a public GitHub repo or a `.well-known` skill discovery URL. When posted, not every agent supported that extension, and the post gave no price, plan or versioning. Worth another look once a team of 5 or more uses several agents and needs control over who gets which skill.
- A self-hosted MCP server that serves the skills: one more service to run, for a problem only a bigger team has.
