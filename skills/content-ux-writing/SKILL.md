---
name: content-ux-writing
description: >
  Expert skill for UX writing, microcopy, and content design. Use when the user asks about:
  button labels, error messages, empty state copy, onboarding copy, placeholder text, tooltips,
  confirmation dialogs, success messages, loading messages, form labels, helper text, CTAs,
  notification copy, or asks to write/improve/audit any text that appears in a UI. Also
  triggers for: voice and tone questions, content style guides, naming conventions for UI
  elements, and any request to make copy clearer, friendlier, or more actionable.
---

# Content Design & UX Writing

Interface copy is interaction design. Every word in a UI is a decision about how the
product treats its users. Concise, objective, and scannable copy improves usability by
124% (NNg research). Most interfaces fail not because of bad visuals — but bad words.

---

## Core Principles

**1. Clear over clever**
Users scan, they don't read. Every word must earn its place.
Never sacrifice comprehension for personality.

**2. Action-oriented**
Labels and CTAs describe what happens when clicked — not what the thing is.
"Save changes" not "Submit". "Delete account" not "Confirm".

**3. User-centric framing**
Write from the user's perspective, not the system's.
"You have 3 unread messages" not "3 messages are unread in the system."

**4. Progressive disclosure**
Surface the minimum words needed at each step.
Save detail for tooltips, help text, and documentation.

**5. Consistent terminology**
Name things the same way everywhere. If it's "workspace" on the dashboard,
it's "workspace" in the settings, error messages, and onboarding — not "project" or "team."

---

## Microcopy by Component Type

### Button Labels
- Use verbs: "Save", "Create project", "Send message", "Delete account"
- Be specific: "Download CSV" not "Export"
- Match the consequence: "Delete" for irreversible, "Remove" for reversible
- Length: 1–4 words max

| ✓ Do | ✗ Don't |
|------|---------|
| Save changes | Submit |
| Create project | OK |
| Delete account | Confirm |
| Send to team | Yes |

### Error Messages
The most neglected and most impactful copy in any product.

**Formula:** What happened + Why (if helpful) + What to do next

```
✓ "Password must be at least 8 characters. Try adding a number or symbol."
✗ "Invalid password"

✓ "We couldn't connect to your calendar. Check your connection and try again."
✗ "Error 503"

✓ "That email is already in use. Sign in instead, or use a different email."
✗ "Email exists"
```

**Rules:**
- Never blame the user ("You entered an invalid email" → "That email isn't valid")
- Always provide a path forward — error messages without next steps are dead ends
- Use plain language — no error codes or technical jargon in user-facing messages
- For destructive actions: be specific about what will be lost

### Form Labels & Helper Text
- Labels: short, noun-based ("Email address", "Full name", not "Please enter your email")
- Required vs. optional: mark optional fields with "(optional)" — don't use asterisks unless ALL fields are required
- Placeholder text: use as example, not as label — it disappears when users type
- Helper text: proactive guidance shown below the field before errors occur
- Error text: specific and actionable, shown below the field, in red

```
Label:       Email address
Placeholder: name@company.com
Helper:      We'll send your receipt here
Error:       Enter a valid email address (e.g. name@company.com)
```

### Empty States
Three parts: visual + headline + supporting copy + CTA (when applicable)

```
First-time empty state:
  Headline: "No projects yet"  (short, factual)
  Body:     "Create your first project to start collaborating with your team."
  CTA:      "Create project"

No results:
  Headline: "No results for 'darkmode button'"
  Body:     "Try a different search term, or browse all components."
  CTA:      "Clear search"

Post-completion:
  Headline: "All caught up!"
  Body:     "You've reviewed everything. Check back tomorrow."
```

### Confirmation Dialogs
Be specific about what will happen — especially for destructive actions.

```
✓ Title:   "Delete 'Q4 Campaign' project?"
  Body:    "This will permanently delete the project and all 14 files inside.
            This can't be undone."
  CTA:     "Delete project" / "Keep project"

✗ Title:   "Are you sure?"
  Body:    "This action cannot be undone."
  CTA:     "Yes" / "No"
```

**Rule:** The destructive CTA should name what's being destroyed — "Delete project" not "Yes".
The cancel CTA should preserve context — "Keep project" not "Cancel".

### Loading & Progress Messages
- Short: "Loading your projects..." not "Please wait while we retrieve your project data from the server"
- Specific when possible: "Uploading 3 of 12 files" not "Uploading..."
- Reassuring for long waits: "This usually takes about 30 seconds"
- Never lie about progress — fake progress bars erode trust

### Tooltips
- Trigger: on hover/focus for icon-only controls or supplementary information
- Length: 1–2 sentences max
- Don't tooltip items that are already labeled clearly
- Don't put critical information only in tooltips — they're inaccessible on touch devices

### Notifications & Toasts
```
Success: "Project saved"  (past tense, confirms what happened)
Error:   "Couldn't save. Check your connection."  (what happened + next step)
Info:    "New version available. Refresh to update."  (fact + action)
Warning: "You're about to leave. Unsaved changes will be lost."  (consequence + implicit CTA)
```

---

## Voice & Tone Framework

**Voice** is constant — it's the product's personality.
**Tone** shifts — it responds to the user's emotional context.

| Situation | Tone shift |
|-----------|-----------|
| Onboarding / first use | Warm, encouraging, brief |
| Successful completion | Celebratory but not over the top |
| Error / failure | Direct, empathetic, never alarming |
| Destructive action | Serious, clear, no humor |
| Empty states | Friendly, motivating |
| Settings / configuration | Neutral, precise |

**Common voice attributes for modern products:**
Clear / Human / Helpful / Direct / Respectful (not sycophantic, not robotic)

---

## Content Audit Questions

When reviewing existing copy, ask:
1. Can any word be removed without losing meaning?
2. Does the user know what happens when they click this?
3. Is the same thing named consistently throughout?
4. If something goes wrong, does the error tell the user what to do?
5. Does this copy assume knowledge the user might not have?
6. Is the tone appropriate to the emotional context (success vs. error vs. first use)?

---

## Anti-Patterns

- "Click here" — never use; describe the destination or action instead
- "Please" on every button — sounds desperate; use sparingly and with purpose
- Jargon or internal terminology exposed to users ("entity", "record", "instance")
- Error messages that blame users or use passive voice ("An error has occurred")
- Placeholder text as label — it disappears, it fails accessibility, it's lazy
- Inconsistent terminology — "workspace" vs. "project" vs. "team" for the same concept
- Generic CTAs — "Submit", "OK", "Yes", "Confirm" tell users nothing
- All-caps for emphasis — use bold instead; all-caps is harder to read
- Exclamation points in error messages — "Error! Something went wrong!" is alarming
- Long error messages that describe the technical cause but not the user action
