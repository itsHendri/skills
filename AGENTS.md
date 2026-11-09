# Skills repo

Hendri's skills, grouped by workflow in `skills/<group>/<skill>/SKILL.md` (core, design, web, 3d-print, video). It's public: nothing private goes in (no machine names, addresses, accounts, client details).

- Each skill follows the Agent Skills spec: `name` equals its folder (lowercase-hyphen), `description` is 1 to 1024 characters and lists the words that should trigger it, SKILL.md stays under 500 lines (longer material goes in `references/`).
- A skill belongs to exactly one group. Adding a skill: make the folder in its group, add a row to the README table, run `./install.sh` (links it) and `./install.sh --check`.
- Third-party skills never get copied in; they're listed in `vendor.md`.
- `global/AGENTS.md` is Hendri's working preferences, loaded by every session through `install.sh`. Changes to it are Hendri's call.
- After changing a skill: `./install.sh --check`, add a CHANGELOG entry, then show Hendri the diff and ask once to commit and push.
- No em dashes in new writing.
