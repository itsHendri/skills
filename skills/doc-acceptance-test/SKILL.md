---
name: doc-acceptance-test
description: >
  Expert skill for testing documentation that an AI agent has to build from — design
  system docs, SKILL.md files, AGENTS.md, component guidelines, API references. Use when
  the user asks: "test my docs", "can an agent actually build from this", "is my design
  system AI-readable", "validate my SKILL.md", "review my agent instructions", "why does
  the AI keep getting my system wrong", or after writing or exporting any documentation
  whose audience is a model rather than a person. Runs a fresh agent against the docs,
  makes it build something real, and harvests a critique of the documentation itself.
  Produces specific defects with fixes — not a readability opinion.
---

# Doc Acceptance Test

Documentation written for agents cannot be validated by reading it. Reading tells you
whether it is clear to *you*, which is not the question. The question is whether a model
with no other context produces correct work from it — and the failures are almost never
where you would look.

A real example: every component recipe in a design system ended with `font: var(--text-label)`.
It reads perfectly. It is invalid CSS — a bare length in the `font` shorthand — so browsers
drop the declaration **silently**. Every copied recipe produced an unstyled element with no
console error. Three careful human reads missed it. The first agent that tried to build from
it found it in ten minutes, because it had to make the thing work.

The method is simple: **give the docs to a fresh agent, make it build something real, and
ask it to critique the documentation rather than report success.**

---

## The Method

### 1. Isolate

The test agent gets the documentation and nothing else. Name the files explicitly and forbid
everything else — source code, git history, neighbouring directories, the implementation.

This is the whole experiment. An agent that can read the source will infer intent that the
docs never stated, and you learn nothing. If your docs ship as a folder, hand over the folder
exactly as a consumer would receive it.

### 2. Brief it to build something real

Not a snippet, not "an example page". Something with the awkward parts:

- A layout that must respond (this is where systems that never defined breakpoints get found out)
- At least one table, one form control, one status or feedback element
- Something quiet and something loud, so the full contrast range gets exercised
- Whatever your docs claim to support but nobody has built yet

Specify the artifact and where it goes, so the run leaves evidence you can look at.

### 3. Demand a critique, not a report

This is the step people get wrong. Ask an agent how it went and it will tell you the docs
were clear and helpful. You need it adversarial, and you need the question shaped so that
"everything was fine" is not a valid answer.

Ask for four things:

1. **Which rules constrained your choices, and where were you tempted to break them?**
   Surfaces rules that are doing real work, and rules that fight the task.
2. **What did you need that the docs did not provide? List every value you invented.**
   The exhaustive list is the gap analysis. Ask for what they picked, not just that they picked.
3. **What was ambiguous, contradictory, or wrong? Verify the docs' claims against the
   artifacts yourself.** This is the highest-yield question by a distance — it catches
   documentation that contradicts its own code, and claims that were true once.
4. **What was notably clear, or saved you from a mistake?**
   Not flattery. This tells you which techniques to repeat, and protects the good parts from
   being edited away later.

Say explicitly: *be specific and critical rather than complimentary*, and *quote exact lines*.

### 4. Vary the brief between runs

The same brief twice tests nothing new. Each build shape probes a different seam:

| Brief | What it stresses |
|---|---|
| Pricing / marketing page | Type scale, brand colour, buttons, badges |
| Docs or changelog page | Long-form type, tables, code blocks, in-body links |
| Settings / account page | Forms, nested surfaces, status states, destructive actions |
| Dashboard | Density, elevation, data colour, empty and loading states |
| Multi-column app shell | Breakpoints, containers, sticky chrome, overflow |

Run a different one each time and the findings keep coming. Three runs on one system produced
a distinct set of defects each time, and each run confirmed the previous round's fixes had
actually landed.

### 5. Fix in severity order

Triage what comes back:

1. **False claims** — the docs assert something untrue about their own artifacts. These are
   worse than gaps, because they are trusted. (One system claimed every colour pair passed
   contrast; the validator behind it counted only half its warnings.)
2. **Contradictions** — two sections give opposite answers. Two developers now build two
   different components and both can cite the docs.
3. **Silent failure modes** — guidance that produces broken output with no error.
4. **Unadmitted gaps** — things the docs are silent on that every implementer must invent.
   The fix is often to *declare the gap*, not to fill it.
5. **Taste disagreements** — usually leave these; the agent is not your art director.

Then **write a test for each fix**, asserting against the generated docs. Contradictions
return the moment someone edits a section in isolation.

---

## What Good Findings Look Like

Signal:

- "`font: var(--text-body)` is invalid CSS and is dropped silently" — a specific, verifiable defect
- "`--state-selected` has no paired foreground; every other fill has one" — a structural inconsistency
- "I invented a 240px sidebar width; nothing in the docs covers column widths" — a named gap with the value used
- "The docs say dark mode is an attribute, but the CSS also ships a `prefers-color-scheme` block" — docs contradicting artifacts

Noise:

- "The documentation was comprehensive and well-organised" — you asked the wrong question
- "I would suggest adding more examples" — non-actionable
- "The colour palette feels a bit conservative" — taste, not correctness

---

## Anti-Patterns

**Asking "did it work?"** The agent will say yes. It built something; from its perspective it
worked. You are not testing whether it can produce output, you are testing what the output
cost it.

**Letting the test agent see the implementation.** It will read intent out of the source and
report that the docs were sufficient. The isolation *is* the test.

**Running it once and declaring the docs good.** The first run finds the loud defects. The
second run finds the ones the first run's fixes revealed. Findings do not converge quickly.

**Fixing every finding.** Some are the agent wanting a system you deliberately don't have.
"There is no `--link` token" may be a gap to fill or a decision to state — declaring the gap
explicitly is a legitimate fix.

**Treating measurements as authoritative without checking.** Agents reimplement contrast maths
and get it approximately right. Use their numbers as a pointer, then verify with your own
tooling before rewriting tokens. In practice they have been accurate to the decimal — but
verify, because a wrong number that agrees with your suspicion is the easiest thing to believe.

**Testing prose instead of artifacts.** If the docs ship alongside a stylesheet, a token file
or a config, the test agent should be told to check the docs' claims *against those files*.
That is where "true when written" errors live.

**Letting the exported artifact drift from its source.** If the docs are generated, regenerate
before testing, and verify the output matches what the current code produces. Testing a stale
export produces findings you have already fixed.

---

## Cost and Cadence

One run is a single agent doing real work — not free, not expensive. Run it:

- After any substantial rewrite of the docs
- Before handing the docs to anyone else (a client, a team, a public repo)
- After adding a new layer to the system (a new token category, a new component class)
- Not after every edit — the signal comes from a meaningfully changed document

---

## Related

- `ui-audit` — critiques an existing *interface*; this critiques the *documentation* an
  interface is built from
- `design-systems` — token architecture and governance; this validates that the architecture
  survived contact with a consumer
- `design-communication` — writing for humans; the failure modes are different, because a
  human asks when something is unclear and a model guesses
