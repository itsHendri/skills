---
name: machine-handoff
description: >
  Audit a Mac for work that exists nowhere else, before wiping, replacing, or
  handing it back. Use when the user says: wiping my laptop, resetting my Mac,
  new machine, getting a new laptop, returning my work machine, factory reset,
  migrating to a new computer, or asks "is everything backed up / on GitHub".
  Finds unpushed commits, uncommitted changes, git stashes, repos with no
  remote at all, and machine config that git does not cover. Also triggers for
  "what am I about to lose" and post-wipe restore questions.
---

# Machine handoff

Wiping a machine is irreversible and deadline-driven. The failure mode is not
missing a step — it is *believing* you are safe when you are not. So this skill
optimises for one thing: **never report "all clear" on the strength of a check
you did not actually run.**

## Order of operations

Safety first, tidiness second. Get everything off the machine before improving
anything. A rebase that goes wrong at 11pm the night before a wipe is a
self-inflicted wound.

1. **Sweep** for at-risk work
2. **Push** it somewhere, even if messy
3. **Only then** reconcile history, resolve conflicts, clean up
4. **Re-sweep** to verify

## 1. Sweep

Repos are not the only place work hides. Check all four:

```bash
find ~ -maxdepth 6 -type d \( -name node_modules -o -name Library -o -name .Trash \
  -o -name .cache -o -name vendor -o -name .npm -o -name Caches -o -name .venv \) \
  -prune -o -type d -name .git -print 2>/dev/null | sed 's#/\.git$##' | while read r; do
  rem=$(git -C "$r" remote 2>/dev/null | head -1)
  unc=$(git -C "$r" status --porcelain 2>/dev/null | wc -l | tr -d ' ')
  unp=$(git -C "$r" log --branches --not --remotes --oneline 2>/dev/null | wc -l | tr -d ' ')
  st=$(git -C "$r" stash list 2>/dev/null | wc -l | tr -d ' ')
  [ -z "$rem" ] && echo "NO REMOTE: $r (uncommitted:$unc)" && continue
  { [ "$unc" != 0 ] || [ "$unp" != 0 ] || [ "$st" != 0 ]; } && \
    echo "AT RISK: $r uncommitted:$unc unpushed:$unp stashes:$st"
done
```

### The four hiding places, in order of how often they are missed

**Repos with no remote.** The highest-severity finding, and the easiest to
overlook, because `git status` in one looks perfectly clean. The entire project
and its history exist on one disk. Always check `git remote` separately from
`git status`.

**Stashes.** Never pushed by anything, invisible to `git status`, and silently
destroyed by the wipe. Preserve without disturbing the working tree:

```bash
git push origin "stash@{0}:refs/heads/stash-<name>"
```

Then verify by comparing trees — if these differ, the stash did not survive:

```bash
git rev-parse 'stash@{0}^{tree}'
git rev-parse 'origin/stash-<name>^{tree}'
```

Tell the user it restores with `git checkout`, **not** `git stash pop`.

**Unpushed commits on non-default branches.** `git status` only describes the
current branch. `git log --branches --not --remotes` covers every branch, which
is why the sweep uses it.

**Uncommitted changes that appear mid-session.** Editors flush buffers and
watchers write files while you work. Re-run the sweep immediately before the
wipe; do not trust a result from an hour ago.

## 2. Push safely

When a repo has diverged and also has uncommitted work, do **not** open with a
rebase. Commit, then push to a throwaway branch first:

```bash
git add -A && git commit -m "..."
git push origin main:backup/pre-wipe-main
```

Everything is now off the machine. Any subsequent rebase is recoverable, which
means you can attempt the tidy version without gambling the user's work.

## 3. Before pushing anywhere new

**Scan for secrets.** A private repo is not an excuse to skip this; credentials
in git history are painful to remove and may violate company policy.

```bash
grep -rIn -E 'sk-[a-zA-Z0-9]{20}|AKIA[0-9A-Z]{16}|gh[pousr]_[a-zA-Z0-9]{20}|BEGIN (RSA|OPENSSH|EC|PRIVATE)|xox[baprs]-' .
```

**Ask about visibility explicitly.** Never default a new repo to public. Public
is effectively irreversible — code can be cloned, cached, or indexed before a
change of mind. Private costs nothing and flips later.

**Check who owns the data.** On a corporate machine, company material must not
land in a personal GitHub account or personal cloud, and personal projects
should not go into company storage. If both are present, they separate before
anything moves.

## 4. What git cannot save

Say this plainly rather than letting an all-green repo sweep imply total safety:

- **App preferences** (`~/Library/Preferences`) — opaque plists; copying across
  OS versions breaks apps
- **Keychain** — encrypted and machine-bound
- **Licences** — live in vendor accounts, not on disk. **The highest-value
  check on the whole list**: a lost app is a download, a lost licence can cost
  money or be unrecoverable. Verify account access *before* the wipe.
- **Large media** — sample libraries and project files that apps reference but
  do not contain

Capture what is capturable into a private repo: shell config, git config, ssh
`config` (never keys), a `Brewfile`, and an app inventory.

## Context that changes the advice

**Is there a Time Machine backup?** `tmutil destinationinfo`. If yes, it beats
every script — Migration Assistant carries settings, keychain and licences that
no dotfiles repo can. If no, say so early; it reframes expectations.

**Is the machine managed?** `profiles status -type enrollment`. Under MDM
(Kandji, Jamf), company apps are re-deployed automatically — do not script
those, and tell the user to ask IT what the reset restores before doing manual
work.

**Whose cloud account is it?** A work Apple ID or Google account is a
company-controlled destination. Check before recommending it as a backup target.

## Reporting

State what you verified and how. Distinguish "I confirmed X" from "X appears
fine". When a scan has limits — depth, pruned directories, one folder only —
name them, because an unqualified all-clear is what makes someone skip their
own check.

Metadata deserves the same caution. Spotlight's `kMDItemLastUsedDate` resets on
migrations, so "never used" is not evidence an app is unused. Corroborate
before anyone deletes on the strength of it.
