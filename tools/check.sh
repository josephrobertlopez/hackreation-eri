#!/usr/bin/env bash
# Smoke-test every starter that can run without Docker or network.
#
# Runs what your machine can run and SKIPS the rest by name. It does not stop
# at the first missing tool: a laptop with Node but no PHP still gets the Node
# and Python results, which is the path the kickoff deck recommends to screen
# reader users.
#
# Exit codes
#   0  everything ran and passed
#   1  something ran and FAILED
#   2  everything that ran passed, but steps were skipped for missing tools
#
# 2 is deliberately not 0. A run that skipped half the suite has not told you
# the repo is healthy, and should not look like it did.
cd "$(dirname "$0")/.."

FAILED=()
SKIPPED=()
PASSED=0

have() { command -v "$1" >/dev/null 2>&1; }

# step <label> <required-tool>[,<tool>...] <command...>
step() {
  local label="$1" tools="$2"; shift 2
  local missing=()
  local t
  for t in ${tools//,/ }; do have "$t" || missing+=("$t"); done
  if [ ${#missing[@]} -gt 0 ]; then
    printf '== %-14s SKIP (needs: %s)\n' "$label" "${missing[*]}"
    SKIPPED+=("$label (needs ${missing[*]})")
    return 0
  fi
  printf '== %s\n' "$label"
  # rc 3 is the in-band "ran, passed, but skipped an inner step" signal. A step
  # that runs in a subshell -- node_challenge does, because its `cd` must not
  # escape -- cannot append to SKIPPED, so before 2026-10-26 an inner skip was
  # invisible to the exit-code contract at the top of this file: the day-of
  # image has no node_modules, and the run printed "passed: 10 failed: 0" and
  # exited 0 having executed NEITHER BDD suite.
  "$@"; local rc=$?
  if [ "$rc" -eq 0 ]; then
    PASSED=$((PASSED + 1))
  elif [ "$rc" -eq 3 ]; then
    PASSED=$((PASSED + 1))
    SKIPPED+=("$label (an inner step was skipped; see its output above)")
  else
    printf '   FAILED: %s\n' "$label" >&2
    FAILED+=("$label")
  fi
}

data_summary() {
  python3 - <<'PY'
import csv, glob
for f in sorted(g for g in glob.glob('data/**/*.csv', recursive=True)
                if not g.startswith('data/public')):
    with open(f, encoding='utf-8') as fh:
        print(f'  {f}: {sum(1 for _ in csv.DictReader(fh))} rows')
PY
}

php_mysql() (
  cd starters/php-mysql &&
  php seed.php &&
  php -r 'require "src/db.php"; echo "  rows in db: ".db()->query("select count(*) from job_postings")->fetchColumn()."\n";' &&
  rm -f eri.sqlite
)
wordpress()  { php -l starters/wordpress-plugin/eri-hello/eri-hello.php >/dev/null && php starters/wordpress-plugin/tests/smoke.php; }
block()      { php -l starters/eri-job-card/eri-job-card.php >/dev/null && test -f starters/eri-job-card/build/eri-job-card/index.js && echo "  PASS block build present"; }
ai_helpers() { php starters/ai-helpers/php/hello_llm.php | head -1; }
challenge01(){ ( cd challenges/01-funding-gap-finder && php tests/smoke.php && rm -f ledger.csv ); }
node_challenge() (
  cd "challenges/$1" || exit 1
  inner_skip=0
  node --test test/*.test.js >/dev/null && echo "  PASS node:test" || exit 1
  # Skip cucumber when deps are not installed, but never swallow a real BDD
  # failure. The previous `... || true` did both, and node_modules IS present
  # in both node challenges, so a failing suite was silently passing.
  # infra/generate.py drops node_modules from the team images, so the day-of
  # workspace runs NEITHER BDD suite. That now exits 3, step() records it in
  # SKIPPED, and the whole run exits 2 -- the contract at the top of this file.
  if [ -d node_modules ]; then
    npx cucumber-js --format summary >/dev/null && echo "  PASS cucumber" || exit 1
  else
    echo "  SKIP cucumber (no node_modules; run npm install)"
    inner_skip=1
  fi
  # Skip the lint when php is absent, but NEVER swallow a real lint failure.
  # `have php && php -l ... || true` did both: measured 2026-10-26, a genuine
  # syntax error gave php -l rc=255 while check.sh still reported rc=0 and
  # "passed: 10 failed: 0".
  if have php; then php -l "wp-plugin/$2/$2.php" >/dev/null || exit 1; fi
  [ "$inner_skip" -eq 1 ] && exit 3
  exit 0
)
# ERI's four projects. Runs each project's `npm test` only -- the node suite,
# no dependencies, no browser. Each folder also defines `npm run ci`, which is
# the fuller run (P1 adds a headless-browser smoke, P2 adds BDD + a11y stages);
# CI runs that via tools/run_project_suite.sh. Keeping check.sh to `npm test`
# means this file still works on a laptop with nothing but node installed,
# which is the whole point of the SKIP-by-name design above.
#
# These four were absent from this runner until 2026-10-26, while README said
# "run every smoke test: bash tools/check.sh". It ran none of ERI's four.
eri_project() ( cd "challenges/$1" && npm test --silent >/dev/null 2>&1 && echo "  PASS node:test" )
static_web() { ( cd starters/static-web && node --test test/*.test.js >/dev/null && echo "  PASS node:test" ); }
guardrails() { python3 tools/check_synthetic.py && python3 tools/check_links.py && python3 tools/check_quotes.py && python3 tools/check_derived.py && bash tools/check_secrets.sh; }

step "data"         python3 data_summary
step "php-mysql"    php     php_mysql
step "wordpress"    php     wordpress
step "block"        php     block
step "ai-helpers"   php     ai_helpers
step "challenge 01" php     challenge01
step "challenge 02" node    node_challenge 02-job-fit-checker      eri-job-fit
step "challenge 03" node    node_challenge 03-job-post-checker     eri-job-post-checker
step "P1 skills"    node    eri_project p1-show-your-skills
step "P2 workday"   node    eri_project p2-my-workday-assistant
step "P3 coach"     node    eri_project p3-job-coach-connection
step "P4 employer"  node    eri_project p4-employer-hub
step "static-web"   node    static_web
# Gated on python3 only. The guards were deliberately taught to work without
# git (the day-of workspace has no .git), so requiring git here would skip all
# three on a laptop that lacks it, including the two that never touch git.
step "guardrails"   python3 guardrails

echo
echo "---------------------------------------------"
printf 'passed: %d   failed: %d   skipped: %d\n' "$PASSED" "${#FAILED[@]}" "${#SKIPPED[@]}"

if [ ${#FAILED[@]} -gt 0 ]; then
  printf '\nFAILED:\n'; printf '  - %s\n' "${FAILED[@]}"
fi

if [ ${#SKIPPED[@]} -gt 0 ]; then
  printf '\nSKIPPED (not proven, not passing):\n'
  printf '  - %s\n' "${SKIPPED[@]}"
  # Only offer the install-the-tools advice when something was actually skipped
  # for a MISSING TOOL. Measured 2026-10-26 in the day-of team image: the only
  # skips there are the two BDD suites, skipped for absent node_modules, and
  # this block still told the attendee to install php, node and git -- all three
  # already present, and no sudo in that container anyway. Wrong next step is
  # worse than none when someone has six hours.
  if printf '%s\n' "${SKIPPED[@]}" | grep -q '(needs '; then
    cat <<'HINT'

To run the skipped steps, install the missing tools:
  Fedora/RHEL   sudo dnf install -y php-cli php-xml php-mbstring php-pdo composer nodejs git
  Debian/Ubuntu sudo apt install -y php-cli php-xml php-mbstring composer nodejs git
  macOS         brew install php composer node git
Or use GitHub Codespaces / the day-of browser IDE, which have everything.
HINT
  else
    cat <<'HINT'

Nothing is missing from this machine. The skips above are inner steps that
need dependencies installed in the project folder -- run `npm install` in the
challenge the skip names, then re-run this script.
HINT
  fi
fi

[ ${#FAILED[@]} -gt 0 ] && exit 1
[ ${#SKIPPED[@]} -gt 0 ] && exit 2
echo
echo "All smoke tests passed."
exit 0
