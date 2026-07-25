---
name: wireframe
description: Rapid layout/navigation design through inline HTML wireframe iterations — research patterns, diagnose the current structure, render ~5 labelled concepts in-conversation, workshop on feedback, lock decisions, and save a living wireframes.html + decision-record md before any code is written. Use when the user asks for design iterations, layout or nav exploration, screen wireframes, or "let's look at our navigation/layout" for any app or site.
---

# Wireframe — iterate on layout in conversation, before building

The value of this skill is speed of iteration with the user in the loop:
wireframes render inline in the conversation next to the reasoning that
produced them, the user reacts in prose, and the layout is right before
anyone writes app code. Do NOT push screens to external design tools
(Figma, Subframe, Paper, …) even when their MCPs are connected, unless the
user explicitly asks.

## Process

1. **Ground in the real product first.** Read the app's design-token source
   (design system file, CSS variables, theme) and the actual code of the
   screens under discussion. Wireframes must read as THIS product — its
   fills, radii, type sizes, chrome — not as a generic mockup. Cite concrete
   evidence (`file:line`) when diagnosing.

2. **Diagnose before drawing.** Name the structural problems in the current
   layout as claims the user can push back on (e.g. "four of six nav slots
   are configuration", "these two panes are the same component with
   different nouns"). The diagnosis drives the iterations; without it you're
   just generating variety.

3. **Research patterns.** If a pattern library MCP (e.g. Mobbin) is
   connected, search real products for the relevant surface and cite links.
   Report negative findings too — "no competitor does X" is often the most
   useful sentence. A quick web search settles competitive questions.

4. **Iterate in batches of ~5 distinct directions.** Render each batch as an
   inline HTML widget: every concept gets a short name, a one-line thesis,
   and an honest cost ("biggest change, biggest payoff"). End the batch with
   a recommendation and what you'd park. Distinct means structurally
   different — not five paddings of the same idea.

5. **Read feedback exhaustively.** Users who are designers write long,
   descriptive prompts — the prompt IS the spec. Enumerate every distinct
   ask (a question buried mid-paragraph is a real change request) and answer
   each one. When the user gives a *reason* for a change, apply the reason
   to other screens too, and say so. Own your errors explicitly when they
   catch one (e.g. an item silently dropped from a nav while trimming a
   mock).

6. **Lock decisions explicitly.** Keep a visible ledger: decided vs open.
   For genuine forks the user must call, use a structured question with a
   recommendation. Never let a wireframing convenience quietly become a
   design decision.

7. **Fill gaps the user didn't ask about.** After the happy-path screens,
   proactively raise: empty states / first run, search results, in-progress
   states, the click-through of every affordance drawn (if you drew an
   icon, define what it does), and long-range navigation. Offer them ranked;
   let the user choose.

8. **Save as living documents** once the direction is agreed, in the repo
   (e.g. `docs/design/`):
   - `<area>-wireframes.html` — every agreed screen in ONE self-contained
     file: own CSS variables with a `prefers-color-scheme: dark` block, a
     system font stack, icons via the Tabler webfont CDN. Opens in any
     browser. Each screen gets a heading + a short rules caption.
   - `<area>-wireframes.md` — the decision record: the reframe/thesis, the
     information architecture, per-surface rules, cross-cutting rules,
     an "explicitly deferred" list (so cut ideas don't sneak back in
     unreviewed), and implementation phasing. State that it's a living
     contract: builds that contradict it must stop and re-check.
   Update both IN PLACE on later iterations — don't fork v2 files.

## Widget craft rules

- Draw a real window shell (traffic lights, titlebar, chrome) at believable
  proportions; columns get real widths.
- Use the conversation host's CSS variables for all colors so light/dark
  both work; neutral selection fills, accent color only where the product
  uses accent.
- Sample content must tell the story — realistic text from the user's
  actual domain, never lorem ipsum. The content IS the argument (e.g. a
  timeline mock should show the real ratio of item types).
- ≤4 window mocks per widget, one shared `<style>` block, 11px minimum
  text, sentence case, Tabler outline icons only (never `-filled`).
- Prose stays outside the widget: thesis lines above each mock are fine;
  paragraphs of rationale belong in the response text.
- Label decisions you made unilaterally while drawing ("push back if
  wrong") — surface them, don't bury them.

## Wrap-up

When the user calls the direction final: save the two living documents,
update the project's state-carrying docs (CLAUDE.md progress note or
equivalent) so a fresh session can pick up implementation, and propose
phasing — smallest structural phase first, schema-touching phases isolated,
each phase one branch.

## Anti-patterns

- **Generic mockups** — wireframes in the host's default look instead of the
  product's own tokens, or lorem-ipsum content. If it could be any app, it
  argues for nothing.
- **Variety without thesis** — five paddings of the same idea, or iterations
  that don't answer the diagnosis that opened the session.
- **Silent decisions** — letting a drawing convenience become design (an item
  dropped from a nav to make a mock fit) without flagging it for the user.
- **Answering only the loudest ask** — a long prompt usually contains three
  or four; a question buried mid-paragraph is a real change request.
- **Tool detours** — pushing screens to Figma/Subframe/etc. mid-iteration,
  or forking `-v2` wireframe files instead of updating the living pair.
