# Live Russia Assistant Hub

Native Android-ready assistant workspace for Live Russia with persistent account IDs, searchable commands and prices, Premium access, and admin account controls.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/live-russia-mobile/` — Expo mobile app and Android preview
- `artifacts/api-server/src/routes/live-russia.ts` — knowledge base, accounts, dashboard, and admin API
- `lib/api-spec/openapi.yaml` — API contract source of truth
- `lib/db/src/schema/live-russia.ts` — PostgreSQL schema for knowledge items and assistant accounts
- `artifacts/live-russia-hub/` — companion web panel scaffold

## Architecture decisions

- The mobile app stores only the current account number locally; account data remains server-backed.
- Knowledge search is server-backed and Premium entries are filtered in the mobile client for a fast response.
- The initial database seed includes one admin account and a small set of realistic Live Russia knowledge entries.
- The Expo preview is the Android handoff surface; this workspace does not contain an Android SDK/Gradle toolchain for producing a binary APK.

## Product

Assistants register on first launch and keep a static account number on the device. They can search commands, prices, and procedures, edit their profile, and see Premium-only entries when enabled. Admins can review accounts and toggle Premium access from the mobile control room.

## User preferences

- The requested distribution format is Android APK; keep the native Expo app as the primary product surface.

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`.
- Expo Metro can show a non-fatal React Native DevTools `libglib-2.0.so.0` warning while the QR preview still works.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
