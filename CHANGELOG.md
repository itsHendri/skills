# Changelog

All notable changes to this skill system. Format based on
[Keep a Changelog](https://keepachangelog.com/); versioning is SemVer.

## [Unreleased]

### Added
- `wireframe` — rapid layout/navigation design through inline HTML wireframe iterations
  rendered directly in conversation: ground in the product's real design tokens, diagnose
  the current structure with code evidence, research patterns (Mobbin/web) with citations,
  iterate ~5 distinct concepts per batch with honest costs, lock decisions explicitly, and
  save a living `wireframes.html` + decision-record pair in the project repo before any
  build. Extracted from the Shhhcribble Studio redesign sessions (2026-07-24/25).

## [0.2.0] — 2026-07-22

Consolidates three diverging copies (the published blog snapshot, desktop `.skill` bundles,
and the working set built up across Claude sessions) into one authoritative repo. The working
set was the most evolved and is the basis here.

### Added
- `ui-audit` — reviewing and critiquing existing UI as a first-class mode, with six lenses,
  severity ratings, and a prioritised report format. Collapses the old four-skill audit chain
  into one skill.
- `design-context` — cross-session design consistency via a paste-able context block.

### Removed
- `design-handoff` — dissolved into three skills that already owned adjacent territory,
  removing a boundary-overlap magnet:
  - Dev Mode prep, asset export, Figma craft → `prototyping`
  - Token architecture and the Figma-to-code token pipeline → `design-systems`
  - Acceptance criteria and behavioural specs → `design-communication`

### Changed
- Nine skills expanded with additional rules, examples, and anti-patterns relative to the
  v0.1.0 snapshot: `accessibility`, `content-ux-writing`, `design-communication`,
  `design-systems`, `design-to-react`, `motion-design`, `prototyping`, `technical-design`,
  `visual-ui`.
- README rewritten around the 14-skill set, with install instructions.

### Known follow-ups
- `motion-design` references `framer-motion`; the library is now `motion`.
- `design-systems`, `design-to-react`, `technical-design` assume Tailwind v3's config-file
  token model; revisit for v4's CSS-first `@theme`.
- `design-context` and the "System Context File" section in `design-systems` describe the same
  artifact; add a cross-reference to prevent drift.
- Trigger descriptions need a pass for sensitivity — Claude tends to under-trigger.

## [0.1.0] — 2026-02-12

Initial system as documented at
[hendri.design/notes/ai-skill-system-for-designers](https://hendri.design/notes/ai-skill-system-for-designers).

13 skills — Core UX (9): `ux-foundations`, `design-systems`, `ux-flows`, `visual-ui`,
`motion-design`, `content-ux-writing`, `accessibility`, `design-handoff`, `prototyping`.
Designer-Developer (4): `design-to-react`, `design-communication`, `technical-design`,
`design-research-synthesis`.
