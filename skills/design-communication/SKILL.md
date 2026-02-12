---
name: design-communication
description: >
  Expert skill for communicating design decisions to humans — engineers and product managers.
  Use when the user needs to: frame a design decision with tradeoffs, write a spec document
  or PRD brief, write Jira/Linear tickets for developers, present design work in a review,
  explain design rationale, get stakeholder buy-in, handle pushback, run a design critique,
  or write async design updates (Slack, Loom scripts, written walkthroughs). Also triggers
  for: "how do I explain this to engineering", "PM wants a rationale", "engineer is pushing
  back", "how do I run a design review", or any situation where the goal is persuasion,
  alignment, or clarity with another person — not producing a Figma annotation or spec file.
  For technical Figma handoff artifacts (token specs, Dev Mode, annotations), use design-handoff.
---

# Design Communication

Great design that can't be communicated doesn't ship. The ability to frame decisions,
write clearly, and speak the language of engineers and PMs is what separates designers
who influence product direction from designers who execute tickets.

---

## The Core Shift: From "It Looks Better" to "Here's the Tradeoff"

Engineers and PMs respond to reasoning, not aesthetics. Reframe every design decision
as a tradeoff between measurable outcomes.

| Weak framing | Strong framing |
|-------------|----------------|
| "The old layout looked cluttered" | "Removing 3 secondary actions reduced visual complexity and puts focus on the primary CTA, which is the action 80% of users take" |
| "This feels more modern" | "Updated typography and spacing aligns with our brand refresh and closes the gap with competitor [X], which users cited in research" |
| "Users will prefer this" | "In 5 usability sessions, 4/5 users completed the task in under 30 seconds with this layout vs. 3 minutes with the current one" |
| "It's cleaner" | "Reducing the form from 8 fields to 4 (moving advanced options to a separate step) aligns with progressive disclosure — it should reduce drop-off at this step" |

**The formula:** What changed + Why (user/business rationale) + What we expect (outcome)

---

## Writing Design Specs Engineers Can Act On

A spec has one job: let an engineer build the feature without needing a sync call.

### Spec Template
```markdown
## [Feature / Component Name]

### What this is
One sentence. What it does, for whom, in what context.

### User goal
"As a [user], I want to [action] so that [outcome]."

### Screens / states
List every screen or state. Link to Figma frames directly.
- Default state: [Figma link]
- Loading state: [Figma link]
- Error state: [Figma link]
- Empty state: [Figma link]
- Mobile: [Figma link]

### Behavior
Describe what happens, not what it looks like:
- On click: [action]
- On hover: [visual change, duration]
- On error: [what shows, how user recovers]
- On success: [what changes, what confirms it]

### Content rules
- Heading: max 60 characters
- Description: max 120 characters, optional
- Image: 16:9, minimum 800×450px

### Edge cases
- No data: [empty state behavior]
- Single item: [does the layout still work?]
- 100+ items: [pagination? truncation?]
- Long strings: [truncation rules]

### Acceptance criteria
The feature is done when:
- [ ] All Figma states are implemented
- [ ] Keyboard navigation works as documented
- [ ] Mobile layout matches spec at 375px
- [ ] Error handling is implemented
- [ ] Empty state is implemented
- [ ] Passes color contrast AA

### Out of scope
[Explicitly list what is NOT in this ticket]
```

---

## Writing Dev Tickets

The most common design-to-engineering failure: tickets that describe appearance,
not behavior. Engineers can see what it looks like in Figma. They need to know how it works.

**Ticket checklist:**
- [ ] Links to the specific Figma frame (not the file root)
- [ ] All states listed (not just the default)
- [ ] Mobile frame linked if applicable
- [ ] Behavior described in plain language ("on click, modal opens" not "modal variant active")
- [ ] Edge cases called out
- [ ] Clear acceptance criteria (testable, not "looks like the design")
- [ ] Explicitly lists what's NOT in scope

**Good ticket description:**
```
Implement the notifications dropdown (Figma: [direct link])

Behavior:
- Bell icon in top nav shows unread count badge when count > 0
- Click opens dropdown, max 5 items, "View all" link at bottom
- Each item: avatar + text + timestamp + unread dot
- Clicking an item marks as read + navigates to the relevant page
- Clicking outside or pressing Escape closes the dropdown

States: [link to each state in Figma]
Empty: "You're all caught up" message with checkmark icon
Loading: 3 skeleton rows

Out of scope: Notification preferences, bulk mark-as-read
```

---

## Presenting Design Work

### To Engineers
- Lead with the user problem, not the solution
- Show the constraints you worked within (timeline, tech debt, existing patterns)
- Anticipate implementation questions — have answers ready
- Ask "what would make this hard to build?" early, not after sign-off
- Bring edge cases and error states — engineers trust designers who think about failure

### To Product Managers
- Connect every design decision to a metric or user outcome
- Show alternatives you considered and why you chose this path
- Frame risks explicitly: "this assumes X — if X isn't true, here's the fallback"
- Have a clear ask: feedback, approval, or a decision (not all three at once)

### To Both (Design Review)
Structure a design review as:
```
1. Context (2 min): What problem are we solving? For who?
2. Constraints (1 min): What are we working within?
3. The design (5–10 min): Walk through the flow, not the screens
4. Decisions made (3 min): 2–3 key choices and their rationale
5. Open questions (2 min): What you still need input on
6. Ask (1 min): Specific feedback you want — not "thoughts?"
```

**Never ask "any feedback?" — always ask a specific question:**
- "Does the error recovery flow make sense to engineering?"
- "PM: does this scope match what's in the roadmap?"
- "Is there a simpler way to handle the empty state that I'm missing?"

---

## Handling Pushback

### From Engineers: "That'll be hard to build"
Don't immediately redesign. Ask:
- "What specifically makes it complex — the layout, the interaction, or the data?"
- "Is there a version that gets 80% of the value with 20% of the complexity?"
- "How long would the full version take vs. a simplified version?"

Then decide together. Sometimes the hard version is worth it. Sometimes it's not.

### From PMs: "Can we just ship the simple version?"
- Acknowledge the constraint: "I understand we're on a tight timeline."
- Clarify the risk: "The simple version works for the main case but breaks when [edge case]. Here's what that looks like."
- Offer a path: "If we scope it this way, we could ship fast and handle [edge case] in a follow-up."

### From Stakeholders: "I don't like how it looks"
- Ask: "What's not working — the layout, the color, or something else?"
- Separate taste from usability: "I hear you on the style — let's make sure we also validate it works for users."
- Don't redesign in the room. "Let me take that feedback and come back with options."

---

## Written Design Communication

### Async Design Loom / Walkthrough Script
When you can't present live, record a 3–5 min walkthrough:
```
0:00 — "Here's the problem we're solving and who it's for"
0:30 — "Here's the flow, step by step"
2:00 — "Here are the 2 key decisions I made and why"
3:00 — "Here's what I still need from you — [specific question]"
```

### Slack / Written Design Update
```
**What:** [One line summary of what changed]
**Why:** [User or business reason]
**Figma:** [Direct link to frame]
**Need from you:** [Specific ask — approval / feedback on X / decision on Y]
**By:** [Date if time-sensitive]
```

---

## Anti-Patterns

- Presenting screens instead of flows — engineers and PMs need to understand the journey
- Asking for "general thoughts" — always ask a specific question
- Redesigning in the meeting when someone pushes back
- Skipping the "out of scope" section in specs — causes scope creep
- Writing specs that describe visuals instead of behavior
- Sending a Figma link without context — always include: what it is, what changed, what you need
- Using design jargon with engineers ("hierarchy", "breathing room", "affordance") without explaining
