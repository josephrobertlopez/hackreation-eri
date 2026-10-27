#!/usr/bin/env bash
# Cases for tools/derive_touched_projects.py, the change-aware router.
#
# Run it: bash tools/t/derive_cases.sh
#
# It builds a FIXTURE tree in a temp directory with four project folders,
# because the real repo's folders come and go while teams work and a test
# that depends on them is a test that goes red for unrelated reasons.
set -uo pipefail
cd "$(dirname "$0")/../.."
SRC="$PWD"

FIX="$(mktemp -d)"
trap 'rm -rf "$FIX"' EXIT
mkdir -p "$FIX/tools" "$FIX/challenges"
cp "$SRC/tools/derive_touched_projects.py" "$FIX/tools/"
for d in p1-alpha p2-bravo p3-charlie p4-delta; do
  mkdir -p "$FIX/challenges/$d"
  echo '{"scripts":{"test":"true","bdd":"true","test:a11y":"true"}}' \
    > "$FIX/challenges/$d/package.json"
done
mkdir -p "$FIX/challenges/01-retired"
echo '{}' > "$FIX/challenges/01-retired/composer.json"

DERIVE="$FIX/tools/derive_touched_projects.py"
FAIL=0

ids() { printf '%s\n' "$@" | python3 "$DERIVE" 2>/dev/null \
  | tr ',' '\n' | grep -oE '"id":"P[0-9]+"' | grep -oE 'P[0-9]+' | paste -sd' ' -; }

want_ids() {  # want_ids <expected-space-separated> <label> <paths...>
  local want="$1" label="$2"; shift 2
  local got; got="$(ids "$@")"
  if [ "$got" = "$want" ]; then
    printf '  ok    %-50s -> [%s]\n' "$label" "$got"
  else
    printf '  FAIL  %-50s -> [%s], wanted [%s]\n' "$label" "$got" "$want"
    FAIL=$((FAIL + 1))
  fi
}

want_rc() {  # want_rc <expected-rc> <label> <paths...>
  local want="$1" label="$2"; shift 2
  printf '%s\n' "$@" | python3 "$DERIVE" >/dev/null 2>&1
  local got=$?
  if [ "$got" = "$want" ]; then
    printf '  ok    %-50s rc=%s\n' "$label" "$got"
  else
    printf '  FAIL  %-50s rc=%s, wanted %s\n' "$label" "$got" "$want"
    FAIL=$((FAIL + 1))
  fi
}

echo "derive_touched_projects.py cases"
want_ids "P2"             "one project touched"          challenges/p2-bravo/web/app.js
want_ids "P2 P4"          "two projects touched"         challenges/p2-bravo/a.js challenges/p4-delta/b.js
want_ids ""               "no project folder in the diff" README.md wiki/prds/p1-alpha.md
want_ids ""               "a retired, non-p<n> folder"   challenges/01-retired/src/etl.php
want_ids "P1 P2 P3 P4"    "topology: a workflow changed" challenges/p2-bravo/x.js .github/workflows/conformance.yml
want_ids "P1 P2 P3 P4"    "topology: the problem statements" docs/eri-problem-statements.md
want_ids "P1 P2 P3 P4"    "topology: a shared tool"      tools/run_project_suite.sh
want_ids ""               "empty diff"                   ""

# A touched folder with no manifest must be RED, not an empty-and-green matrix:
# "its suite could not run" and "its suite passed" must never look the same.
mkdir -p "$FIX/challenges/p9-no-manifest"
echo x > "$FIX/challenges/p9-no-manifest/a.txt"
want_rc 2 "touched folder with no manifest" challenges/p9-no-manifest/a.txt
rm -rf "$FIX/challenges/p9-no-manifest"

# A fresh copy generated from the template has no project folders at all. That
# must be an empty matrix and exit 0, not a crash: every workflow has to work
# in a generated repo with nothing configured.
FRESH="$(mktemp -d)"
mkdir -p "$FRESH/tools"; cp "$SRC/tools/derive_touched_projects.py" "$FRESH/tools/"
out="$(printf 'src/x.js\n' | python3 "$FRESH/tools/derive_touched_projects.py" 2>/dev/null)"
rc=$?
if [ "$rc" = 0 ] && [ "$out" = "[]" ]; then
  printf '  ok    %-50s -> %s\n' "fresh repo, no project folders" "$out"
else
  printf '  FAIL  %-50s -> %s rc=%s\n' "fresh repo, no project folders" "$out" "$rc"
  FAIL=$((FAIL + 1))
fi
rm -rf "$FRESH"

# Same files in a different order must give byte-identical output, or the
# matrix churns and caches miss for no reason.
a="$(printf 'challenges/p4-delta/a.js\nchallenges/p1-alpha/b.js\n' | python3 "$DERIVE" 2>/dev/null)"
b="$(printf 'challenges/p1-alpha/b.js\nchallenges/p4-delta/a.js\n' | python3 "$DERIVE" 2>/dev/null)"
if [ "$a" = "$b" ] && [ -n "$a" ]; then
  printf '  ok    %-50s\n' "deterministic regardless of input order"
else
  printf '  FAIL  %-50s\n' "deterministic regardless of input order"
  FAIL=$((FAIL + 1))
fi

echo
if [ "$FAIL" -gt 0 ]; then echo "$FAIL case(s) FAILED"; exit 1; fi
echo "all cases behave as specified"
