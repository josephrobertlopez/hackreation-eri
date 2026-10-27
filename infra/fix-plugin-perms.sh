#!/bin/sh
# Make every team's shared WordPress-plugins volume writable by BOTH the people
# and the processes that need it, and fail loudly if that cannot be achieved.
#
# Copied verbatim into infra/out/ by generate.py and run once per
# `docker compose up` by the fix-plugin-perms service, which depends on every
# wp-team<N>. See the long comment above that service in infra/generate.py for
# why this exists: one volume, two images, two UIDs, and wordpress always acts
# last, leaving www-data:www-data 755 -- at which point a team can edit the
# seeded plugins but cannot create one.
#
# GID 33 is www-data in both Debian-based images. The workspace image puts
# coder in that group, so group-write is what lets a team author a plugin while
# apache can still serve and update it. 2775 keeps the setgid bit so anything
# either side creates stays in the shared group.
set -u

TRIES=45     # x2s = 90s, comfortably past wordpress's own startup chown
SLEEP=2
GID=33
MODE=2775

# Bounded loop, never `while true` (see hook-authoring 15.2). Re-asserts every
# round rather than once, because the point is to be the LAST writer, and
# wordpress's entrypoint timing is not something this script can observe.
i=0
while [ "$i" -lt "$TRIES" ]; do
  for d in /plugins/*; do
    [ -d "$d" ] || continue
    chgrp "$GID" "$d" 2>/dev/null || true
    chmod "$MODE" "$d" 2>/dev/null || true
  done
  i=$((i + 1))
  sleep "$SLEEP"
done

# The falsifier. Exit 0 only if every volume really ended up group-writable;
# a bare "the chmod command ran" would pass while the thing it guards is broken.
bad=0
for d in /plugins/*; do
  [ -d "$d" ] || continue
  perms=$(stat -c '%a' "$d" 2>/dev/null || echo "?")
  owner=$(stat -c '%U:%G' "$d" 2>/dev/null || echo "?")
  # The group bits must include write. `stat -c %a` prints 755 or 2775, so the
  # group digit is always the second from the right.
  gdigit=$(printf '%s' "$perms" | sed 's/.*\(.\)\(.\)$/\1/')
  case "$gdigit" in
    2|3|6|7) echo "ok   $d  $owner $perms" ;;
    *)       echo "FAIL $d  $owner $perms  (group cannot write)" >&2; bad=1 ;;
  esac
done

if [ "$bad" -ne 0 ]; then
  echo "" >&2
  echo "At least one team's wp-plugins volume is not group-writable." >&2
  echo "That team can edit the seeded ERI plugins but CANNOT create a new" >&2
  echo "plugin in VS Code. Fix for team <N>, from the host:" >&2
  echo "  docker compose exec -u root wp-team<N> \\" >&2
  echo "    chgrp -R 33 /var/www/html/wp-content/plugins" >&2
  echo "  docker compose exec -u root wp-team<N> \\" >&2
  echo "    chmod 2775 /var/www/html/wp-content/plugins" >&2
  echo "Do NOT run 'docker compose down -v' -- that wipes ALL teams." >&2
  exit 1
fi

echo "All team plugin volumes are group-writable (gid $GID, mode $MODE)."
