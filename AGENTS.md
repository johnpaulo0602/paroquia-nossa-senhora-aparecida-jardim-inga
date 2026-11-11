<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Environments: production and homolog

There are always two live environments. Keep both working; do not remove or merge away `homolog`.

| | Production | Homologation (staging) |
| --- | --- | --- |
| Git branch | `main` | `homolog` |
| Vercel | production deployment | preview deployment of the `homolog` branch |
| Neon branch | `production` (default) | `homolog`, a child of `production` |
| Database host | `ep-blue-firefly-bd4vwk07` | `ep-floral-thunder-bdfbz0ad` |
| Object storage | `br-autumn-math-bdry6p1z` | `br-purple-salad-bdimc380` |

How it fits together:

- The Neon project is `green-waterfall-56335696`. `homolog` is a Neon **branch** of the same database, not a second project. It shares the role password and storage credentials with `production`; only the hostnames differ. `neon.ts` exempts it from the 7-day expiry applied to other new branches.
- Vercel has one set of environment variables, the production ones. `src/lib/deploy-env.ts` swaps the hostnames above when `VERCEL_GIT_COMMIT_REF` is `homolog`, and throws if the result does not point at the homolog database. If the Neon branch is ever recreated, update the ids at the top of that file and in the table above.
- `scripts/ci.mjs` (the Vercel build command) runs `payload migrate` for production and for `homolog`. Preview deployments of any other branch share the production database, so they build without migrating.

Rules for changes:

- Do schema and CMS work on `homolog` first. Push there, check the preview deployment, then merge `homolog` into `main`. Merging runs the pending migrations against production.
- Never point a migration, seed, test run or `next dev` with schema push at the production database to try something out. Integration and e2e tests create and delete records.
- Check which database the local `.env` targets before running anything that writes: `neon checkout homolog` points it at staging, `neon checkout production` at production. Both commands rewrite `DATABASE_URL` and the `AWS_*` variables.
- Keep `PAYLOAD_DB_PUSH=false` when `.env` targets either Neon branch and change the schema through migrations (`npm run payload -- migrate:create <name>`, then `migrate`). Schema push leaves a `dev` row in `payload_migrations` that makes the next deploy hang on an interactive prompt.
- `migrate:create` asks interactive "create or rename?" questions when tables or enums are both added and removed; it needs a terminal.
