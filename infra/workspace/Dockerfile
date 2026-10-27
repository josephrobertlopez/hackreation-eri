# Team workspace: VS Code in the browser (code-server) + PHP 8 + Node 22 + the monorepo.
# Pinned. `latest` would silently change the base image between the dry run and the
# event, and a code-server that boots differently on the morning of bricks all six
# workspaces at once with no time to debug. 4.143.1 is the exact image this stack was
# verified against: on 2026-10-26 `latest` and `4.143.1` were the same manifest,
# sha256:377b66bec5645510ed52549bb00e648c273edc604d230a3f90fd2b2433afcb97.
# To bump: pick a tag from https://hub.docker.com/r/codercom/code-server/tags, then
# re-run the T-2 dry run before trusting it.
ARG CODE_SERVER_VERSION=4.143.1
FROM codercom/code-server:${CODE_SERVER_VERSION}

USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
      php-cli php-mysql php-sqlite3 php-curl php-mbstring php-xml \
      python3 python3-pip git curl ca-certificates unzip \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# Create the wp-plugins mountpoint IN THE IMAGE, writable by BOTH identities
# that share the team<N>_plugins volume.
#
# docker-compose mounts that volume here AND at wp-team<N>'s
# /var/www/html/wp-content/plugins. Docker only copies content and ownership
# from the image when the mountpoint already exists in it; otherwise it creates
# the volume empty and root-owned. This path did not exist (start.sh mkdir'd it
# at runtime, which is too late), so every workspace came up with a root-owned
# /home/coder/wp-plugins, start.sh's first cp failed with EACCES, set -e killed
# it, and the container restarted forever. Measured 2026-10-26 in the first
# end-to-end dry run: both team containers in "Restarting (1)", volume showing
# "drwxr-xr-x 1 0 0".
#
# The mkdir alone was NOT enough, and the second dry run the same day proved it.
# One volume, two images, two different UIDs: coder (1000) here, www-data (33)
# in wordpress:php8.3-apache. First mount wins the ownership, and wordpress's
# entrypoint then runs `chown -R www-data:www-data` over wp-content AFTER this
# container has already passed start.sh's writability check. Measured
# consequences of a GREEN `docker compose up -d --build`:
#   - coder could edit the four seeded plugins, but `touch` and `mkdir` in
#     ~/wp-plugins both returned EACCES -- so a team could not create a plugin
#     at all, which is the one thing infra/README.md promises that folder does.
#   - any later restart of this container hit start.sh's FATAL and crash-looped
#     (measured restarts=1, exit=1), losing VS Code for that team entirely,
#     while the printed recovery (`down -v`) would wipe every OTHER team's work.
# Fix: one shared group. coder joins www-data (GID 33), the directory is
# group-owned by it at mode 2775 -- setgid so anything either side creates stays
# in the shared group, group-write so both can write. wordpress's `chown -R`
# rewrites the owner but not the mode, and Linux keeps setgid on directories, so
# group-write survives it. start.sh re-asserts this on every boot.
USER root
RUN usermod -aG www-data coder \
    && install -d -o coder -g www-data -m 2775 /home/coder/wp-plugins
USER coder

# The repo is copied in at build time so the day works even if GitHub is slow.
COPY --chown=coder:coder repo /home/coder/hackreation-eri
WORKDIR /home/coder/hackreation-eri
COPY --chown=coder:coder start.sh /usr/local/bin/eri-start.sh
EXPOSE 8080
# Seed ~/wp-plugins with the ERI plugins on first start, then launch code-server.
ENTRYPOINT ["/usr/local/bin/eri-start.sh"]
