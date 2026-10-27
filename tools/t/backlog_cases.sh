#!/usr/bin/env bash
# Cases for tools/gen_backlog.py, the only place backlog IDs are minted.
#
# Run it: bash tools/t/backlog_cases.sh
#
# This asserts PROPERTIES, not counts. If ERI edits the PDF and a features
# table grows a row, the right outcome is a new count and a visible diff --
# not a red gate defending yesterday's total. So: IDs are unique, IDs are
# positional and contiguous, every entry carries ERI's text, the generator is
# deterministic, and it refuses to emit an empty backlog.
set -uo pipefail
cd "$(dirname "$0")/../.."
FAIL=0

say() {  # say <ok|FAIL> <label> [detail]
  if [ "$1" = ok ]; then printf '  ok    %-50s %s\n' "$2" "${3:-}"
  else printf '  FAIL  %-50s %s\n' "$2" "${3:-}"; FAIL=$((FAIL + 1)); fi
}

echo "gen_backlog.py cases"

python3 tools/gen_backlog.py --check >/dev/null 2>&1 \
  && say ok "committed backlog matches ERI's document" \
  || say FAIL "committed backlog matches ERI's document" "run tools/gen_backlog.py"

# Deterministic: two runs, byte-identical output.
before="$(md5sum docs/eri-backlog.md docs/eri-backlog.json)"
python3 tools/gen_backlog.py --quiet >/dev/null 2>&1
after="$(md5sum docs/eri-backlog.md docs/eri-backlog.json)"
[ "$before" = "$after" ] \
  && say ok "re-running changes nothing" \
  || say FAIL "re-running changes nothing"

python3 tools/t/_backlog_props.py
rc=$?
[ "$rc" -eq 0 ] || FAIL=$((FAIL + 1))

# The loud-failure path: no source document means no backlog, not an empty one.
# An empty backlog that looks generated is worse than none, because every ID
# claim in every pull request would then validate against nothing.
TMP="$(mktemp -d)"; trap 'rm -rf "$TMP"' EXIT
mkdir -p "$TMP/tools" "$TMP/docs"
cp tools/gen_backlog.py "$TMP/tools/"
python3 "$TMP/tools/gen_backlog.py" >/dev/null 2>&1
rc=$?
[ "$rc" -eq 2 ] \
  && say ok "no source document -> exit 2, writes nothing" \
  || say FAIL "no source document -> exit 2, writes nothing" "got rc=$rc"
[ -e "$TMP/docs/eri-backlog.md" ] \
  && say FAIL "and it really wrote nothing" \
  || say ok "and it really wrote nothing"

# A document of the right shape but with no tables or lists must also refuse.
printf '# nothing\n\n## Project 9: Empty\n\n### 4. Core features\n\nno table here\n' \
  > "$TMP/docs/eri-problem-statements.md"
python3 "$TMP/tools/gen_backlog.py" >/dev/null 2>&1
rc=$?
[ "$rc" -eq 2 ] \
  && say ok "parsed zero entries -> exit 2, not an empty backlog" \
  || say FAIL "parsed zero entries -> exit 2, not an empty backlog" "got rc=$rc"

echo
if [ "$FAIL" -gt 0 ]; then echo "$FAIL case(s) FAILED"; exit 1; fi
echo "all cases behave as specified"
