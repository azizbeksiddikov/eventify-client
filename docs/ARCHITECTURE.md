# Architecture

## Overview

```
Browser
  │
  ▼
reverse proxy ──► eventify-next  (Next.js standalone, container :3000)
  │                              │
  │                              │ runs in the browser:
  │                              │   GraphQL  ──► NEXT_PUBLIC_API_GRAPHQL_URL  (/graphql)
  │                              │   uploads  ──► NEXT_APP_API_URL + /upload/image(s)
  ▼                              ▼
eventify-backend api (NestJS) ─► MongoDB
```

The client talks to the API directly from the browser. Next.js serves pages and static files, plus one route of its own: `GET /api/health`.

Everything under `src/app` is a client-rendered tree: `layout.tsx` is a server component, but providers and almost all pages are `"use client"`. There is no server-side data fetching, no middleware, and no Next.js route guard.

## Folders

| Path                             | Content                                                                                                                                                              |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/app/`                       | App Router pages, root layout, providers, global CSS                                                                                                                 |
| `apollo/`                        | GraphQL documents (`user/`, `admin/` x `query.ts`, `mutation.ts`) and `store.ts` (reactive vars)                                                                     |
| `libs/components/`               | feature components: `admin`, `common`, `events`, `group`, `homepage`, `layout`, `organizer`, `profile`; `ui/` holds shadcn primitives                                |
| `libs/types/`                    | TypeScript shapes per backend entity (`event.ts`, `event.input.ts`, `event.update.ts`, ...)                                                                          |
| `libs/enums/`                    | enums mirroring the backend (member, event, group, ticket, notification...) and UI `Message` strings                                                                 |
| `libs/auth/`                     | login, signup, logout, token storage, JWT decoding                                                                                                                   |
| `libs/i18n/`                     | runtime translation loader and `useI18n`                                                                                                                             |
| `libs/hooks/`                    | `useDebouncedText`, `useInlineValidation`                                                                                                                            |
| `libs/*.ts`                      | `config` (env, sort options), `utils` (formatting, like/follow/join helpers), `upload`, `eventDates`, `errorMessages`, `alert` (toasts), `logger`, `motion`, `fonts` |
| `public/locales/<lng>/<ns>.json` | translations                                                                                                                                                         |
| `tests/`                         | node test runner tests                                                                                                                                               |
| `scripts/check-graphql-ops.js`   | contract check against the backend schema                                                                                                                            |

Import alias: `@/` points to the repo root (`@/libs/...`, `@/apollo/...`).

## Routes

| Route                                   | Purpose                                                                                                     |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| `/`                                     | home: search, upcoming events, categories, calendar, top organizers, popular groups                         |
| `/events`, `/events/[id]`               | list with filters, event detail with tickets and comments                                                   |
| `/events/create`, `/events/update/[id]` | create or edit an event (one-off or recurring)                                                              |
| `/groups`, `/groups/[id]`               | list, group detail with members and moderators                                                              |
| `/groups/create`, `/groups/update/[id]` | create or edit a group                                                                                      |
| `/organizers`, `/organizers/[id]`       | organizer list and profile                                                                                  |
| `/profile`                              | own profile: tickets, groups, followers, followings, settings. Anonymous visitors are sent to `/auth/login` |
| `/auth/login`, `/auth/signup`           | sign in or create an account (USER or ORGANIZER)                                                            |
| `/admin`                                | admin panel: users, events, groups, currencies. Shown only to `ADMIN` accounts                              |
| `/help`                                 | FAQ                                                                                                         |
| `/api/health`                           | health check used by the Docker healthcheck                                                                 |

List pages keep filters, sort and page number in the URL query string (`useSearchParams` + `router.push`), so links are shareable and back/forward works.

## Data flow

**Apollo Client** is created in `src/app/providers.tsx` with `InMemoryCache` and a link chain, in this order:

1. `errorLink`: logs GraphQL and network errors. On `UNAUTHENTICATED`, "Unauthorized", "Invalid token", "Token expired", or HTTP 401/403 it shows a toast and calls `logOut()`. Other network errors show a generic toast.
2. `authLink`: adds `Authorization: Bearer <token>` when a token exists; public queries go out without it.
3. `HttpLink` to `NEXT_PUBLIC_API_GRAPHQL_URL`.

GraphQL documents live in `apollo/` (about 62: user queries 24, user mutations 24, admin queries 4, admin mutations 10). Components call them with Apollo hooks. Run `npm run check:graphql -- <url>` after any backend schema change; it fails on any operation the API no longer has.

**Types and enums** in `libs/types` and `libs/enums` are hand-written copies of the backend DTOs and enums. When the backend changes a field or enum value, update them here too.

**Images** are uploaded with `fetch` (not GraphQL) to `NEXT_APP_API_URL/upload/image` or `/upload/images` with the Bearer token (`libs/upload.ts`). Before upload, images are cropped (`ImageCropper`) and compressed (`browser-image-compression`). Images are rendered with `next/image`; allowed remote hosts are listed in `next.config.ts` (`images.remotePatterns`), including the Meetup, Luma and Eventbrite hosts used by crawled events. Add a host there before using a new image source.

## Auth

- Login and signup (`libs/auth`) use a separate, small Apollo client, then store the JWT in `localStorage` under `accessToken`.
- The token payload carries the member profile. `updateUserInfo` decodes it with `jwt-decode` into the reactive var `userVar` (`apollo/store.ts`), which components read as the current user (`useReactiveVar`).
- On every page load `Header` restores the session: `getValidJwtToken()` reads the token, rejects bad format or an expired `exp`, clears storage if invalid, then calls `updateUserInfo`.
- `logOut()` clears the token and `userVar` and sends the browser to `/auth/login`.
- Roles are `USER`, `ORGANIZER`, `ADMIN` (`MemberType`). Hiding admin or organizer UI is a convenience only. The backend enforces permissions with its own guards, so never rely on client checks for security.
- The profile fields in `userVar` come from the token, so treat them as a snapshot taken at login. The backend is the source of truth for points and roles (see backend `docs/CURRENCY.md`).

## Errors and messages

- Errors are identified by **code**, never by their English text. The backend sends a code with every error (`extensions.code`, for example `EVENT_FULL`, plus optional `params`); the same code is the key of the sentence in `public/locales/<lng>/errors.json`. `friendlyErrorMessage` in `libs/errorMessages.ts` looks the code up and shows the sentence in the visitor's language. A code with no text, or an error without a code, shows `UNKNOWN_ERROR`; no English text from the backend ever reaches the screen.
- Errors created in the client use `new AppError("NOT_AUTHENTICATED")` (same codes, same file). `toAppError` keeps the API code when an error is passed on, as the login request does. `libs/upload.ts` does the same for the REST upload route.
- Only failures that have no code at all (the browser's "Failed to fetch") are matched by text, in `RULES`. Covered by `tests/errorMessages.test.ts`.
- Toasts come from `libs/alert.ts` (`smallSuccess`, `smallError`, `smallInfo`) over `sonner`.
- Log through `libs/logger`, not `console`.

## Dates, money, points

- `libs/eventDates.ts` formats event time ranges (single day, multi-day, all-day, point in time) in the visitor's locale and browser timezone. Dates are always shown in the visitor's own timezone. Covered by `tests/eventDates.test.ts`.
- Money is points. `formatPoints`, `formatPrice`, `formatCurrency` and `formatPointsWithCurrency` live in `libs/utils.ts`; `CurrencyConverter` shows a price in a currency chosen by the visitor. Free events have no currency; paid events must have one (rules in backend `docs/CURRENCY.md`).

## UI

- Tailwind CSS 4 with design tokens in `src/app/globals.css`; `cn()` in `libs/utils.ts` merges class names.
- shadcn/ui primitives in `libs/components/ui` (configured by `components.json`) over Radix. Compose features from these and the shared components in `libs/components/common`.
- Dark mode via `next-themes` (`src/app/theme-provider.tsx`, `ModeToggle`).
- Fonts: the root layout loads six Google fonts; `FontProvider` and `libs/fonts.ts` choose classes by language (Cyrillic, Korean, Latin).
- Motion respects the reduced-motion setting (`libs/motion.ts`).
- The look and behaviour rules, with a checklist for every UI change, are in [DESIGN-RULES.md](DESIGN-RULES.md).

## Build

`next.config.ts`: `output: "standalone"`, `reactCompiler: true`, `reactStrictMode: true`, image optimisation off in development. The two environment variables are passed through `env` so they are baked into the browser bundle at build time (see [KEYS.md](KEYS.md)).
