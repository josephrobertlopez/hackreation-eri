#!/usr/bin/env bash
# Fail if a credential looks committed. Used by CI and tools/check.sh.
#
# Lives in a script, not inline in the workflow, so it runs identically on a
# laptop and on the runner and can be tested without pushing.
#
# FIVE THINGS THIS GOT WRONG BEFORE, each measured, each worth keeping:
#
# 1. `! git grep ...` made ANY non-zero exit a pass, git's own fatals
#    included, so the step could pass having read nothing.
# 2. Replacing that with bare `git grep` + `rc=$?` was worse. GitHub Actions
#    runs a step as `bash -e {0}`, `set -uo pipefail` does NOT clear errexit,
#    and git grep exits 1 for "no match" -- so on a clean repo the step died
#    before the rc handling, rc=1, with ZERO output. A silently red gate gets
#    deleted under event pressure. Hence `|| rc=$?` on every grep here.
# 3. Filtering placeholders by matching the whole `path:lineno:content` line.
#    A token in the PATH or in nearby prose then suppressed real findings:
#    a genuine key was hidden by its variable being named YOUR_API_KEY and by
#    sitting in docs/your-first-app.md, while the identical key on a plain
#    line was caught. That blinded 204 lines across 55 files to serve 5 real
#    ones -- a path exclusion wearing a different hat. Placeholders are now
#    judged on the VALUE alone, and every suppression is printed.
# 4. `head -1` on the extracted assignments. Fix 3 was only half applied: the
#    FIRST assignment's value was judged and the verdict applied to the whole
#    line, so `DEMO_API_KEY=YOUR-KEY-HERE PROD_API_KEY=<40 hex>` exited 0 and
#    PRINTED the real key on a line labelled "ignored as placeholder". Same
#    mechanism as 3, narrowed from "whole line" to "first assignment". Now
#    EVERY assignment on the line is judged and one real value fails the line.
# 5. Requiring git without saying so. This script was added to the
#    tools/check.sh guardrails chain, which was deliberately taught to work
#    without git because infra/generate.py drops .git from the team images.
#    Measured in a tree with no .git and no ancestor .git: `git grep` exit
#    128, "FAILED: guardrails", check.sh rc=1 -- the first command the kickoff
#    deck gives attendees, red on all six workspaces. The run that said
#    otherwise was a fake-green: the generated copy sits INSIDE the source
#    repo, so git walked up and scanned the OUTER tree. A planted key in the
#    tree it was pointed at came back "no credential patterns found". Hence
#    the work-tree identity check below -- it both degrades honestly without
#    git and refuses to grade a tree other than this one.
#
# No path exclusions, deliberately. Excluding '*.md' hid all 143 markdown
# files; keeping ':!wiki/**' would still hide 97 of them; ':!*.example' hid a
# planted key in a .env.example, the exact file an attendee pastes a real key
# into before copying it to .env.
set -uo pipefail
cd "$(dirname "$0")/.." || { echo "::error::cannot cd to the repo root; the scan did not run" >&2; exit 1; }

# The scan reads git's index, so it is only meaningful when THIS directory is
# itself the top of a work tree. A copy without .git (the day-of workspace, an
# unzipped download) degrades out loud; CI sets ERI_REQUIRE_GIT=1 so the same
# condition is a hard failure there and cannot no-op behind a green check.
if [ "$(git rev-parse --show-toplevel 2>/dev/null)" != "$(pwd -P)" ]; then
  if [ "${ERI_REQUIRE_GIT:-}" = "1" ]; then
    echo "::error::not the top of a git work tree; the credential scan did not run" >&2
    exit 1
  fi
  echo "  NOTE: not a git work tree here (unzipped, or a copy without .git), so"
  echo "  the credential scan did not run. It runs in CI on every push and PR."
  exit 0
fi

# Tier 1: shapes that are only ever a real credential. Never filtered; these
# have zero matches on a clean tree, so any filtering is pure loss.
HIGH='(sk-ant-[A-Za-z0-9_-]{16,}|sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|glpat-[A-Za-z0-9_-]{16,}|xox[baprs]-[A-Za-z0-9-]{10,}|BEGIN ((RSA|EC|DSA|OPENSSH|PGP) )?(ENCRYPTED )?PRIVATE KEY|AKIA[0-9A-Z]{16})'

# Tier 2: any SCREAMING_CASE *_KEY / *_TOKEN assigned 20+ key-ish characters.
# Broad on purpose, which is why it needs the placeholder rule below.
GENERIC='[A-Z][A-Z0-9_]*_(KEY|TOKEN)[[:space:]]*=[[:space:]]*[A-Za-z0-9/+_-]{20,}'

# Anchored: a placeholder VALUE, not a value that merely contains the word.
PLACEHOLDER='^(YOUR[-_]|CHANGE[-_]?ME|REPLACE[-_]?ME|PLACEHOLDER|EXAMPLE[-_]|XXXX|<)'

TMP="$(mktemp)" || { echo "::error::mktemp failed; the scan did not run" >&2; exit 1; }
trap 'rm -f "$TMP"' EXIT
fail=0

grep_tracked() { # grep_tracked <pattern> ; prints hits, returns 2 on git error
  local pat="$1" rc=0 out
  out="$(git grep -nIE "$pat")" || rc=$?
  if [ "$rc" -gt 1 ]; then
    echo "::error::git grep failed with exit $rc; the scan did not run" >&2
    return 2
  fi
  printf '%s' "$out"
  return 0
}

HI="$(grep_tracked "$HIGH")" || exit 1
if [ -n "$HI" ]; then
  printf '%s\n' "$HI"
  echo "::error::credential-shaped token committed (see above)"
  fail=1
fi

GEN="$(grep_tracked "$GENERIC")" || exit 1
printf '%s\n' "$GEN" > "$TMP"
ignored=0
while IFS= read -r hit; do
  [ -z "$hit" ] && continue
  # Judge EVERY assignment on the line, not just the first. One real value
  # fails the line, even if a placeholder sits beside it.
  real=0
  seen=0
  while IFS= read -r assign; do
    [ -z "$assign" ] && continue
    seen=$((seen + 1))
    value="$(printf '%s' "${assign#*=}" | sed 's/^[[:space:]]*//')"
    printf '%s' "$value" | grep -qiE "$PLACEHOLDER" || real=1
  done <<EOF
$(printf '%s' "$hit" | grep -oE "$GENERIC")
EOF
  if [ "$seen" -eq 0 ] || [ "$real" -ne 0 ]; then
    printf '%s\n' "$hit"
    fail=1
  else
    printf 'ignored as placeholder: %s\n' "$hit"
    ignored=$((ignored + 1))
  fi
done < "$TMP"

if [ "$fail" -ne 0 ]; then
  echo "::error::possible credential committed (see matches above)"
  exit 1
fi
printf 'no credential patterns found (%d placeholder line(s) ignored, listed above)\n' "$ignored"
