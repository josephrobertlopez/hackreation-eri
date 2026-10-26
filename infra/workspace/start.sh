#!/usr/bin/env bash
set -e
R=/home/coder/hackreation-eri
P=/home/coder/wp-plugins
mkdir -p "$P"

# Fail with a diagnosis rather than a bare "Permission denied" from cp. If the
# named volume was created before the Dockerfile made this mountpoint, it is
# root-owned and nothing below can work; say so instead of crash-looping
# silently. Recovery is `docker compose down -v` to drop the stale volume.
if [ ! -w "$P" ]; then
  echo "FATAL: $P is not writable by $(id -un) (owned by $(stat -c '%U:%G' "$P"))." >&2
  echo "  The team<N>_plugins volume predates the image that creates this" >&2
  echo "  directory. Run: docker compose down -v && docker compose up -d --build" >&2
  exit 1
fi
for src in "$R/starters/wordpress-plugin/eri-hello" "$R/starters/eri-job-card" \
           "$R/challenges/02-job-fit-checker/wp-plugin/eri-job-fit" \
           "$R/challenges/03-job-post-checker/wp-plugin/eri-job-post-checker"; do
  n=$(basename "$src"); [ -e "$P/$n" ] || cp -r "$src" "$P/$n"
done
chmod -R a+rX "$P"
# Hand off to the image's normal entrypoint (code-server on 0.0.0.0:8080, auth=password via $PASSWORD)
exec /usr/bin/entrypoint.sh --bind-addr 0.0.0.0:8080 --auth password "$R"
