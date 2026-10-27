#!/usr/bin/env bash
# Proves the page actually runs in a real browser, with no npm dependency.
#
# `node --test` checks the logic and the markup the builders produce. It cannot
# prove the ES modules load, that the imports resolve over http, or that the
# employer view decodes a share link — all three are browser-only facts. This
# script serves the folder, renders it in headless Chromium, and greps the DOM
# the browser actually built.
#
#   bash test/browser-smoke.sh
#
# Needs: python3, chromium-browser (or set BROWSER=), curl. Skips with exit 0
# and a loud message if the browser is missing, so it never blocks a team that
# does not have one. The server and the throwaway profile are always torn down.
#
# This is NOT an accessibility pass. A dumped DOM says nothing about what a
# screen reader announces; see spec/acceptance.md for the human protocols.

set -euo pipefail
cd "$(dirname "$0")/.."

BROWSER="${BROWSER:-chromium-browser}"
PORT="${PORT:-8129}"

if ! command -v "$BROWSER" >/dev/null 2>&1; then
  echo "SKIP: no browser found ($BROWSER). Set BROWSER=/path/to/chrome to run this."
  exit 0
fi

WORK="$(mktemp -d)"
SERVER_PID=""
cleanup() {
  if [ -n "$SERVER_PID" ]; then
    kill "$SERVER_PID" 2>/dev/null || true
    # Reap it before returning. Without the wait, the script can exit while the
    # socket is still bound, and the next run of this script fails on a port
    # that "is in use" by a process that is already dying.
    wait "$SERVER_PID" 2>/dev/null || true
  fi
  rm -rf "$WORK"
}
trap cleanup EXIT INT TERM

python3 -m http.server "$PORT" --bind 127.0.0.1 >"$WORK/server.log" 2>&1 &
SERVER_PID=$!

ready=0
for _ in $(seq 1 40); do
  if curl -sf "http://127.0.0.1:$PORT/web/index.html" -o /dev/null; then ready=1; break; fi
  sleep 0.25
done
if [ "$ready" -ne 1 ]; then
  echo "FAIL: the test server never came up on port $PORT"
  exit 1
fi

dump() {
  "$BROWSER" --headless --disable-gpu --no-sandbox --no-first-run \
    --user-data-dir="$WORK/profile" --virtual-time-budget=5000 \
    --dump-dom "$1" 2>"$WORK/browser.log"
}

fails=0
expect() { # expect <file> <description> <pattern>
  if grep -qF -- "$3" "$1"; then
    echo "  ok   $2"
  else
    echo "  FAIL $2 (looked for: $3)"
    fails=$((fails + 1))
  fi
}
refute() {
  if grep -qF -- "$3" "$1"; then
    echo "  FAIL $2 (found what should be absent: $3)"
    fails=$((fails + 1))
  else
    echo "  ok   $2"
  fi
}

echo "1. the editor renders from its ES modules"
dump "http://127.0.0.1:$PORT/web/index.html" >"$WORK/editor.html"
expect "$WORK/editor.html" "the skill list rendered"            'value="greet-customers"'
expect "$WORK/editor.html" "the interest chips rendered"         'Plants and gardens'
expect "$WORK/editor.html" "the progress checklist rendered"     'Not yet'
expect "$WORK/editor.html" "the empty-state hint rendered"       'No skills yet'
expect "$WORK/editor.html" "the share checklist rendered"        'name="share-profile"'
refute "$WORK/editor.html" "no module error left the page blank" 'id="chosen-skills"></div>'

echo "2. an employer opens a shared link (all three skills)"
FRAGMENT="$(node test/helpers/make-link.mjs)"
dump "http://127.0.0.1:$PORT/web/index.html#$FRAGMENT" >"$WORK/employer.html"
expect "$WORK/employer.html" "the portfolio decoded from the URL" 'Jamie R.'
expect "$WORK/employer.html" "skill 1 is readable"                'Organize supplies'
expect "$WORK/employer.html" "skill 2 is readable"                'Greet customers'
expect "$WORK/employer.html" "skill 3 is readable"                'Follow a checklist'
expect "$WORK/employer.html" "the sample imagery inlined"         '<svg'
expect "$WORK/employer.html" "the picture says what it shows"     'The picture shows:'
expect "$WORK/employer.html" "the audio has its transcript"       'Transcript: Good morning'
expect "$WORK/employer.html" "it is marked read-only"             'This page is read-only'

echo "3. a link that shares ONE skill carries only that skill"
ONE="$(node test/helpers/make-link.mjs --one)"
dump "http://127.0.0.1:$PORT/web/index.html#$ONE" >"$WORK/one.html"
expect "$WORK/one.html" "the shared skill is there"       'Greet customers'
refute "$WORK/one.html" "the held-back skill is not"      'Organize supplies'
refute "$WORK/one.html" "the held-back skill is not"      'Follow a checklist'

echo
if [ "$fails" -eq 0 ]; then
  echo "browser smoke: all checks passed"
else
  echo "browser smoke: $fails check(s) failed"
  exit 1
fi
