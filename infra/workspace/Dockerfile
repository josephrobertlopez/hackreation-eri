# Team workspace: VS Code in the browser (code-server) + PHP 8 + Node 22 + the monorepo.
# Pin CODE_SERVER_VERSION to a current tag from https://hub.docker.com/r/codercom/code-server/tags (verify before the event).
ARG CODE_SERVER_VERSION=latest
FROM codercom/code-server:${CODE_SERVER_VERSION}

USER root
RUN apt-get update && apt-get install -y --no-install-recommends \
      php-cli php-mysql php-sqlite3 php-curl php-mbstring php-xml \
      python3 python3-pip git curl ca-certificates unzip \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

USER coder
# The repo is copied in at build time so the day works even if GitHub is slow.
COPY --chown=coder:coder repo /home/coder/hackreation-eri
WORKDIR /home/coder/hackreation-eri
COPY --chown=coder:coder start.sh /usr/local/bin/eri-start.sh
EXPOSE 8080
# Seed ~/wp-plugins with the ERI plugins on first start, then launch code-server.
ENTRYPOINT ["/usr/local/bin/eri-start.sh"]
