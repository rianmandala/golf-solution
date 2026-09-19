# Golf Solution

Frontend monorepo for **Golf Solutions Jakarta** consumer web (landing, pro shop, coaching/fitting booking, account).

## Quick start

```bash
corepack enable
pnpm install
pnpm --filter web dev
```

Open [http://localhost:3000](http://localhost:3000).

MSW mocks are on by default (`apps/web/.env.local` → `NEXT_PUBLIC_API_MOCKING=true`).

## Structure

```
apps/web          Consumer Next.js app
packages/contracts  Zod DTOs
packages/format     Rp / date / phone helpers
packages/tokens     Design tokens (CSS variables)
packages/config     Shared TS config
docs/               FE↔BE alignment notes
.notes/             Private notes (gitignored)
```

## Notes

- FE only — backend is separate. Staff console = future `apps/staff`, not inside `apps/web`.
- Design source (for now): Figma file `mld1wjSHqHJQxrxZoclhBX`.
- Project memory for Cursor: `.cursor/rules/gs-project.mdc`.
