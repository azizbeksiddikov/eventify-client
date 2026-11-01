# Progress: eventify-client

Last updated: 2026-11-01

## Status

Live at https://eventify.azbek.me, running from `master`.

## Done

- Ports unified: prod 4000, dev 4100, local 4200; container port equals host port, set by `PORT` in the compose files. Local API is expected at 4201.
- Events, groups, organizers, profiles, tickets, comments, likes and follows, notifications, admin panel (users, events, groups, currencies).
- Four languages (en, ko, ru, uz), light and dark mode.
- Currency-aware pricing: optional currency, auto-set currency on create, points formatting, clear errors for insufficient points.
- Friendly, translated error messages (`libs/errorMessages.ts`) and event date formatting (`libs/eventDates.ts`), both with tests.
- Responsive pass: pagination overflow, tap targets, hero text, event images.
- Env files reduced to two Next.js names: `.env.development` (npm and Docker dev) and `.env.production` (prod host).
- `check:graphql` script to catch client/backend schema drift.
- Docs restructured: short README, AGENTS.md, `docs/` set.
- Full four-language pass: missing keys added, admin currency panel, toasts and accessibility labels translated, and errors are now translated by code (the backend sends `extensions.code`) instead of by matching English text; an unknown error shows a translated generic line. `npm run check:i18n` keeps the languages in sync.

## Known gaps

From `docs/DESIGN-RULES.md`: spacing scale not audited everywhere, more font weights and sizes than the target, six webfonts loaded, blank page until translations load, no offline banner, long event titles take 3 lines on 360 px.

Found while documenting:

- `Providers` creates a new `ApolloClient` inside the component body; moving it to module level or `useMemo` would keep the cache across re-renders.
- The JWT is in `localStorage` (readable by any script on the page). Fine for now; an httpOnly cookie would need backend changes.
- The admin member list shows raw `memberStatus` and `memberType` values (for example `ACTIVE`) in its badges.
- Deploy order: the backend change is backward compatible (the English text is unchanged and a code is added), so deploy the backend first, then the client. A new client with an old backend shows the generic error line for backend errors.
- Only two test files (`eventDates`, `errorMessages`); no component or end-to-end tests.
- `check:graphql` is not in CI (it needs a dev backend URL); run it by hand aftbackend changes.
- `next.config.ts` still allows a raw-IP image host; remove it if it is no longer used.

## Open decisions

- Whether to move the session token out of `localStorage`.
