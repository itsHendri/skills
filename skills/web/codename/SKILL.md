---
name: codename
description: Work with the Codename panel, a Chrome side panel that reads the design system a live page runs, lets a person edit it, and hands the change over at token level through a local MCP bridge. Use when the codename MCP server is registered, or the user mentions Codename, a hand-off or brief from it, or a design change they made on the page.
---

# Codename

The person edits a live page in the Codename panel. You apply what they decided to source. Nothing you do through the bridge writes to source; the repository is yours to edit.

## The loop

1. If the panel is not paired, call `pairing_code` and read the code out to the user; they type it into the panel.
2. Call `watch` in a loop. It returns when there is a hand-off, a new comment, or a new selection.
3. On a hand-off, call `get_changes` and apply the brief. Then `clear` with `what: "handoff"`.
4. On comments, call `get_comments` with `status: "pending"`; `set_status` to acknowledged when you start, resolved when the change is in source, dismissed if you will not act; `reply` briefly.
5. Before larger work, read `codename://design-system/brand.md` (or call `get_design_system`) and write the files into the repository as design context.

## The rules

- Edit the definition of each token named; never replace its usages, and never paste a rendered stylesheet into source.
- Values were read from the rendered page. The stylesheet URLs are where the browser loaded the CSS; find the real definitions in the repository, or call `find_definition` and this bridge will search it for you.
- A line already named "defined at file:line" was found in the repository, not guessed. Where a brief says a token has several definitions, read them before editing: which one wins is the cascade's business.
- A token the person applied themselves is already in source and says so in the brief; do not write it again.
- Change nothing that is not named. Colours and tokens left out of a brief were left alone on purpose.
- An element line under a state heading is about that state only — `:hover`, `:focus-visible`, `:active`, the page's own dark mode, or a max-width query. Put it where that state is written, not on the base rule.
- A preview you paint with apply_css is a proposal, not a change; it needs the person's consent in the panel menu, they can see and clear it, and only source edits count.
- Tokens the person locked are listed under "Keep as is" in the brief and in `codename://rules`; leave them exactly as they are.

## States

- An element change can be about a state rather than about the element at
  rest. In a brief it appears under a heading naming that state; in
  `get_changes` it is `elements[].condition`.
- `{kind:'state'}` is `:hover`, `:focus-visible` or `:active`;
  `{kind:'scheme'}` is the page's own dark mode, whatever hook it uses;
  `{kind:'width', maxWidth}` is `@media (max-width: Npx)`.
- Put each where that state is written in source. A hover change belongs on
  the hover rule, not on the base one, and not as a new rule if the component
  already has somewhere for it.

## Finding what to edit

- `find_definition` searches the project this bridge is running in for where a custom property is defined, and says whether each one sits at the root of the cascade, under a media query, in a scoped selector or in a token file. Use it instead of grepping. More than one answer means the cascade decides, so read them before you edit.
- `check_tokens` takes a `path` in the project and reads the file itself; you only need to pass `file` contents for a file that is not in the project.
- `apply_definition` writes one value into one root-level definition, and only where the person has turned that on for the project. It refuses anything ambiguous. It is a shortcut for the case with nothing to decide, not a substitute for editing source yourself.

## Showing your work

- `point` scrolls the page to an element and shows a short note on the bar — say "look here" before or after a change.
- `get_screenshot` captures the page; pass `selector` to crop to one component, or `viewport` to check a breakpoint (then `reset`).
- `critique` returns what a designer would flag on the page, as facts with numbers.
