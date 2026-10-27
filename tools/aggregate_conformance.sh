#!/usr/bin/env bash
# Map a change-aware matrix result onto ONE verdict.
#
# This is the body of the required status check. It lives in a file, not inline
# in the workflow, for one reason: inline gate logic is never tested, and this
# is the piece of the pipeline whose failure mode is a GREEN check on work that
# did not run. `bash tools/t/aggregate_cases.sh` walks the truth table.
#
# Inputs, from the environment (that is how a workflow hands them over):
#   DETECT    result of the detection job: success | failure | cancelled | skipped
#   SUITE     result of the matrix job:    success | failure | cancelled | skipped
#   PROJECTS  the JSON array detection produced, e.g. [] or [{"id":"P2",...}]
#   REASON    human text explaining the routing (optional, for the summary)
#
# Exit 0 = green, 1 = red. The three rules that matter:
#
#   1. detection not succeeding is RED. Detection decides what runs, so a
#      broken detector produces an empty matrix, and an empty matrix skips,
#      and a skip would otherwise read as "nothing to do, all fine".
#   2. SUITE=skipped with a NON-empty project list is RED. That combination
#      means legs were selected and then did not run, which is the exact
#      shape of a check that passes because it never executed.
#   3. SUITE=skipped with an empty project list is GREEN, and this is the
#      whole point of the aggregator: a pull request that touches no project
#      folder has nothing to run, the repo-wide gates cover it, and a
#      required per-project check would hang forever waiting for a leg that
#      will never report.
set -uo pipefail

DETECT="${DETECT:-}"
SUITE="${SUITE:-}"
PROJECTS="${PROJECTS:-}"
REASON="${REASON:-(not given)}"

echo "detect=$DETECT  project-suite=$SUITE"
echo "projects=$PROJECTS"
echo "reason=$REASON"

if [ -n "${GITHUB_STEP_SUMMARY:-}" ]; then
  {
    echo "## Conformance (changed projects)"
    echo
    echo "| | |"
    echo "| --- | --- |"
    echo "| detect | \`$DETECT\` |"
    echo "| project suites | \`$SUITE\` |"
    echo "| projects run | \`$PROJECTS\` |"
    echo "| routing | $REASON |"
  } >> "$GITHUB_STEP_SUMMARY"
fi

if [ "$DETECT" != "success" ]; then
  echo "::error::project detection reported '$DETECT', so nothing can be trusted to have run."
  exit 1
fi

case "$SUITE" in
  success)
    echo "every selected project suite passed."
    exit 0
    ;;
  skipped)
    if [ -n "$PROJECTS" ] && [ "$PROJECTS" != "[]" ]; then
      echo "::error::projects were selected ($PROJECTS) but no suite ran. A check that passes because it never executed is worse than a red one."
      exit 1
    fi
    echo "no project folder was touched; the repo-wide gates cover this change."
    exit 0
    ;;
  failure|cancelled)
    echo "::error::a project suite reported '$SUITE'."
    exit 1
    ;;
  *)
    echo "::error::unexpected project-suite result '$SUITE'. Refusing to guess."
    exit 1
    ;;
esac
