#!/usr/bin/env bash
set -e
R=/home/coder/hackreation-eri
P=/home/coder/wp-plugins
mkdir -p "$P"
for src in "$R/starters/wordpress-plugin/eri-hello" "$R/starters/eri-job-card" \
           "$R/challenges/02-job-fit-checker/wp-plugin/eri-job-fit" \
           "$R/challenges/03-job-post-checker/wp-plugin/eri-job-post-checker"; do
  n=$(basename "$src"); [ -e "$P/$n" ] || cp -r "$src" "$P/$n"
done
chmod -R a+rX "$P"
# Hand off to the image's normal entrypoint (code-server on 0.0.0.0:8080, auth=password via $PASSWORD)
exec /usr/bin/entrypoint.sh --bind-addr 0.0.0.0:8080 --auth password "$R"
