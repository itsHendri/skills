---
name: ux-foundations
description: >
  Core UX design philosophy and cross-cutting principles that govern all other UX skill domains.
  Load this skill for any UX or UI task — it defines the shared mental models, heuristics,
  decision-making frameworks, and professional standards that underpin every other skill.
  Trigger on: any design request, UX question, UI task, product critique, or when the user
  mentions design thinking, user-centered design, or product design principles.
---

# UX Foundations

This skill is the base layer. Every other UX skill inherits from these principles.
Apply them silently as defaults — don't narrate them unless directly relevant.

---

## Core Design Philosophy

**Design is problem-solving, not decoration.**
Every visual and interaction decision must serve a user need or business goal.
If an element can't justify its existence, remove it.

**Design for the user's mental model, not the system's architecture.**
Users don't care how the backend works. They care whether the interface matches
how they already think about the task. When in doubt, research how users describe
the problem in their own words.

**The best interface is the least interface.**
Reduce cognitive load at every opportunity. Fewer choices, clearer hierarchy,
shorter paths to the goal.

---

## The 10 Usability Heuristics (Nielsen)

Apply these as a silent checklist before finalizing any design output:

1. **Visibility of system status** — Always keep users informed about what's happening
2. **Match the real world** — Use language and concepts familiar to the user
3. **User control & freedom** — Support undo, back, and exit at every step
4. **Consistency & standards** — Same patterns mean the same thing everywhere
5. **Error prevention** — Design to prevent mistakes before they happen
6. **Recognition over recall** — Make options visible; don't rely on user memory
7. **Flexibility & efficiency** — Serve both novice and expert users
8. **Aesthetic & minimal design** — Every element earns its space
9. **Help users recover from errors** — Error messages are human-readable and actionable
10. **Help & documentation** — When needed, it's easy to find and task-focused

---

## Decision Framework: Before Any Design Output

Answer these before producing any UI or UX artifact:

| Question | Why it matters |
|----------|---------------|
| Who is the user? | Design is useless without a defined audience |
| What is the user trying to accomplish? | The task, not the feature, is the unit of design |
| What platform and context? | Mobile vs. web vs. desktop changes everything |
| What are the constraints? | Tech stack, brand rules, timeline, accessibility requirements |
| What does success look like? | Measurable outcome, not "looks good" |

---

## The State Inventory

Every interactive component must be designed in ALL states.
Missing states are the #1 craft failure in UI design.

```
default → hover → focus → active → disabled → loading → error → empty → success
```

Never deliver a design without all states accounted for — even if some are just annotated.

---

## Content First, Layout Second

Never design with Lorem Ipsum beyond the first sketch.
Real content breaks assumptions. A 340-character headline breaks a heading atom.
Zero items in a list exposes a missing empty state.
Always design for:
- **Minimum content** (zero items, short strings)
- **Typical content** (average case)
- **Maximum content** (overflow, very long strings, many items)

---

## The Three Levels of Design Quality

**Level 1 — Functional:** It works. The user can complete the task.
**Level 2 — Usable:** It's efficient. The user can complete the task without friction.
**Level 3 — Delightful:** It's memorable. The user feels good about completing the task.

Never sacrifice Level 1 or 2 chasing Level 3. Delight without function is decoration.

---

## Anti-Patterns to Always Avoid

- Designing only the happy path — edge cases, errors, and empty states are not optional
- Using Lorem Ipsum in anything past initial wireframes
- Hiding primary actions — the most important action should be the most visible
- Reinventing established patterns without a strong reason — familiarity reduces cognitive load
- Designing without knowing the user — assumptions are not research
- Treating accessibility as a final checklist item — it must be built in from the start
- Adding animation or visual complexity before the interaction model is solid
