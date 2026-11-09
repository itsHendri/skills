---
name: ui-audit
description: >
  Expert skill for reviewing, critiquing, and improving existing UI. Use when the user
  asks to: review, audit, polish, improve, or critique existing interface work — not
  build something new. Triggers for: "review this component", "what's wrong with this UI",
  "make this look more polished", "audit this design", "what should I fix", "this looks
  AI-generated", "improve this interface", "what's off about this". Covers visual quality,
  UX patterns, accessibility, motion, copy, and design system consistency. Produces
  prioritised, actionable findings — not vague feedback.
---

# UI Audit

Reviewing existing UI requires a different mindset than building new UI. The goal is to
find the specific, fixable things that are lowering quality — and prioritise them by
impact. Vague feedback ("this feels off") is not useful. Specific findings with clear
fixes are.

---

## Audit Framework — 6 Lenses

Run through all six before reporting findings. Each lens catches different failures.

### 1. Visual Quality
- Is there a clear, intentional aesthetic direction — or is it default AI output?
- Typography: is there real hierarchy, or same weight/size everywhere?
- Color: any pure #000/#fff? Gray text on colored backgrounds? AI palette (cyan/purple/glow)?
- Spacing: is there rhythm (varied groupings, generous separations) — or monotonous uniform spacing?
- Cards: are things wrapped in cards that don't need to be? Cards nested in cards?
- Depth: is the shadow/border strategy consistent, or mixed randomly?
- Backgrounds: flat white/gray default, or intentional atmosphere?

### 2. UX & Interaction Patterns
- Is the primary action obvious in 3 seconds?
- Are there too many actions at equal visual weight?
- Does the empty state exist — and does it explain what to do?
- Are all error states designed?
- Is loading handled (skeleton or spinner)?
- Does the flow have an obvious exit/back path?
- Are forms progressive — asking only what's needed at each step?

### 3. Accessibility
- Does anything use color as the only signal (error, status, etc.)?
- Are there visible focus styles on interactive elements?
- Do interactive elements have sufficient touch targets (44×44px)?
- Is semantic HTML used (`<button>` not `<div>`, headings in order)?
- Do images have alt text? Icon-only buttons have `aria-label`?
- Does any dynamic content update silently (missing `aria-live`)?

### 4. Motion & Interaction Feel
- Do state changes snap (no transition) when they should animate?
- Are any animations using linear easing?
- Are transitions longer than 300ms for standard interactions?
- Is hover state instant-on / 150ms-off as specified?
- Does anything animate on every re-render unnecessarily?
- Is `prefers-reduced-motion` missing?

### 5. Copy & Microcopy
- Do CTAs describe what happens, or just say "Submit" / "OK" / "Yes"?
- Are error messages actionable (what happened + what to do)?
- Is terminology consistent — same concept named the same way everywhere?
- Is placeholder being used as label (disappears on type)?
- Is there generic placeholder copy ("Lorem ipsum", "Your text here") still showing?

### 6. Design System Consistency
- Are spacing values on the 4px grid — or are there rogue 7px, 11px, 15px values?
- Are all colors from the token system — or are there hardcoded hex values?
- Are border-radius values consistent — or mixed (some sharp, some very rounded)?
- Are the same components used consistently — or are there one-off variants?

---

## Severity Ratings

Rate every finding before reporting:

```
P0 — Blocks use: prevents task completion, breaks on a major platform, accessibility blocker
P1 — Major:      significantly confuses users, breaks a key flow, obvious visual failure
P2 — Minor:      friction, inconsistency, or quality gap but doesn't block the task
P3 — Polish:     small improvements, nice-to-haves, refinements
```

---

## Audit Report Format

Structure every audit report the same way:

```
## Audit — [Component/Screen name]

### Summary
One paragraph: what works, what the main issues are, overall assessment.

### Findings

**P0 — [Title]**
What: [specific observation]
Why it matters: [user/business impact]
Fix: [concrete action]

**P1 — [Title]**
What:
Why it matters:
Fix:

[... continue by severity ...]

### What's Working
[List the things that are actually good — balanced feedback builds trust]

### Recommended Fix Order
1. [P0 items first]
2. [P1 items]
3. [P2/P3 grouped]
```

---

## Quick Diagnostic Questions

Use these to rapidly identify the highest-impact issue:

1. Can you identify the single most important action in 3 seconds?
2. Does anything look like default AI output? (Inter font + purple gradient + cards everywhere)
3. Is the color or spacing noticeably wrong before reading anything?
4. Does it handle the empty state? The error state?
5. What happens when text is twice as long as expected?
6. Can you complete the core task using only a keyboard?
7. Does the copy tell users what to do — or just label things?
8. Is there any inconsistency that would make an engineer ask "which pattern should I follow"?

---

## Common Quick Wins (P2/P3 fixes with high visual impact)

- Add `transition-colors duration-150` to buttons and interactive elements — removes snap
- Increase spacing between unrelated sections — creates breathing room
- Reduce spacing within related groups — creates tighter association
- Replace identical heading weights with a real scale (one 700, one 600, body 400)
- Add a subtle background tint to the page surface — removes flat white feeling
- Add `text-muted` (lighter) color to secondary/supporting text — creates hierarchy
- Ensure all error messages say what to do, not just what went wrong

---

## Anti-Patterns in Auditing

- Reporting "it feels off" without specifying what — not actionable
- Reporting 20 findings of equal importance — creates paralysis
- Only reporting problems — ignoring what works erodes confidence
- Suggesting a complete redesign for a P2 issue — disproportionate
- Fixing things while auditing — audit first, then fix
- Ignoring the happy path to focus only on edge cases — both matter
