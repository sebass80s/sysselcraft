# CI policy

Sysselcraft is a public GitHub repository. Normal GitHub-hosted Actions on standard runners may be used autonomously for lint, build and test verification.

The scarce deployment resource is Vercel, not ordinary GitHub Actions CI. Avoid explicitly billed larger runners, paid third-party CI or other chargeable compute without user approval.

The canonical local/CI verification command is `npm run verify`, which runs the visual asset audit, construction/completion tests, lint and a production build.

Lint runs with `--max-warnings=0`. React hook warnings and similar lint findings are therefore treated as CI failures instead of being allowed to accumulate silently.

The CI workflow supports manual `workflow_dispatch` runs in addition to `main` pushes and pull requests. This lets a prepared remote branch be verified with GitHub Actions without requiring a new code push solely to trigger CI. The checkpoint branch also runs CI on push. Vercel Git deployments are disabled by the checked-in `vercel.json`; do not deploy this native checkpoint to Vercel.

Use `[skip ci]` only when intentionally skipping validation for a technical reason, not to conserve public-repository Actions minutes.


## Current project handover pointer — 2026-10-06

This document remains authoritative for its own domain. Current Runtime Architecture 1.1 execution status and continuation order are tracked in `docs/RUNTIME_1_1_HANDOVER_2026-10-06.md`.

Verified Runtime 1.1 docs baseline before this closeout: `eb7df728adea783c676fe697738be62200430fc9`, GitHub Actions #2252 SUCCESS. Runtime items 1–4 are closed; generic chapter persistence is next. This pointer does not change the domain decisions recorded above.
