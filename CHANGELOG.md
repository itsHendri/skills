# Changelog

All notable changes to this skill system. Format based on
[Keep a Changelog](https://keepachangelog.com/); versioning is SemVer.

## [Unreleased]

### Added
- `doc-acceptance-test` — a method for validating documentation whose reader is a model rather
  than a person. Reading such docs only tells you whether they are clear to you; the question is
  what a model with no other context produces from them, and the failures are not where you would
  look. The method isolates a fresh agent with the docs and nothing else, briefs it to build
  something real (responsive layout, table, form control, status element — the awkward parts), and
  then asks for a four-part **critique of the documentation** rather than a report on the build:
  which rules constrained it, every value it had to invent, what was ambiguous or contradictory or
  wrong *checked against the shipped artifacts*, and what genuinely saved it from a mistake.
  Includes a brief-rotation table (each build shape probes a different seam), a severity order for
  triage that puts false claims above gaps because false claims are trusted, and anti-patterns —
  chief among them asking "did it work?", which always gets a yes.
  Extracted from three production runs against a generated design system, which between them found
  an invalid CSS shorthand that failed silently in every component recipe, a contrast claim that
  counted half its own warnings, status borders sitting at zero perceptual contrast, and a
  stylesheet that contradicted its own documentation about dark mode.

### Changed
- `ux-flows` — added a **"Publishing a flow to an infinite canvas"** appendix, turning the skill's
  previously nine-line documentation note into a full method: a canvas-independent flow model
  (screen/decision/lane/edge/hotspot/panel/spec-card), semantic edge roles bound to the project's
  own tokens rather than the tool's default swatches, the context-cluster + rail + phase-lane +
  sub-flow-band layout system, capture-pipeline principles (capture the real build, add a capture
  seed, pre-grant OS permissions, re-capture and swap the fill), the imperative-vs-declarative
  canvas-automation distinction with FigJam documented as the verified imperative case,
  explicit-magnet routing, a completeness checklist, and canvas anti-patterns.
  Spec-card *content* deliberately defers to `design-communication` rather than duplicating its spec
  template; the appendix owns only how a spec is rendered on a board. Also documents the two-track
  distinction — componentised design hand-off vs raw-capture flow documentation — since conflating
  them is the main way these boards fail. Extracted and generalised from three production flow-map
  boards built over 2026-07 (onboarding, trade, loans).

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
