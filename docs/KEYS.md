# Keys and environment variables

Names and meaning only. **Never put real values in this file, the repo, or chat.** Values live in two git-ignored files, using the Next.js names: `.env.development` (`npm run dev` and Docker dev) and `.env.production` (production host).

Derived from source code (`libs/config.ts`, `next.config.ts`, `Dockerfile`), not from env files.

| Variable                      | Required | Meaning                                                                                                              |
| ----------------------------- | -------- | -------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_API_GRAPHQL_URL` | yes      | full URL of the backend GraphQL endpoint (ends in `/graphql`). Used by the Apollo client and the login/signup client |
| `NEXT_APP_API_URL`            | yes      | base URL of the backend for REST calls. Image upload posts to `<value>/upload/image` and `<value>/upload/images`     |
| `NODE_ENV`                    | no       | set by Next.js and the Docker image. `development` turns image optimisation off                                      |
| `NEXT_TELEMETRY_DISABLED`     | no       | `1` turns off Next.js anonymous telemetry (the Docker image already sets it)                                         |

A template with placeholder values is `.env.example`. Copy it and fill in the two URLs.

Both variables are **baked into the browser bundle at build time**, so they are public. They are not secrets; never put a secret in either. The client holds no API keys.

## Changing a value

- `npm run dev`: edit `.env.development`, restart the dev server.
- Docker dev: edit `.env.development`, restart the container.
- Production: the values are passed as build arguments (`docker-compose.prod.yml` reads them from `.env.production` via `--env-file`), so **rebuild the image** after a change: `./deploy_prod.sh`, or `docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build`. Restarting alone does not change what the browser sees.

## Where each lives

| Environment          | File                          | Notes                                                                                |
| -------------------- | ----------------------------- | ------------------------------------------------------------------------------------ |
| Local and Docker dev | `.env.development`            | points at a local or dev backend; used by `npm run dev` and `docker-compose.dev.yml` |
| Production           | `.env.production` on the host | never overwrite it when deploying                                                    |

Do not create `.env.local`: Next.js loads it in every mode and it overrides these two files.

## Rules

- Do not commit env files (`.gitignore` covers `.env*`).
- Do not point a local build at the production API unless you mean to.
- The production API must allow the site origin (CORS); this is set in the backend.
