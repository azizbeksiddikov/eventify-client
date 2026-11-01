# Deploy

The site runs in Docker behind a reverse proxy. Production runs only `master`. The proxy sends `/api/` and `/graphql` to the API and everything else to this container (example config in the backend repo).

## Docker

`Dockerfile` has three stages on Node 24 alpine: `base` (install dependencies with `npm ci`), `builder` (copies sources, runs `npm run build` with the two public variables as build args) and `runner` (copies only the `standalone` output, `.next/static` and `public`; runs as non-root `nextjs` under `dumb-init`; `node server.js` on port 3000).

|                 | Dev compose                | Prod compose                                           |
| --------------- | -------------------------- | ------------------------------------------------------ |
| File            | `docker-compose.dev.yml`   | `docker-compose.prod.yml`                              |
| Container       | `eventify-next`            | `eventify-next-prod`                                   |
| Image target    | `base`, runs `npm run dev` | full build, runs the standalone server                 |
| Env file        | `.env.development`         | `.env.production` (also supplies the build args)       |
| Host port       | 4020                       | 4000 (container 3000)                                  |
| Restart         | unless-stopped             | always                                                 |
| Limits / checks | none                       | 800 MB memory, healthcheck on `/api/health` every 30 s |

Dev mounts `src`, `libs`, `apollo`, `public` and the config files into the container for hot reload; `node_modules` stays in the image. Logs rotate (10 MB files).

Scripts: `deploy_dev.sh`, `deploy_prod.sh` (stop and remove the old container, rebuild, prune dangling images, start, follow logs), `cleanup_docker.sh`.

## Redeploy

1. Merge to `master`.
2. Copy the code to the host, excluding env files, `node_modules`, `.next` and `.git`. Never overwrite the host's env file.
3. On the host run `docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build` (or `./deploy_prod.sh`) and check the logs. `--env-file` is needed because compose reads `.env` by default for the build args.
4. Check that the home page loads, `/api/health` answers, and the browser console shows no failed `/graphql` calls.

## Checks before deploying

```bash
npm run lint
npm test
npm run build
npm run check:graphql -- <dev API graphql url>   # when the backend schema changed
```

Deploy the backend first when a change needs a new API field, then the client.

## Notes

- A change to `NEXT_PUBLIC_API_GRAPHQL_URL` or `NEXT_APP_API_URL` needs a rebuild (see [KEYS.md](KEYS.md)).
- A new image host needs an entry in `next.config.ts` `images.remotePatterns` and a rebuild.
- Translations are plain files in `public/locales`, copied into the image with the rest of `public/`.
- Dev server through a tunnel: `next.config.ts` lists the allowed dev origins (development only).
