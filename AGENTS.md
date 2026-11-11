# Skills repo

Hendri's skills, grouped by workflow in `skills/<group>/<skill>/SKILL.md` (core, design, web, 3d-print, video), plus `scripts/usage.py`. It's public: nothing private goes in (no machine names, addresses, accounts, client details).

- Each skill follows the Agent Skills spec: `name` equals its folder (lowercase-hyphen), SKILL.md stays under 500 lines (longer material goes in `references/`). `./install.sh --check` tests both.
- A description is three short parts, about 300 characters, 400 at most: what the skill produces, "Use for:" with the words Hendri actually types, and where it stops or what comes next ("Not for...", "Next: ui-audit"). Never "Expert skill for", never "use for any UI task": a skill that claims everything is picked for nothing.
- A skill earns its place by being used. `python3 scripts/usage.py` counts uses per skill from the transcripts; run it before adding a skill and every few months. A skill that is right but rare becomes slash only (`disable-model-invocation: true`), which takes it out of the session's list.
- Shared guidance has one home and the others link to it: component states are in `design-system/references/STATES.md`, the must-do accessibility rules in `global/AGENTS.md`, the accessibility check in `ui-audit`.
- A skill ends by naming the next one where there is a usual order: `ux-flows`, `design-canvas`, build, `ui-audit`, `site-launch`.
- A skill belongs to exactly one group. Adding a skill: make the folder in its group, add a row to the README table, run `./install.sh` (links it) and `./install.sh --check`.
- Third-party skills never get copied in; they're listed in `vendor.md`.
- `global/AGENTS.md` is Hendri's working preferences, loaded by every session through `install.sh`. Changes to it are Hendri's call.
- After changing a skill: `./install.sh --check`, add a CHANGELOG entry, then show Hendri the diff and ask once to commit and push.
- No em dashes in new writing.
