#!/usr/bin/env bash
# Cases for tools/run_project_suite.sh.
#
# Run it: bash tools/t/suite_runner_cases.sh
#
# The two that matter:
#   * a project declaring NO suite at all is red, not an empty pass;
#   * a project whose suite has no accessibility stage still passes, but the
#     absence is REPORTED. "There is no accessibility check" and "the
#     accessibility check passed" must never look the same to a reviewer.
set -uo pipefail
cd "$(dirname "$0")/../.."
SRC="$PWD"

FIX="$(mktemp -d)"
trap 'rm -rf "$FIX"' EXIT
mkdir -p "$FIX/tools" "$FIX/challenges"
cp "$SRC/tools/run_project_suite.sh" "$FIX/tools/"

mk() { mkdir -p "$FIX/challenges/$1"; printf '%s' "$2" > "$FIX/challenges/$1/package.json"; }
mk full      '{"scripts":{"test":"true","bdd":"true","test:a11y":"true","ci":"npm test && npm run bdd && npm run test:a11y"}}'
mk ci-fails  '{"scripts":{"test":"true","ci":"false"}}'
mk unit-only '{"scripts":{"test":"true","ci":"npm test"}}'
mk test-only '{"scripts":{"test":"true"}}'
mk test-red  '{"scripts":{"test":"false"}}'
mk no-suite  '{"scripts":{"start":"true"}}'
mkdir -p "$FIX/challenges/no-manifest"; echo x > "$FIX/challenges/no-manifest/a.txt"

FAIL=0
RUN="$FIX/tools/run_project_suite.sh"

want() {  # want <expected-rc> <label> [args...]
  local expect="$1" label="$2"; shift 2
  bash "$RUN" "$@" >/dev/null 2>&1
  local got=$?
  if [ "$got" = "$expect" ]; then
    printf '  ok    %-48s rc=%s\n' "$label" "$got"
  else
    printf '  FAIL  %-48s rc=%s, wanted %s\n' "$label" "$got" "$expect"
    FAIL=$((FAIL + 1))
  fi
}

says() {  # says <label> <dir> <pattern>
  # Capture first, THEN grep. `cmd | grep -q` under `set -o pipefail` reports
  # failure whenever grep matches early enough to SIGPIPE the producer, which
  # made a passing assertion read as a failing one here. Measured, not
  # theoretical: the pattern that matches on line 3 of 25 failed while the
  # same grep against the same text in a file passed.
  local label="$1" dir="$2" pat="$3" out
  out="$(bash "$RUN" "$dir" 2>&1)"
  if printf '%s\n' "$out" | grep -qiE "$pat"; then
    printf '  ok    %-48s\n' "$label"
  else
    printf '  FAIL  %-48s (no match for %s)\n' "$label" "$pat"
    FAIL=$((FAIL + 1))
  fi
}

echo "run_project_suite.sh cases"
want 0 "full suite, ci passes"              challenges/full
want 1 "ci script fails"                    challenges/ci-fails
want 0 "unit-only ci passes"                challenges/unit-only
want 0 "no ci script, falls back to test"   challenges/test-only
want 1 "no ci script, test fails"           challenges/test-red
want 2 "neither ci nor test defined"        challenges/no-suite
want 2 "no package.json or composer.json"   challenges/no-manifest
want 2 "directory does not exist"           challenges/nope
want 2 "no argument"

# The reporting half. A silent pass on a suite with no a11y stage is the
# fake-green this repo keeps finding, so assert the words are actually printed.
says "unit-only suite reports no accessibility stage" \
     challenges/unit-only 'no accessibility.*stage|no accessibility bdd stage'
says "unit-only suite emits a GitHub warning annotation" \
     challenges/unit-only '::warning'
says "full suite reports all three stages present" \
     challenges/full 'unit, bdd and accessibility'
says "full suite reaches its summary line" challenges/full 'stage\(s\) passed'
full_out="$(bash "$RUN" challenges/full 2>&1)"
if printf '%s\n' "$full_out" | grep -q '::warning'; then
  printf '  FAIL  %-48s\n' "full suite emits no warning"
  FAIL=$((FAIL + 1))
else
  printf '  ok    %-48s\n' "full suite emits no warning"
fi

# Which script was chosen must be stated, so a reviewer can see what ran.
says "prints the suite composition it is about to run" \
     challenges/full 'suite: npm run ci'

echo
if [ "$FAIL" -gt 0 ]; then echo "$FAIL case(s) FAILED"; exit 1; fi
echo "all cases behave as specified"
