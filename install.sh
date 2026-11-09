#!/usr/bin/env bash
# Links this repo's skills into each tool's user skills folder, by group. One copy (this repo), links everywhere,
# so an edit made through any tool lands here in git. Bash 3.2-safe: runs on macOS and Debian.
#
#   ./install.sh core design web 3d-print   install these groups (core is always included; web pulls in design)
#   ./install.sh                            re-link the groups already installed (after git pull), prune dead links
#   ./install.sh --remove <group>           unlink one group
#   ./install.sh --list                     groups, their skills, and what's installed
#   ./install.sh --check                    every link resolves; names, descriptions and duplicates are valid
#   ./install.sh --zip <group|skill>        dist/<skill>.zip for uploading to claude.ai, ChatGPT or Gemini
#
# Targets (override for tests): CLAUDE_SKILLS_DIR (~/.claude/skills), AGENTS_SKILLS_DIR (~/.agents/skills),
# CLAUDE_MD (~/.claude/CLAUDE.md), CODEX_AGENTS (~/.codex/AGENTS.md). It never deletes a real folder or file:
# anything in the way that isn't one of its own links is reported and left alone.
set -eu

REPO="$(cd "$(dirname "$0")" && pwd -P)"
SKILLS="$REPO/skills"
CLAUDE_SKILLS_DIR="${CLAUDE_SKILLS_DIR:-$HOME/.claude/skills}"
AGENTS_SKILLS_DIR="${AGENTS_SKILLS_DIR:-$HOME/.agents/skills}"
CLAUDE_MD="${CLAUDE_MD:-$HOME/.claude/CLAUDE.md}"
CODEX_AGENTS="${CODEX_AGENTS:-$HOME/.codex/AGENTS.md}"
STATE="$CLAUDE_SKILLS_DIR/.installed-groups"
GLOBAL="$REPO/global/AGENTS.md"
MARK_BEGIN="<!-- skills repo: global instructions (install.sh keeps this line) -->"

say() { printf '%s\n' "$*"; }
warn() { printf 'warning: %s\n' "$*" >&2; }
groups() { for d in "$SKILLS"/*/; do basename "$d"; done; }
skills_in() { for d in "$SKILLS/$1"/*/; do [ -f "$d/SKILL.md" ] && basename "$d"; done; return 0; }
has_group() { [ -d "$SKILLS/$1" ]; }
contains() { case " $1 " in *" $2 "*) return 0 ;; esac; return 1; }

# A link is ours when it points into this repo's skills folder.
ours() { [ -L "$1" ] && case "$(readlink "$1")" in "$SKILLS"/*) return 0 ;; esac; return 1; }

link_one() { # group skill target_dir
	local src="$SKILLS/$1/$2" dst="$3/$2"
	mkdir -p "$3"
	if [ -L "$dst" ]; then
		if ours "$dst"; then ln -sfn "$src" "$dst"; return 0; fi
		warn "$dst is a link to $(readlink "$dst"), not this repo. Left alone."
		return 0
	fi
	if [ -e "$dst" ]; then warn "$dst is a real folder or file. Left alone; $2 is not linked there."; return 0; fi
	ln -s "$src" "$dst"
}

prune() { # target_dir: remove our links whose skill no longer exists
	[ -d "$1" ] || return 0
	for l in "$1"/*; do
		[ -L "$l" ] || continue
		if ours "$l" && [ ! -e "$l" ]; then rm "$l"; say "pruned $l"; fi
	done
}

install_groups() {
	local wanted="core" g
	for g in "$@"; do
		has_group "$g" || { warn "no group \"$g\" (groups: $(groups | tr '\n' ' '))"; exit 1; }
		[ "$g" = web ] && ! contains "$wanted" design && wanted="$wanted design"
		contains "$wanted" "$g" || wanted="$wanted $g"
	done
	for g in $wanted; do
		for s in $(skills_in "$g"); do
			link_one "$g" "$s" "$CLAUDE_SKILLS_DIR"
			link_one "$g" "$s" "$AGENTS_SKILLS_DIR"
		done
	done
	prune "$CLAUDE_SKILLS_DIR"
	prune "$AGENTS_SKILLS_DIR"
	mkdir -p "$CLAUDE_SKILLS_DIR"
	printf '%s\n' $wanted > "$STATE"
	install_global
	say "Installed: $wanted"
}

# ~/.claude/CLAUDE.md imports global/AGENTS.md (one managed line, the rest of the file is untouched);
# ~/.codex/AGENTS.md is a link to it. Re-running after the repo moves fixes both.
install_global() {
	[ -f "$GLOBAL" ] || return 0
	mkdir -p "$(dirname "$CLAUDE_MD")"
	local line="@$GLOBAL"
	if [ -f "$CLAUDE_MD" ] && grep -qF "$MARK_BEGIN" "$CLAUDE_MD"; then
		local tmp; tmp="$(mktemp)"
		awk -v mark="$MARK_BEGIN" -v line="$line" '{ print } $0 == mark { getline; print line }' "$CLAUDE_MD" > "$tmp" && cat "$tmp" > "$CLAUDE_MD" && rm "$tmp"
	else
		{ [ -f "$CLAUDE_MD" ] && cat "$CLAUDE_MD" && printf '\n'; printf '%s\n%s\n' "$MARK_BEGIN" "$line"; } > "$CLAUDE_MD.new"
		mv "$CLAUDE_MD.new" "$CLAUDE_MD"
	fi
	mkdir -p "$(dirname "$CODEX_AGENTS")"
	if [ -L "$CODEX_AGENTS" ] || [ ! -e "$CODEX_AGENTS" ]; then ln -sfn "$GLOBAL" "$CODEX_AGENTS"
	else warn "$CODEX_AGENTS is a real file. Left alone; link it to $GLOBAL by hand."; fi
}

remove_group() {
	has_group "$1" || { warn "no group \"$1\""; exit 1; }
	[ "$1" = core ] && { warn "core is always installed"; exit 1; }
	for s in $(skills_in "$1"); do
		for t in "$CLAUDE_SKILLS_DIR" "$AGENTS_SKILLS_DIR"; do ours "$t/$s" && rm "$t/$s" && say "unlinked $t/$s"; done
	done
	[ -f "$STATE" ] && grep -vx "$1" "$STATE" > "$STATE.new" && mv "$STATE.new" "$STATE"
	return 0
}

list() {
	local installed=""; [ -f "$STATE" ] && installed="$(tr '\n' ' ' < "$STATE")"
	for g in $(groups); do
		if contains "$installed" "$g"; then mark="installed"; else mark="-"; fi
		say "$g ($mark): $(skills_in "$g" | tr '\n' ' ')"
	done
}

# name: and description: from SKILL.md front matter (description may be a folded block).
front() { # file key
	awk -v key="$2" '
		NR == 1 && $0 == "---" { inside = 1; next }
		inside && $0 == "---" { if (block) print out; exit }
		inside && $0 ~ "^" key ":" { sub("^" key ":[ ]*", ""); if ($0 == ">" || $0 == "|" || $0 == ">-" || $0 == "|-") { block = 1; out = ""; next } print; exit }
		block && /^[ \t]/ { sub(/^[ \t]+/, ""); out = (out == "" ? $0 : out " " $0); next }
		block { print out; exit }
	' "$1"
}

check() {
	local problems=0 names="" s g d n desc len
	for g in $(groups); do
		for s in $(skills_in "$g"); do
			n="$(front "$SKILLS/$g/$s/SKILL.md" name)"
			desc="$(front "$SKILLS/$g/$s/SKILL.md" description)"
			len=${#desc}
			[ "$n" = "$s" ] || { warn "$g/$s: name is \"$n\", the folder is \"$s\""; problems=$((problems + 1)); }
			case "$s" in *[!a-z0-9-]*) warn "$g/$s: name must be lowercase-hyphen"; problems=$((problems + 1)) ;; esac
			{ [ "$len" -ge 1 ] && [ "$len" -le 1024 ]; } || { warn "$g/$s: description is $len characters (1 to 1024)"; problems=$((problems + 1)); }
			contains "$names" "$s" && { warn "$s: in two groups"; problems=$((problems + 1)); }
			names="$names $s"
		done
	done
	for t in "$CLAUDE_SKILLS_DIR" "$AGENTS_SKILLS_DIR"; do
		[ -d "$t" ] || continue
		for l in "$t"/*; do
			[ -e "$l" ] || [ -L "$l" ] || continue
			if ours "$l" && [ ! -e "$l" ]; then warn "$l: dead link (run ./install.sh)"; problems=$((problems + 1)); fi
			if [ ! -L "$l" ] && contains "$names" "$(basename "$l")"; then warn "$l: a real folder shadows the repo's $(basename "$l")"; problems=$((problems + 1)); fi
		done
	done
	[ "$problems" -eq 0 ] && say "check: ok ($(printf '%s\n' $names | grep -c .) skills)" || { say "check: $problems problem(s)"; exit 1; }
}

zip_target() {
	command -v zip > /dev/null || { warn "zip is not installed"; exit 1; }
	mkdir -p "$REPO/dist"
	local list=""
	if has_group "$1"; then list="$(for s in $(skills_in "$1"); do printf '%s/%s\n' "$1" "$s"; done)"
	else for g in $(groups); do [ -d "$SKILLS/$g/$1" ] && list="$g/$1"; done; fi
	[ -n "$list" ] || { warn "no group or skill \"$1\""; exit 1; }
	for gs in $list; do
		s="$(basename "$gs")"
		rm -f "$REPO/dist/$s.zip"
		(cd "$SKILLS/$(dirname "$gs")" && zip -qr "$REPO/dist/$s.zip" "$s" -x '*.DS_Store')
		say "dist/$s.zip"
	done
}

case "${1:-}" in
	--remove) remove_group "${2:?group}" ;;
	--list) list ;;
	--check) check ;;
	--zip) zip_target "${2:?group or skill}" ;;
	-h | --help) sed -n '2,15p' "$0" | sed 's/^# \{0,1\}//' ;;
	"")
		if [ -f "$STATE" ]; then install_groups $(cat "$STATE"); else install_groups; fi ;;
	-*) warn "unknown option $1"; exit 1 ;;
	*) install_groups "$@" ;;
esac
