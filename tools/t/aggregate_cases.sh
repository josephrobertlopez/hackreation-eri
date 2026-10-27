#!/usr/bin/env bash
# Truth table for tools/aggregate_conformance.sh, the body of the required
# status check.
#
# Run it: bash tools/t/aggregate_cases.sh
#
# Case 6 is the one worth having a test for. Legs were selected and then did
# not run; if that mapped to green, deleting a project's suite would make the
# required check pass. Every other row is a sanity check on this one.
set -uo pipefail
cd "$(dirname "$0")/../.."

FAIL=0
P2='[{"id":"P2","dir":"challenges/p2-my-workday-assistant","runner":"npm"}]'

case_is() {  # case_is <want-rc> <label> <DETECT> <SUITE> <PROJECTS>
  local want="$1" label="$2"
  DETECT="$3" SUITE="$4" PROJECTS="$5" REASON="test" \
    bash tools/aggregate_conformance.sh >/dev/null 2>&1
  local got=$?
  if [ "$got" = "$want" ]; then
    printf '  ok    %-56s rc=%s\n' "$label" "$got"
  else
    printf '  FAIL  %-56s rc=%s, wanted %s\n' "$label" "$got" "$want"
    FAIL=$((FAIL + 1))
  fi
}

echo "aggregate_conformance.sh truth table"
case_is 0 "one project selected, suite passed"        success success  "$P2"
case_is 1 "one project selected, suite failed"        success failure  "$P2"
case_is 1 "one project selected, suite cancelled"     success cancelled "$P2"
case_is 0 "no project touched, suite skipped"         success skipped  '[]'
case_is 0 "no project touched, empty projects string" success skipped  ''
case_is 1 "projects SELECTED but suite skipped"       success skipped  "$P2"
case_is 1 "detection failed"                          failure skipped  '[]'
case_is 1 "detection cancelled"                       cancelled success "$P2"
case_is 1 "detection skipped"                         skipped success  "$P2"
case_is 1 "unknown suite result"                      success weird    "$P2"
case_is 1 "empty inputs"                              ""      ""       ""

echo
if [ "$FAIL" -gt 0 ]; then
  echo "$FAIL case(s) FAILED"
  exit 1
fi
echo "all cases behave as specified"
