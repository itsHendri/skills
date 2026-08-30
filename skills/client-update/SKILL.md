---
name: client-update
description: Write a short client-facing update artifact after shipping work to a staging site — what to test, and what simply changed. Use when the user asks for a client update, a review doc, a "what to test" page, a handover note for a client or stakeholder, or says they want to share progress with a client before going live. Also use when finishing a build that a non-technical client will review.
---

# Client update

A one-page artifact a non-technical client reads in under a minute, decides what to click,
and clicks it. It is not a changelog, not a status report, and not a place to think out loud.

These accumulate into a run of dated documents from the studio, so they carry the studio's
identity and always show what the work was and when it was issued.

## Shape

```
┌ MASTHEAD ────────────────────────────────────────────────┐
│ [mark]  Website updates                     25 Aug 2026  │
│         Client name                                      │
└──────────────────────────────────────────────────────────┘

Title            The thing that was built. A noun. "Saved Classes", not "What to test".
Description      One or two sentences on what was done. Plain, past tense.
[Staging link]   A single button.

TEST             Actions with an expected result. Usually 3–5.
UPDATES          Visible changes needing no action. Usually 0–3.

Note             One line: this is staging, live is untouched.
Sign-off         "Thank you for working with" + the full logo.
```

Two content sections, in that order. Never more. If a third is forming, it belongs in the
user's own notes, not the client's.

### The masthead

A hairline-ruled band above everything, so the page reads as an issued document rather than
a message.

- **Left** — the mark, then the work type in the display face (*Website updates*, *Brand
  updates*, *App updates*), with the client's name beneath it in mono.
- **Right** — the issue date, mono, `25 Aug 2026`. Ask the user for the date or use today's;
  never invent one.

Keep it to one line of height. It is a letterhead, not a cover page.

### The sign-off

Below the staging note, separated by space only, left-aligned and **stacked**: the line
**"Thank you for working with"** at `body-sm` in `--foreground-tertiary`, then `logo.svg` at
124px on the line beneath. The wordmark still finishes the sentence, so never add a name
after it and never centre it.

Stacked, not baseline-aligned on one line. Sharing a baseline sets the wordmark's cap height
directly against the text's x-height, and no size makes that look deliberate — the logo
either shouts or looks shrunken. Stacking removes the comparison. (Chosen from four options,
Aug 2026; the alternatives are still in the Figma file if this ever needs revisiting.)

The logo takes `currentColor` for the letterforms, so it inherits `--foreground` and works in
both themes; the scribble stays `--logo-accent`. It is the only place the full logo appears —
the masthead gets the small mark, the sign-off gets the wordmark.

## What goes in TEST

Only items that are **actionable and non-obvious**. Every bullet is: do this → expect that.

Include when the client can catch something you can't:
- Behaviour across devices or sessions — *"Save a few on your laptop, then open Favourites on your phone."*
- Behaviour they'd notice as wrong before you would — *"Un-heart a class — it should drop off straight away."*
- A new state that's hard to reach by accident — *"Search for something nonsense like zzz."*
- A control whose success isn't visually obvious — *"Press Clear search and filters."*

## The cuts — this is the whole skill

Most drafts fail by including too much. Cut hard:

- **Obvious mechanics.** "Tap the heart on a card." They will work that out. Start the bullet at
  the point where the instruction stops being self-evident.
- **Anything that wasn't new.** Existing filtering, existing search. If it worked last week, it
  isn't under review.
- **Bugs the client never saw.** A list capped at 100 items, a missing heading, a dead link — these
  were broken and are now fixed. Testing them asks the client to verify your own work.
- **Anything visibly working.** If a badge is on screen, its presence proves it. Don't ask for
  confirmation of what's plainly there.
- **Questions you can answer.** Don't ask a client for a price you already know, or for a
  judgement you've already made. Decide, and tell them they can raise it if they disagree.
- **Anything designed but not built.** It isn't on staging; mentioning it sends them hunting.
- **Your own follow-ups.** Technical debt, refactors, things to do next — the client's page is
  not your task list.

## Voice

Second person, active, specific. Name what they see on screen, in the words on screen.
Bold the thing they click or type. State the expected outcome, especially where the failure
mode is silent — *"never the whole library"* is worth more than *"check it works"*.

No hedging, no apologies, no jargon, no emoji. Never explain the implementation. If a
sentence would only make sense to whoever built it, cut it.

## Identity — the studio's, not the client's

The client's name appears in the masthead; their brand does not. These documents come *from
the studio*, and a consistent identity is what makes a run of them read as a service rather
than as loose notes.

**These documents are dark.** The palette below is the brand's dark mode, and it is the only
mode the page paints — declare the dark token values on bare `:root` and skip the
`prefers-color-scheme` and `[data-theme]` blocks entirely, so every reader sees the same
document whatever their system is set to.

**Load the `hendri-brand` skill and build from its tokens. Do not pick colours by eye and do
not copy hexes into this file.** The brand is generated by brand-forge and lives at
`~/brand-forge/exports/hendri/` — `tokens.css` is the resolved token set and
`skill/references/DESIGN_SYSTEM.md` is the full reference. Its rules apply here in full:
never write a colour literal, never reference a primitive, never hand-write a dark-mode
override. If no semantic token fits, say so rather than inventing one.

The tokens this document actually uses:

| Role | Token |
|---|---|
| Page | `--background` |
| Title, bold runs in bullets | `--foreground` |
| Lede, bullet text | `--foreground-secondary` |
| Masthead meta, date, staging note | `--foreground-tertiary` |
| Rules | `--border-subtle` |
| TEST label, TEST bullet squares | `--primary` |
| UPDATES bullet squares | `--border` |
| Staging button | `--primary` + `--primary-foreground` |
| Wordmark letterforms | `--foreground` (`--inverse-foreground` inside an inverse band) |
| The scribble | `--logo-accent` — orange in both themes, never re-pointed |

**Type is Space Grotesk throughout** — the brand's sans covers body *and* headings. `Syne` is
the display face and is reserved for something genuinely display-scale; a document title at
36px is `heading-lg`, which is Space Grotesk Medium. **There is no mono in this document** —
the masthead meta and the section labels are the `label` role, which is sans. Both faces are
on Google Fonts, the only font host artifacts allow.

The one thing worth stating twice: `--primary-foreground` is not always white. The polarity
differs per theme by design, so take the button's text colour from the token and never
hard-code it.

**Two brand files sit next to this one** — `mark.svg` (the orange scribble, for the masthead)
and `logo.svg` (the full "Hendri" wordmark with the scribble struck through the k, for the
sign-off). Inline both directly in the HTML; artifacts cannot load external images. Never
substitute another mark and never recolour either one.

Orange is the mark alone. Indigo is the accent, and it earns its place by marking what is
actionable: the TEST label, its bullets, and the button. UPDATES bullets take the rule
colour, because there is nothing to do with them.

## Layout

Follow `artifact-design` for the mechanics. Single column, `max-width: 760px`, no hero, no
cards. Hairline rules separate the masthead and the staging note and nothing else — sections
are held apart by space, not boxes. Keep the lede to `max-width: 52ch` so the opening
paragraph stays readable while the bullets use the full measure.

The staging link is the page's one primary action: a solid `--primary` button with
`--primary-foreground` text, 13/20 padding, `--radius-md`. Nothing else on the page is a
button, so it needs no competition — but it does need to look pressable, because the whole
document exists to send the client there.

Spacing comes off the brand's scale — 4, 8, 12, 16, 24, 32, 48, 64, 96. A gap of 46 or 13
means the value was guessed.

**Layout options live in Figma**, in *Client Update — Document System* (file
`0zMEZGimUBGV3UgtGci5Le`): four sign-off treatments in both themes, on the same variables.
Check there before redesigning the footer from scratch.

## Before publishing

Check each bullet against the cuts above, then ask of the page as a whole: could the client
finish this in a minute and know exactly what to click? If a bullet survives only because it
was interesting to build, it goes.

Publish with `Artifact`. Redeploy to the same file path when revising so the link the client
already has keeps working, and keep the title stable across revisions.
