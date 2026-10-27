#!/usr/bin/env bash
# Cases for tools/check_claims.py, which validates what a pull request DECLARES
# against the backlog and the diff.
#
# Run it: bash tools/t/claims_cases.sh
#
# Every body under test is derived from the real .github/PULL_REQUEST_TEMPLATE.md
# by sed, on purpose: if someone edits the template and breaks the two lines the
# checker reads, or renames a prohibition out from under it, these go red. A test
# with its own hand-written copy of the template would not notice.
set -uo pipefail
cd "$(dirname "$0")/../.."

TPL=".github/PULL_REQUEST_TEMPLATE.md"
WORK="$(mktemp -d)"
trap 'rm -rf "$WORK"' EXIT
FAIL=0

printf 'challenges/p2-my-workday-assistant/web/app.js\n' > "$WORK/p2.txt"
printf 'challenges/p4-employer-hub/x.js\n'                > "$WORK/p4.txt"
printf 'challenges/p2-my-workday-assistant/a.js\nchallenges/p4-employer-hub/b.js\n' > "$WORK/both.txt"
printf 'README.md\n'                                      > "$WORK/none.txt"

# A fully, honestly filled-in attempt.
sed -e 's/^\*\*Project:\*\* P?$/**Project:** P2/' \
    -e 's/^\*\*Backlog IDs claimed:\*\* P?-F?, P?-US?$/**Backlog IDs claimed:** P2-F4, P2-F5, P2-US2/' \
    -e 's/^- \[ \]/- [x]/' "$TPL" > "$WORK/good.md"

want() {  # want <expected-rc> <label> <body> <changed>
  local expect="$1" label="$2" body="$3" changed="$4"
  python3 tools/check_claims.py --body-file "$body" --changed "$changed" \
    >/dev/null 2>&1
  local got=$?
  if [ "$got" = "$expect" ]; then
    printf '  ok    %-52s rc=%s\n' "$label" "$got"
  else
    printf '  FAIL  %-52s rc=%s, wanted %s\n' "$label" "$got" "$expect"
    FAIL=$((FAIL + 1))
  fi
}

echo "check_claims.py cases"

# The template as shipped must NOT pass. If it did, every attempt would start
# green with nothing declared, and the check would be decoration.
want 1 "the shipped template, nothing filled in"  "$TPL"          "$WORK/p2.txt"
want 0 "filled in honestly"                       "$WORK/good.md" "$WORK/p2.txt"

sed 's/P2-F5/P2-F99/' "$WORK/good.md" > "$WORK/badid.md"
want 1 "an ID that is not in the backlog"         "$WORK/badid.md" "$WORK/p2.txt"

sed 's/P2-US2/P3-US2/' "$WORK/good.md" > "$WORK/cross.md"
want 1 "claimed IDs spanning two projects"        "$WORK/cross.md" "$WORK/p2.txt"

want 1 "declared project is not the folder touched" "$WORK/good.md" "$WORK/p4.txt"
want 1 "an ATTEMPT touching two project folders"  "$WORK/good.md" "$WORK/both.txt"

# ...but a shared fix across two projects, declaring no attempt, must pass.
# Failing it would push one accessibility fix into two pull requests, or into
# nobody making it.
printf 'fixing the same focus-trap in both\n' > "$WORK/shared.md"
want 0 "a shared fix across two folders, no project" "$WORK/shared.md" "$WORK/both.txt"
shared_out="$(python3 tools/check_claims.py --body-file "$WORK/shared.md" \
               --changed "$WORK/both.txt" 2>&1)"
if printf '%s\n' "$shared_out" | grep -q 'Cross-project change'; then
  printf '  ok    %-52s\n' "...and it is labelled as a cross-project change"
else
  printf '  FAIL  %-52s\n' "...and it is labelled as a cross-project change"
  FAIL=$((FAIL + 1))
fi

sed 's/^\*\*Project:\*\* P2$/**Project:**/' "$WORK/good.md" > "$WORK/noproj.md"
want 1 "no project declared"                      "$WORK/noproj.md" "$WORK/p2.txt"

sed 's/^\*\*Backlog IDs claimed:\*\*.*$/**Backlog IDs claimed:**/' "$WORK/good.md" > "$WORK/noids.md"
want 1 "no backlog IDs claimed"                   "$WORK/noids.md" "$WORK/p2.txt"

# ERI's prohibitions. Each one unticked, and each one deleted outright, must be
# red -- deleting the line is the obvious way around a checkbox gate.
for phrase in "disability or diagnosis" "scores or ranks" "automated hiring or accommodation"; do
  python3 - "$WORK/good.md" "$WORK/pro.md" "$phrase" <<'PY'
import sys
src, dst, phrase = sys.argv[1], sys.argv[2], sys.argv[3]
out = [ln.replace('- [x]', '- [ ]') if phrase in ln else ln
       for ln in open(src, encoding='utf-8')]
open(dst, 'w', encoding='utf-8').writelines(out)
PY
  want 1 "prohibition unticked: $phrase" "$WORK/pro.md" "$WORK/p2.txt"

  python3 - "$WORK/good.md" "$WORK/del.md" "$phrase" <<'PY'
import sys
src, dst, phrase = sys.argv[1], sys.argv[2], sys.argv[3]
out = [ln for ln in open(src, encoding='utf-8') if phrase not in ln]
open(dst, 'w', encoding='utf-8').writelines(out)
PY
  want 1 "prohibition line deleted: $phrase" "$WORK/del.md" "$WORK/p2.txt"
done

# The accessibility self-check and the human protocol are JUDGEMENTS. CI must
# report them and must not gate on them: a green tick from CI on "a screen
# reader pass happened" would be a lie about what was measured.
python3 - "$WORK/good.md" "$WORK/judge.md" <<'PY'
import sys
keys = ('keyboard', 'screen reader', 'label', 'contrast', '320', 'time limit',
        'protocol', 'persona', 'plain language', 'unassisted')
src, dst = sys.argv[1], sys.argv[2]
out = [ln.replace('- [x]', '- [ ]') if any(k in ln.lower() for k in keys) else ln
       for ln in open(src, encoding='utf-8')]
open(dst, 'w', encoding='utf-8').writelines(out)
PY
want 0 "a11y + protocol unticked is reported, not gated" "$WORK/judge.md" "$WORK/p2.txt"

# ...and it must actually REPORT them, or "not gated" just means "not read".
reported=$(python3 tools/check_claims.py --body-file "$WORK/judge.md" \
             --changed "$WORK/p2.txt" | grep -c 'unticked')
if [ "$reported" -eq 10 ]; then
  printf '  ok    %-52s %s lines\n' "...and all 10 are surfaced as unticked" "$reported"
else
  printf '  FAIL  %-52s %s lines, wanted 10\n' "...and all 10 are surfaced as unticked" "$reported"
  FAIL=$((FAIL + 1))
fi

printf 'nothing declared here\n' > "$WORK/empty.md"
want 0 "not an attempt: no project, no project folder" "$WORK/empty.md" "$WORK/none.txt"

# ---------------------------------------------------------------------------
# Frozen-spec IDs. A project's spec/acceptance.md mints families the backlog
# does not (M = MVP steps, A = accessibility, S = success criteria, X = out of
# scope, and whatever else a project invents). Citing one in a pull request
# body is normal and must be accepted; an earlier version of the checker knew
# only the backlog and rejected `P2-M3`, a real ID in the frozen spec.
#
# These cases read a REAL acceptance file rather than a fixture, because the
# point is that the checker agrees with what the project builds actually wrote.
# No acceptance file anywhere (a fresh generated repo) means there is nothing
# to prove, and that is announced rather than counted as a pass.
SPEC="$(ls -1 challenges/p[0-9]*-*/spec/acceptance.md 2>/dev/null | head -1)"
if [ -z "${SPEC:-}" ]; then
  echo "  SKIP  no challenges/p*/spec/acceptance.md exists; frozen-spec ID"
  echo "        cases not proven (not a pass -- there was nothing to run)"
else
  PROJ="$(printf '%s' "$SPEC" | sed -E 's|^challenges/p([0-9]+)-.*|P\1|')"
  DIRN="$(printf '%s' "$SPEC" | sed -E 's|^(challenges/[^/]+)/.*|\1|')"
  SPEC_ID="$(grep -ohE "\b${PROJ}-[A-Z]{1,3}[0-9]+\b" "$SPEC" \
             | grep -vE "^${PROJ}-(F|US)[0-9]+$" | head -1)"
  BL_ID="$(python3 -c '
import json,sys
p=sys.argv[1]
d=json.load(open("docs/eri-backlog.json",encoding="utf-8"))
print(next(e["id"] for e in d["entries"] if e["project"]==p))' "$PROJ")"
  printf '%s/web/app.js\n' "$DIRN" > "$WORK/spec-changed.txt"
  sed -e "s/^\*\*Project:\*\* P?\$/**Project:** $PROJ/" \
      -e "s/^\*\*Backlog IDs claimed:\*\* P?-F?, P?-US?\$/**Backlog IDs claimed:** $BL_ID, $SPEC_ID/" \
      -e 's/^- \[ \]/- [x]/' "$TPL" > "$WORK/spec.md"
  want 0 "backlog + frozen-spec mix ($BL_ID, $SPEC_ID)" "$WORK/spec.md" "$WORK/spec-changed.txt"

  sed "s/${SPEC_ID}\$/${PROJ}-ZZ99/" "$WORK/spec.md" > "$WORK/specbad.md"
  want 1 "an ID in neither the backlog nor the spec"  "$WORK/specbad.md" "$WORK/spec-changed.txt"

  # The spec ID must be reported as a CITATION, not folded into the backlog
  # table: "checked against" and "claimed as built" are different claims.
  out="$(python3 tools/check_claims.py --body-file "$WORK/spec.md" \
          --changed "$WORK/spec-changed.txt" 2>&1)"
  if printf '%s\n' "$out" | grep -q 'Frozen-spec IDs cited' \
     && printf '%s\n' "$out" | grep -q "$SPEC"; then
    printf '  ok    %-52s\n' "the spec ID is reported as cited, with its source"
  else
    printf '  FAIL  %-52s\n' "the spec ID is reported as cited, with its source"
    FAIL=$((FAIL + 1))
  fi
fi

echo
if [ "$FAIL" -gt 0 ]; then echo "$FAIL case(s) FAILED"; exit 1; fi
echo "all cases behave as specified"
