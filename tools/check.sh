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
  if "$@"; then
    PASSED=$((PASSED + 1))
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
  cd "challenges/$1" &&
  node --test test/*.test.js >/dev/null && echo "  PASS node:test" &&
  # Skip cucumber when deps are not installed, but never swallow a real BDD
  # failure. The previous `... || true` did both, and node_modules IS present
  # in both node challenges, so a failing suite was silently passing.
  # Say so when cucumber is skipped. It used to vanish in silence, and
  # infra/generate.py drops node_modules from the team images, so the day-of
  # workspace ran NEITHER BDD suite while printing "All smoke tests passed".
  # Still not counted in SKIPPED (this runs in a subshell and cannot reach
  # that array), so the run can exit 0 having skipped cucumber -- visible now,
  # but short of the exit-2 contract at the top of this file.
  { if [ -d node_modules ]; then npx cucumber-js --format summary >/dev/null && echo "  PASS cucumber"; \
    else echo "  SKIP cucumber (no node_modules; run npm install)"; fi; } &&
  # Skip the lint when php is absent, but NEVER swallow a real lint failure.
  # `have php && php -l ... || true` did both: measured 2026-10-26, a genuine
  # syntax error gave php -l rc=255 while check.sh still reported rc=0 and
  # "passed: 10 failed: 0".
  { if have php; then php -l "wp-plugin/$2/$2.php" >/dev/null; fi; }
)
static_web() { ( cd starters/static-web && node --test test/*.test.js >/dev/null && echo "  PASS node:test" ); }
guardrails() { python3 tools/check_synthetic.py && python3 tools/check_links.py && python3 tools/check_derived.py && bash tools/check_secrets.sh; }

step "data"         python3 data_summary
step "php-mysql"    php     php_mysql
step "wordpress"    php     wordpress
step "block"        php     block
step "ai-helpers"   php     ai_helpers
step "challenge 01" php     challenge01
step "challenge 02" node    node_challenge 02-job-fit-checker      eri-job-fit
step "challenge 03" node    node_challenge 03-job-post-checker     eri-job-post-checker
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
  cat <<'HINT'

To run the skipped steps, install the missing tools:
  Fedora/RHEL   sudo dnf install -y php-cli php-xml php-mbstring php-pdo composer nodejs git
  Debian/Ubuntu sudo apt install -y php-cli php-xml php-mbstring composer nodejs git
  macOS         brew install php composer node git
Or use GitHub Codespaces / the day-of browser IDE, which have everything.
HINT
fi

[ ${#FAILED[@]} -gt 0 ] && exit 1
[ ${#SKIPPED[@]} -gt 0 ] && exit 2
echo
echo "All smoke tests passed."
exit 0
