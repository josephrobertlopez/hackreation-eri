# Local Mattermost (client + coach + AI helper demo)

Synthetic data only. Not hardened: LAN only, never a public port.

    cp .env.example .env        # set MM_DB_PASSWORD and MM_SITEURL=http://<LAN-IP>:8065
    docker compose up -d        # ready in about 30 s: curl localhost:8065/api/v4/system/ping

Seed the demo (users share one demo password, put it in .env as DEMO_PASSWORD):

    M="docker compose exec -T mattermost mmctl --local"
    $M user create --email admin@example.test --username eri-admin --password "$DEMO_PASSWORD" --system-admin
    $M user create --email client@example.test --username sam-client --password "$DEMO_PASSWORD"
    $M user create --email coach@example.test --username coach-jordan --password "$DEMO_PASSWORD"
    $M team create --name eri-demo --display-name "ERI Job Coach Demo"
    $M team users add eri-demo eri-admin sam-client coach-jordan
    $M channel create --team eri-demo --name sam-help --display-name "Sam: Stock the Shelves help" --private
    $M channel users add eri-demo:sam-help eri-admin sam-client coach-jordan

Reset everything: `docker compose down -v`.

Needs Docker with about 2 GB free RAM. The image bundles the Agents (AI) plugin.

## AI helper (Agents plugin, already bundled)
The API key is never committed. Enter it in System Console > Plugins > Agents:
1. Add an Anthropic service with your key and a model (`claude-haiku-4-5-20251001` works).
2. Add a bot: name `ally`, display name "Ally (AI helper)", that service, tools off,
   and paste `helper-prompt.md` into the custom instructions.
3. `$M team users add eri-demo ally` and `$M channel users add eri-demo:sam-help ally`.
4. In the channel, start each message with `@ally`.

If the page only updates after a refresh, the browser's address is missing from
`MM_ALLOWED_ORIGINS` in `.env`. Restart with `docker compose up -d`.
