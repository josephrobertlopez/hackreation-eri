#!/usr/bin/env bash
set -e
R=/home/coder/hackreation-eri
P=/home/coder/wp-plugins
mkdir -p "$P"

# 002, not the default 022, and set before code-server is exec'd so that
# everything the editor and its terminals create inherits it. Without this, a
# plugin folder a team makes in ~/wp-plugins comes out 2755: the setgid bit
# puts it in the shared www-data group, but the group has no write bit, so
# apache can read and activate the plugin yet WordPress's own admin UI cannot
# update or delete it. Measured 2026-10-26: team-created dir 2755, and
# `test -w` as www-data failed. At 002 it is 2775 and both sides can manage it.
# Safe here because the whole host is a synthetic-data sandbox that is deleted
# the same night (see infra/README.md "Security").
umask 002

# Re-assert the shared-group contract the Dockerfile sets up, because wp-team<N>
# mounts this same volume and its entrypoint runs `chown -R www-data:www-data`
# over it at some point after we started -- so the state we find here depends on
# a race we do not control. Both are best-effort: on a volume we do not own
# these fail, which is exactly the case the warning below covers.
chgrp www-data "$P" 2>/dev/null || true
chmod 2775 "$P" 2>/dev/null || true

# NEVER exit non-zero from here on account of this directory.
#
# This block used to `exit 1` on an unwritable $P. `restart: unless-stopped`
# turns that into a crash loop, and a crash loop means the team has no VS Code
# at all -- measured 2026-10-26, restarts=1 exit=1, after wordpress chowned the
# shared volume. Losing plugin sync costs a team one of four starters; losing
# the workspace costs them the whole day, and the recovery the old message
# printed (`docker compose down -v`) would have destroyed every other team's
# work too. So: warn loudly, skip the seeding, and still start the editor.
if [ ! -w "$P" ]; then
  echo "WARNING: $P is not writable by $(id -un) (owned by $(stat -c '%U:%G %a' "$P"))." >&2
  echo "  Skipping the ERI plugin seed. VS Code still starts and the repo at" >&2
  echo "  $R is unaffected -- only the shared WordPress plugins folder is" >&2
  echo "  read-only for you. Organizer fix, from the host, for team <N>:" >&2
  echo "    docker compose exec -u root wp-team<N> \\" >&2
  echo "      chown -R www-data:www-data /var/www/html/wp-content/plugins" >&2
  echo "    docker compose exec -u root wp-team<N> \\" >&2
  echo "      chmod 2775 /var/www/html/wp-content/plugins" >&2
  echo "  Do NOT run 'docker compose down -v' -- that wipes ALL teams." >&2
else
  for src in "$R/starters/wordpress-plugin/eri-hello" "$R/starters/eri-job-card" \
             "$R/challenges/02-job-fit-checker/wp-plugin/eri-job-fit" \
             "$R/challenges/03-job-post-checker/wp-plugin/eri-job-post-checker"; do
    n=$(basename "$src"); [ -e "$P/$n" ] || cp -r "$src" "$P/$n"
  done
  # a+rX so apache can read what we just wrote; g+w so apache (same shared
  # group) can also write into the plugin directories it will later chown.
  chmod -R a+rX "$P" 2>/dev/null || true
  chmod -R g+w "$P" 2>/dev/null || true
fi
# Hand off to the image's normal entrypoint (code-server on 0.0.0.0:8080, auth=password via $PASSWORD)
exec /usr/bin/entrypoint.sh --bind-addr 0.0.0.0:8080 --auth password "$R"
