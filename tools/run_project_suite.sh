#!/usr/bin/env bash
# Run one project's conformance suite. Same command locally and in CI, so a
# team can reproduce exactly what the pull request check ran.
#
#   bash tools/run_project_suite.sh challenges/p2-my-workday-assistant
#   ERI_INSTALL_BROWSERS=1 bash tools/run_project_suite.sh challenges/p2-...
#
# THE SUITE IS WHATEVER THE PROJECT DECLARES. `npm run ci` is this repo's
# existing convention for "everything this project asserts" -- challenges 02
# and 03 defined it as `npm test && npm run bdd && npm run test:a11y`, and the
# newer projects define their own. This script does not impose a shape on it.
# An earlier draft required all three of `test`, `bdd` and `test:a11y`, which
# would have turned three of the four live projects red for not having written
# their browser suite yet. Mandating a shape nobody agreed to is not a gate,
# it is a surprise.
#
# Hard red (exit 1 or 2), because each of these means the suite did not run:
#   * the directory does not exist
#   * no package.json and no composer.json: nothing can be run
#   * no `ci` script and no `test` script: the project declares no suite
#   * install failed, or a stage failed
#
# REPORTED, not red: which stages the project's suite actually contains. A
# project whose `ci` runs unit tests and nothing else is a real and legitimate
# state five days before an event -- but it must be VISIBLE, because "the
# accessibility suite passed" and "there is no accessibility suite" must never
# look the same to a reviewer. So the absence is printed, annotated as a
# GitHub warning, and written to the run summary. Whether that is acceptable
# for a given attempt is section 3 of the pull request template, where a human
# answers it.
#
# Browsers install only when ERI_INSTALL_BROWSERS=1: on a laptop
# `playwright install --with-deps` wants sudo, so CI opts in and people don't.
set -uo pipefail

DIR="${1:-}"
if [ -z "$DIR" ]; then
  echo "usage: bash tools/run_project_suite.sh <project-dir>" >&2
  exit 2
fi
cd "$(dirname "$0")/.." || exit 2

if [ ! -d "$DIR" ]; then
  echo "::error::$DIR does not exist. Nothing was run." >&2
  exit 2
fi

FAILED=()
RAN=0

note() {  # note <text> -- to stdout and, in CI, to the run summary
  printf '%s\n' "$1"
  [ -n "${GITHUB_STEP_SUMMARY:-}" ] && printf '%s\n' "$1" >> "$GITHUB_STEP_SUMMARY"
  return 0
}

run() {  # run <label> <command...>
  local label="$1"; shift
  printf '\n== %s\n' "$label"
  if "$@"; then
    RAN=$((RAN + 1))
  else
    local rc=$?
    echo "::error::$label failed (exit $rc) in $DIR" >&2
    FAILED+=("$label")
  fi
}

script_body() {  # script_body <name> -- prints it, or exits 1 if undefined
  node -e '
    const fs = require("fs");
    const p = JSON.parse(fs.readFileSync(process.argv[1], "utf8"));
    const s = (p.scripts || {})[process.argv[2]];
    if (!s) process.exit(1);
    process.stdout.write(s);
  ' "$DIR/package.json" "$1" 2>/dev/null
}

if [ -f "$DIR/package.json" ]; then
  command -v node >/dev/null 2>&1 || { echo "::error::node is required to run $DIR" >&2; exit 2; }

  CI_BODY="$(script_body ci)";     HAVE_CI=$?
  TEST_BODY="$(script_body test)"; HAVE_TEST=$?
  if [ "$HAVE_CI" -ne 0 ] && [ "$HAVE_TEST" -ne 0 ]; then
    echo "::error::$DIR/package.json defines neither a \`ci\` nor a \`test\` script, so this project declares no suite." >&2
    cat >&2 <<'EOF'
Define at least:
  "test": "node --test test/*.test.js"
and preferably a `ci` script composing everything the project asserts, e.g.
  "ci": "npm test && npm run bdd && npm run test:a11y"
A project with no suite is not a passing project.
EOF
    exit 2
  fi

  printf '== install (%s)\n' "$DIR"
  if [ -f "$DIR/package-lock.json" ]; then
    (cd "$DIR" && npm ci) || { echo "::error::npm ci failed in $DIR" >&2; exit 1; }
  elif [ -d "$DIR/node_modules" ] || [ "$(node -e '
      const p=JSON.parse(require("fs").readFileSync(process.argv[1],"utf8"));
      const n=Object.keys(p.dependencies||{}).length+Object.keys(p.devDependencies||{}).length;
      process.stdout.write(String(n));' "$DIR/package.json" 2>/dev/null || echo 0)" != "0" ]; then
    echo "no package-lock.json; using npm install (commit the lockfile)"
    (cd "$DIR" && npm install --no-audit --no-fund) \
      || { echo "::error::npm install failed in $DIR" >&2; exit 1; }
  else
    echo "no dependencies and no lockfile: nothing to install"
  fi

  # Only worth the ~40s if the suite mentions playwright at all.
  if [ "${ERI_INSTALL_BROWSERS:-0}" = "1" ] \
     && grep -qi 'playwright' "$DIR/package.json" 2>/dev/null; then
    printf '== playwright browsers\n'
    (cd "$DIR" && npx playwright install --with-deps chromium) \
      || { echo "::error::playwright browser install failed in $DIR" >&2; exit 1; }
  fi

  if [ "$HAVE_CI" -eq 0 ]; then
    echo "suite: npm run ci  ->  $CI_BODY"
    run "npm run ci" bash -c "cd '$DIR' && npm run ci"
  else
    echo "suite: npm test (no \`ci\` script defined)  ->  $TEST_BODY"
    run "npm test" bash -c "cd '$DIR' && npm test"
  fi

  # What the suite does NOT contain. Reported, never silently absorbed.
  COMPOSITION="${CI_BODY:-$TEST_BODY}"
  MISSING=()
  case "$COMPOSITION" in *a11y*|*axe*|*playwright*) ;; *) MISSING+=("accessibility") ;; esac
  case "$COMPOSITION" in *bdd*|*cucumber*|*behat*)  ;; *) MISSING+=("bdd") ;; esac
  if [ ${#MISSING[@]} -gt 0 ]; then
    echo "::warning file=$DIR/package.json::$DIR's suite contains no ${MISSING[*]} stage. Not a failure, but a reviewer must know: an absent check and a passing check are not the same thing."
    note "- \`$DIR\`: suite ran, and contains **no ${MISSING[*]} stage**."
  else
    note "- \`$DIR\`: suite ran, with unit, bdd and accessibility stages."
  fi

elif [ -f "$DIR/composer.json" ]; then
  command -v composer >/dev/null 2>&1 || { echo "::error::composer is required to run $DIR" >&2; exit 2; }
  printf '== composer install (%s)\n' "$DIR"
  (cd "$DIR" && composer install --no-interaction --no-progress) \
    || { echo "::error::composer install failed in $DIR" >&2; exit 1; }
  run "composer test" bash -c "cd '$DIR' && composer test"
  if (cd "$DIR" && composer run-script --list 2>/dev/null | grep -qE '^\s*bdd'); then
    run "composer bdd" bash -c "cd '$DIR' && composer bdd"
  else
    echo "::warning file=$DIR/composer.json::$DIR defines no \`bdd\` script."
    note "- \`$DIR\`: suite ran, and contains **no bdd stage**."
  fi

else
  echo "::error::$DIR has neither package.json nor composer.json, so its suite cannot run." >&2
  echo "A suite that cannot run must not report as passing." >&2
  exit 2
fi

printf '\n---------------------------------------------\n'
printf '%s: %d stage(s) passed, %d failed\n' "$DIR" "$RAN" "${#FAILED[@]}"
if [ ${#FAILED[@]} -gt 0 ]; then
  printf 'FAILED:\n'; printf '  - %s\n' "${FAILED[@]}"
  exit 1
fi
if [ "$RAN" -eq 0 ]; then
  echo "::error::nothing ran for $DIR. Refusing to report a pass." >&2
  exit 2
fi
exit 0
