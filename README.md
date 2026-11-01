# Eventify Client

Next.js website for [Eventify](https://eventify.azbek.me): discover events, join groups, buy tickets with points, follow organizers. Four languages (en, ko, ru, uz), light and dark mode, phone first.

It is a thin client. All data comes from the GraphQL API in the companion repo `eventify-backend`; there is no database and no server-side data layer here.

## Quick start

Needs Node 24 and a running backend (or a reachable Eventify API).

```bash
npm install
cp .env.example .env.development   # set the two API URLs, see docs/KEYS.md
npm run dev          # http://localhost:4200
npm test
```

## Scripts

| Command                           | What it does                                                                        |
| --------------------------------- | ----------------------------------------------------------------------------------- |
| `npm run dev`                     | dev server with hot reload                                                          |
| `npm run build`                   | production build (`output: standalone`)                                             |
| `npm start`                       | run the production build                                                            |
| `npm run lint`                    | ESLint                                                                              |
| `npm test`                        | node test runner over `tests/*.test.ts`                                             |
| `npm run check:graphql -- <url>`  | validate every query/mutation in `apollo/` against a running API schema             |
| `npm run check:i18n`              | check that en, ko, ru and uz have the same translation keys                         |
| `npm run format:files -- <files>` | organize imports and run Prettier on the given files (what the editor does on save) |

## Stack

Next.js 16 (App Router, React Compiler), React 19, TypeScript, Apollo Client 4, Tailwind CSS 4, shadcn/ui on Radix, i18next, next-themes, sonner toasts.

## Docs

| File                                         | Content                                   |
| -------------------------------------------- | ----------------------------------------- |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | folders, routes, data flow, auth, state   |
| [docs/KEYS.md](docs/KEYS.md)                 | environment variables (names only)        |
| [docs/DEPLOY.md](docs/DEPLOY.md)             | Docker, ports, redeploy                   |
| [docs/I18N.md](docs/I18N.md)                 | languages, translation files, adding text |
| [docs/DESIGN-RULES.md](docs/DESIGN-RULES.md) | look and behaviour rules, checklist       |
| [PROGRESS.md](PROGRESS.md)                   | status and next steps                     |
| [AGENTS.md](AGENTS.md)                       | rules for AI agents working here          |

Companion repo: `eventify-backend` (NestJS + GraphQL + MongoDB).

## License

MIT
