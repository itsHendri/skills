#!/usr/bin/env python3
"""How often each skill is actually used, from Claude Code transcripts. Read-only.

    python3 scripts/usage.py            every skill seen, with uses per month
    python3 scripts/usage.py --since 2026-11-01

A use is a Skill tool call, a typed /slash command, or the first read of a SKILL.md in a
session. "by name" means the person typed the slash command or wrote the skill's name in the
message before the call; "own" means the model picked it unprompted. Skills in this repo that
never show up are listed at the end: those are the ones to question.
"""
import glob, json, os, re, sys
from collections import Counter, defaultdict

HOME = os.path.expanduser("~")
REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SINCE = sys.argv[sys.argv.index("--since") + 1] if "--since" in sys.argv else ""
BUILTIN = set("clear model compact resume config goal help cost login logout status init review memory mcp "
              "permissions doctor exit agents hooks ide context export rewind usage plugin plugins fast effort "
              "btw tasks feedback skills loop schedule".split())
CMD = re.compile(r"<command-name>/?([A-Za-z0-9:_-]+)</command-name>")


def text(content):
    if isinstance(content, str):
        return content
    return "\n".join(b.get("text", "") for b in content or [] if isinstance(b, dict) and b.get("type") == "text")


def skill_of(path):
    return path.rstrip("/").split("/")[-2]


seen, uses, sessions, last_human, read_once = set(), [], {}, {}, set()
for f in sorted(glob.glob(HOME + "/.claude/projects/**/*.jsonl", recursive=True)):
    for line in open(f, errors="replace"):
        if '"type":"user"' not in line and '"type":"assistant"' not in line:
            continue
        try:
            d = json.loads(line)
        except ValueError:
            continue
        sid, ts, uid = d.get("sessionId"), d.get("timestamp") or "", d.get("uuid")
        if not sid or not ts or uid in seen or ts[:10] < SINCE:
            continue
        seen.add(uid)
        sessions.setdefault(sid, ts)
        content = (d.get("message") or {}).get("content")
        if d.get("type") == "user":
            if "toolUseResult" in d or d.get("isMeta") or d.get("isSidechain"):
                continue
            t = text(content)
            cut = t.find("Base directory for this skill:")
            t = t if cut < 0 else t[:cut]
            last_human[sid] = t.lower()
            for m in CMD.finditer(t):
                if m.group(1).lower() not in BUILTIN:
                    uses.append((m.group(1), ts, sid, "name"))
            continue
        for b in content if isinstance(content, list) else []:
            if not isinstance(b, dict) or b.get("type") != "tool_use":
                continue
            inp = b.get("input") or {}
            if b.get("name") == "Skill":
                n = str(inp.get("skill", "")).strip().lstrip("/")
                named = n.split(":")[-1].lower() in last_human.get(sid, "")
                uses.append((n, ts, sid, "name" if named else "own"))
            elif b.get("name") == "Read" and str(inp.get("file_path", "")).endswith("/SKILL.md"):
                n = skill_of(inp["file_path"])
                if (sid, n) not in read_once:
                    read_once.add((sid, n))
                    uses.append((n, ts, sid, "read"))

months = sorted({ts[:7] for ts in sessions.values()})
used_sessions = {u[2] for u in uses}
print(f"{len(sessions)} sessions, {len(sessions) - len(used_sessions & set(sessions))} used no skill"
      + (f", since {SINCE}" if SINCE else ""))
by = defaultdict(list)
for u in uses:
    by[u[0]].append(u)
w = max([len(k) for k in by] + [5])
print(f"\n{'skill':<{w}}  uses  name  own  read  last        " + "  ".join(months))
for k, L in sorted(by.items(), key=lambda kv: (-len(kv[1]), kv[0])):
    how, pm = Counter(u[3] for u in L), Counter(u[1][:7] for u in L)
    print(f"{k:<{w}}  {len(L):>4}  {how['name']:>4}  {how['own']:>3}  {how['read']:>4}  {max(u[1] for u in L)[:10]}  "
          + "  ".join(f"{pm.get(m, 0):>7}" for m in months))

mine = sorted(skill_of(p) for p in glob.glob(REPO + "/skills/*/*/SKILL.md"))
never = [s for s in mine if s not in by]
print(f"\nIn this repo and never used ({len(never)} of {len(mine)}): " + (", ".join(never) or "none"))
