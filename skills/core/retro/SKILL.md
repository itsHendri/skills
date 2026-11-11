---
name: retro
description: End-of-session retro. Looks back over this session for what went wrong or took too long, and proposes where each lesson belongs: a skill edit, a project CLAUDE.md line, or a dated feedback note. Slash only: run it with /retro.
disable-model-invocation: true
---

# Retro

Run at the end of a session, before it is closed. The aim is that the same thing does not go wrong twice. Change nothing until the owner has picked.

## 1. Collect

Read back over the session and list, in one line each:

- Corrections: where the owner said no, redirected, or repeated an instruction.
- Wasted work: something built and thrown away, a wrong assumption, a step done twice.
- Silent failures: something that looked done and was not.
- Things that worked and should be the default next time.
- Skills: which loaded, which should have and did not, which gave advice that turned out wrong.

Skip anything that only matters to this task. Five to eight lines is a full retro.

## 2. Sort each lesson into one home

| The lesson is | It goes in |
|---|---|
| true for this kind of work anywhere | the skill that covers it, as a rule or a trap, in the section it belongs to |
| true only for this project or this machine | the project's `CLAUDE.md` or `AGENTS.md` |
| about how the owner likes to work | the global instructions file; propose the line, it is the owner's call |
| a one-off story worth keeping | a dated note in the brand's `feedback/` folder |
| a skill that did not fire | that skill's `description`: add the words the owner actually used |

One home per lesson. If it would go in two places, it belongs in the more general one and the other links to it.

## 3. Propose

Show the list as numbered points, each with: the lesson, its home, and the exact text to add or change. Default is yes for each, so "all fine" is a complete answer. Offer to drop any.

## 4. Apply the picks

- Edit skills in the skills repo, never in a copy. Keep each SKILL.md under 500 lines; long material goes in `references/`.
- Nothing private in a public skills repo: no machine names, accounts or client details. Those go in the project file.
- Run the repo's check, add a changelog line, show the diff, and ask once before committing.

## Report

At most ten lines: what was added where, what was dropped, and anything still open.
