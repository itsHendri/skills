---
name: design-research-synthesis
description: >
  Expert skill for synthesizing user research, analytics, and feedback into actionable
  design decisions. Use when the user asks about: making sense of user interviews,
  turning research into design requirements, presenting research findings to PMs or
  engineers, deciding what to prioritize, affinity mapping, turning analytics into
  design insights, user personas, or how to justify a design decision with evidence.
  Also triggers for: "users are confused by X", "research says Y but PM wants Z",
  "how do I turn these notes into a recommendation", "what should I fix first."
---

# Design Research Synthesis

Research without synthesis is just data. Synthesis is the skill of finding the signal
in the noise and turning it into a design recommendation someone can act on.

---

## The Synthesis Process

```
Raw data (interviews, analytics, feedback)
  → Observations (what you saw/heard, no interpretation yet)
    → Patterns (observations that repeat across multiple sources)
      → Insights (what the pattern means for the user)
        → Opportunities (design problems worth solving)
          → Recommendations (specific design actions)
```

Never skip steps. Jumping from "user said X" directly to "we should build Y" is the most
common research mistake. The insight step is where the real thinking happens.

---

## Turning Interviews into Insights

### Step 1: Capture observations (facts only)
```
✓ "User took 45 seconds to find the filter button"
✓ "User said 'I didn't know I could do that'"
✓ "User clicked the wrong button 3 times before finding the right one"
✗ "User found the UI confusing" (this is interpretation, not observation)
```

### Step 2: Affinity mapping (find patterns)
Group observations by theme. Do this physically or digitally (FigJam, Miro):
- Write each observation on a sticky note
- Sort into groups without predefined categories
- Name the groups after the pattern, not the feature

Common patterns that emerge:
- Navigation confusion (users can't find X)
- Mental model mismatch (users expect Y to work like Z)
- Trust/confidence gaps (users aren't sure if their action worked)
- Cognitive overload (too many choices, too much information)
- Missing feedback (no confirmation, no progress, no status)

### Step 3: Write insights
**Format:** [Who] struggles with [what] because [why].

```
✓ "New users struggle to find filters because the icon has no label and 
   isn't in the location they expect (top-left, not top-right)."

✓ "Users on mobile abandon the checkout form because it asks for 
   payment details before showing the total — they don't know if 
   the price is right."

✗ "Users don't like the filter UX." (not an insight — what, why?)
```

### Step 4: Define opportunities
**Format:** How might we [solve for the insight]?

```
"How might we make filters discoverable without adding visual clutter?"
"How might we build payment confidence before asking for card details?"
```

### Step 5: Recommendations
Specific, actionable, prioritized.

```
Priority 1 (High impact, low effort):
  Add "Filters" text label next to the filter icon
  → Directly addresses discoverability; 1-hour engineering change

Priority 2 (High impact, higher effort):
  Show order summary (items + total) before the payment step
  → Addresses trust gap; requires flow reorder
```

---

## Using Analytics to Support Design Decisions

Qualitative research tells you *what* and *why*. Quantitative tells you *how much* and *where*.
Use them together.

### Metrics that flag design problems

| Metric | What it might indicate |
|--------|----------------------|
| High bounce on a specific screen | Confusion, wrong expectations, or wrong audience |
| Low conversion on a CTA | Button not visible, copy unclear, or user not ready |
| High time-on-task | Findability problem — users are searching for something |
| High error rate on a form | Validation unclear, field labels ambiguous |
| Rage clicks on an element | User expects it to be interactive but it isn't |
| Drop-off in a funnel | Friction or trust gap at that specific step |

### How to turn a metric into a design recommendation
```
Observation: 60% of users drop off at the payment step

Hypothesis: Users aren't confident about what they're paying for
(Supported by: research showed users wanted to see the full breakdown)

Test: Add an order summary panel to the payment screen

Success metric: Drop-off rate at payment step decreases by X%
```

---

## Presenting Research to PMs and Engineers

### The "So What" Test
Every research finding should answer: "So what does this mean for what we build?"
If you can't connect a finding to a product decision, cut it from the presentation.

### Research Readout Structure (15 min)
```
1. Goals (1 min): What question were we trying to answer?
2. Method (1 min): How did we get this data? (n= / who / how)
3. Top 3 findings (8 min): Each as: observation → insight → opportunity
4. Recommendations (3 min): Prioritized list with rationale
5. Open questions (2 min): What we still don't know
```

### Talking to PMs
PMs think in metrics and roadmaps. Frame research in their language:
```
✓ "This affects 40% of users at the most critical step of their journey"
✓ "Fixing this is likely to improve [metric] based on similar changes at [comparable product]"
✓ "This is blocking our power users from adopting [key feature]"
✗ "Users said the UI was confusing"
```

### Talking to Engineers
Engineers care about specificity and scope:
```
✓ "Users click the save button before they've filled required fields — 
   they don't see the validation state until after. 
   Recommendation: Scroll to and focus the first error field on submit."
✗ "The error handling needs work"
```

---

## Personas: When They're Useful and When They're Not

**Useful when:**
- You have real research to base them on (not assumptions)
- The team genuinely doesn't know who the user is
- You're designing for multiple distinct user types with different goals

**Not useful when:**
- They're created from assumptions and never updated
- They focus on demographics instead of behaviors and goals
- They become the only way the team thinks about users

**Better than a persona for most design work:**
A **job-to-be-done** statement — what is this person trying to accomplish, and what
does success look like for them?

```
"When I'm reviewing a project status, I want to see what's changed since my last 
visit so I can quickly decide if I need to take action."

This is more useful than: "Meet Sarah, 34, Marketing Manager, tech-savvy, busy..."
```

---

## Prioritization Frameworks

When you have more insights than time, use a framework to prioritize.

### Impact vs. Effort Matrix
```
High Impact / Low Effort  → Do first (quick wins)
High Impact / High Effort → Plan carefully (big bets)
Low Impact / Low Effort   → Do if there's bandwidth
Low Impact / High Effort  → Don't do (cut)
```

### Severity Rating for Usability Issues
Rate each issue 1–4:
```
4 — Usability catastrophe: prevents task completion. Fix before launch.
3 — Major problem: causes significant delay or errors. Fix as high priority.
2 — Minor problem: causes frustration but users recover. Fix when possible.
1 — Cosmetic: low friction, no task impact. Fix if there's time.
```

---

## Anti-Patterns

- Presenting raw observations without insight ("users said the button was confusing")
- Skipping the "why" — insights without causation can't drive good design decisions
- Designing based on what users *said* they want, not what they *did* in testing
- Using personas that aren't grounded in real research
- Research that answers "is this good?" instead of "what should we build next?"
- Presenting 20 findings when 3 actionable insights would do more
- Not connecting research to metrics — hard to prioritize without knowing the scale of impact
- "We already know what users want" — the most expensive assumption in product design
