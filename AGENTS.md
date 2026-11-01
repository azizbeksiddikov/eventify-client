# AGENTS.md: eventify-client

Rules for any AI agent in this repo.

## Hard rules

- **Never read, print, edit or search inside env files** that can hold real values (`.env`, `.env.*` such as `.env.development` or `.env.production`, any depth). **Exception: `.env.example` may be read and edited** (it holds placeholders only, never real secrets). Learn configuration from source code, `.env.example` and `docs/KEYS.md`.
- Never point a local build, test or script at the production API or server without explicit approval. Use a dev backend.
- Develop and test on `develop`; merge to `master` when confirmed. Production runs only `master`.
- Do not commit, push, deploy or send anything unless asked.
- No big rewrites. Extend what exists.

## Stack

Next.js 16 (App Router, React Compiler), React 19, TypeScript, Apollo Client 4, Tailwind CSS 4, shadcn/ui (Radix), i18next, next-themes, sonner. Tabs for indentation, double quotes, print width 120 (Prettier).

## Layout

- `src/app/`: pages, root layout, `providers.tsx` (Apollo, i18n). Almost every page is a client component.
- `apollo/`: GraphQL documents (`user/`, `admin/`) and `store.ts` (`userVar`).
- `libs/components/<feature>/`: feature components; `ui/` is shadcn; `common/` is shared.
- `libs/types`, `libs/enums`: copies of backend DTOs and enums. `libs/auth`, `libs/i18n`, `libs/hooks`, `libs/*.ts`: helpers.
- `public/locales/<lng>/<ns>.json`: translations. `tests/`: node-runner tests.
- Details: `docs/ARCHITECTURE.md`.

## Conventions

- Import with the `@/` alias (repo root).
- Every visible sentence (including toasts, placeholders and `aria-label`) goes through `t("key")` and is added to **all four** languages (`en`, `ko`, `ru`, `uz`). See `docs/I18N.md`.
- New backend field, enum value or operation: update `libs/types`, `libs/enums` and `apollo/` together, then run `npm run check:graphql -- <dev graphql url>`.
- Errors are translated by **code**. A new backend error (a new member in its `Message` enum) needs a key with the same name in `errors.json` for all four languages; verify with `npm run check:i18n -- <path to the backend libs/enums/common.enum.ts>`. Errors made in the client are `new AppError("CODE")`. Show errors with `smallError(friendlyErrorMessage(error))`; never match or show backend English text.
- Use `libs/alert.ts` for toasts and `libs/logger` for logs, not `console`.
- Build UI from `libs/components/ui` and `common`; do not add a second component library.
- UI work follows `docs/DESIGN-RULES.md` (phone first, 44 px tap targets, 16 px inputs, light and dark). Check the checklist at the bottom before finishing.
- Money is points. Format with the helpers in `libs/utils.ts`. Free events have no currency.
- Client-side role checks only hide UI. The backend enforces permissions.
- A new remote image host needs an entry in `next.config.ts` `images.remotePatterns`.
- The two env variables are public and baked in at build time. Never put a secret in them.

## Before finishing

1. Run `npm run format:files -- <changed files>`. It does what the editor does on save: organizes imports (sort, remove unused), then Prettier. Without it the editor rewrites your files the next time the maintainer saves them.
2. `npm run lint`, `npm test`, `npm run check:i18n` and `npm run build` pass.
3. For UI changes: looked at 360 and 1280 px wide, light and dark.
4. Update `PROGRESS.md` (and the relevant doc in `docs/` if behavior changed).
5. Report briefly: what changed, what was verified, what needs the maintainer.

## Docs map

`README.md` (overview) · `docs/ARCHITECTURE.md` · `docs/KEYS.md` · `docs/DEPLOY.md` · `docs/I18N.md` · `docs/DESIGN-RULES.md` · `PROGRESS.md`
