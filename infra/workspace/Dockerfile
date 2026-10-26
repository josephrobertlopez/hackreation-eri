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

USER coder
# Create the wp-plugins mountpoint IN THE IMAGE, owned by coder.
#
# docker-compose mounts the shared team<N>_plugins named volume here. Docker
# only copies content and ownership from the image when the mountpoint already
# exists in it; otherwise it creates the volume empty and root-owned. This path
# did not exist (start.sh mkdir'd it at runtime, which is too late), so every
# workspace came up with a root-owned /home/coder/wp-plugins, start.sh's first
# cp failed with EACCES, set -e killed it, and the container restarted forever.
# Measured 2026-10-26 in the first end-to-end dry run: both team containers in
# "Restarting (1)", volume showing "drwxr-xr-x 1 0 0".
RUN mkdir -p /home/coder/wp-plugins

# The repo is copied in at build time so the day works even if GitHub is slow.
COPY --chown=coder:coder repo /home/coder/hackreation-eri
WORKDIR /home/coder/hackreation-eri
COPY --chown=coder:coder start.sh /usr/local/bin/eri-start.sh
EXPOSE 8080
# Seed ~/wp-plugins with the ERI plugins on first start, then launch code-server.
ENTRYPOINT ["/usr/local/bin/eri-start.sh"]
