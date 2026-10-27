#!/usr/bin/env bash
# Every case suite for the gates in tools/. Run before pushing a change to any
# of them: bash tools/t/all.sh
#
# These are the falsifiers for the pull request machinery. They exist because a
# gate nobody has watched go red is not a gate, it is a decoration that happens
# to exit 0. One of them has already earned its keep: claims_cases.sh caught a
# regex that let an EMPTY `**Project:**` line absorb the next line, so a pull
# request declaring no project validated as declaring one.
#
# Nothing here needs network, Docker, npm or a browser, so it runs on a laptop,
# in a devcontainer, and in CI the same way.
set -uo pipefail
cd "$(dirname "$0")/../.."

SUITES=(
  tools/t/backlog_cases.sh
  tools/t/derive_cases.sh
  tools/t/claims_cases.sh
  tools/t/aggregate_cases.sh
  tools/t/suite_runner_cases.sh
)

FAILED=()
for s in "${SUITES[@]}"; do
  echo "=============================================="
  if bash "$s"; then :; else FAILED+=("$s"); fi
  echo
done

echo "=============================================="
printf 'suites: %d   failed: %d\n' "${#SUITES[@]}" "${#FAILED[@]}"
if [ ${#FAILED[@]} -gt 0 ]; then
  printf '  - %s\n' "${FAILED[@]}"
  exit 1
fi
echo "all gate suites pass"
