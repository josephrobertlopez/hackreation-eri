#!/usr/bin/env bash
# Fail if a credential looks committed. Used by CI and tools/check.sh.
#
# Lives in a script, not inline in the workflow, so it runs identically on a
# laptop and on the runner and can be tested without pushing.
#
# THREE THINGS THIS GOT WRONG BEFORE, each measured, each worth keeping:
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
#
# No path exclusions, deliberately. Excluding '*.md' hid all 143 markdown
# files; keeping ':!wiki/**' would still hide 97 of them; ':!*.example' hid a
# planted key in a .env.example, the exact file an attendee pastes a real key
# into before copying it to .env.
set -uo pipefail
cd "$(dirname "$0")/.."

# Tier 1: shapes that are only ever a real credential. Never filtered; these
# have zero matches on a clean tree, so any filtering is pure loss.
HIGH='(sk-ant-[A-Za-z0-9_-]{16,}|sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{30,}|glpat-[A-Za-z0-9_-]{16,}|xox[baprs]-[A-Za-z0-9-]{10,}|BEGIN (RSA|EC|OPENSSH) PRIVATE KEY|AKIA[0-9A-Z]{16})'

# Tier 2: any SCREAMING_CASE *_KEY / *_TOKEN assigned 20+ key-ish characters.
# Broad on purpose, which is why it needs the placeholder rule below.
GENERIC='[A-Z][A-Z0-9_]*_(KEY|TOKEN)[[:space:]]*=[[:space:]]*[A-Za-z0-9/+_-]{20,}'

# Anchored: a placeholder VALUE, not a value that merely contains the word.
PLACEHOLDER='^(YOUR[-_]|CHANGE[-_]?ME|REPLACE[-_]?ME|PLACEHOLDER|EXAMPLE[-_]|XXXX|<)'

TMP="$(mktemp)"
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
  assign="$(printf '%s' "$hit" | grep -oE "$GENERIC" | head -1)"
  value="$(printf '%s' "${assign#*=}" | sed 's/^[[:space:]]*//')"
  if printf '%s' "$value" | grep -qiE "$PLACEHOLDER"; then
    printf 'ignored as placeholder: %s\n' "$hit"
    ignored=$((ignored + 1))
  else
    printf '%s\n' "$hit"
    fail=1
  fi
done < "$TMP"

if [ "$fail" -ne 0 ]; then
  echo "::error::possible credential committed (see matches above)"
  exit 1
fi
printf 'no credential patterns found (%d placeholder line(s) ignored, listed above)\n' "$ignored"
