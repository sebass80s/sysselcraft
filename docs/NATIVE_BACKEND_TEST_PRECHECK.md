# Native backend test precheck

Status: **USE BEFORE THE NEXT PHYSICAL iPHONE BACKEND/RECONCILIATION RUN**

The Capacitor app is built from Next's static export (`out/`). `NEXT_PUBLIC_*` values are therefore embedded when `npm run build` runs. A native shell can launch correctly even when the Supabase public config was missing at build time, but `/pair`, `/parent` and the backend quest inbox will then fail when they try to construct the Supabase client.

## Before `npm run ios:sync`

1. Confirm the Mac clone has a local `.env.local` file.
2. It must define these two **public client** values:

   ```text
   NEXT_PUBLIC_SUPABASE_URL=...
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
   ```

3. Never put a Supabase service-role key, database password or another privileged secret in a `NEXT_PUBLIC_*` variable.
4. If the local file is missing, copy `.env.example` to `.env.local` and fill it with the project's current public URL and publishable key from the trusted project configuration.
5. Run the normal native loop only after the public config is present:

   ```text
   git pull
   npm install
   npm run ios:sync
   ```

6. Open the generated project in Xcode and run **App → iPhone → ▶**. Do not run `npx cap add ios` again.

## Fast smoke check on the iPhone

Before spending a fresh pairing code, verify that:

- the village opens normally;
- `/pair` opens without the error `Supabase is not configured`;
- the device can create/read its anonymous child auth session;
- returning from background does not turn the child quest panel into a repeated sync error loop.

Then continue with `docs/DEVICE_RECONCILIATION_TEST_PLAN.md`.

## Why this file exists

Vercel already has its own environment configuration, while a local Capacitor build uses the environment available on the Mac at build time. The two are easy to mentally merge even though they are separate build environments. This precheck keeps a missing local public config from being mistaken for a pairing, RLS or reconciliation bug during physical-device testing.
