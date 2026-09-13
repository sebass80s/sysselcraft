# CI policy

Sysselcraft is a public GitHub repository. Normal GitHub-hosted Actions on standard runners may be used autonomously for lint, build and test verification.

The scarce deployment resource is Vercel, not ordinary GitHub Actions CI. Avoid explicitly billed larger runners, paid third-party CI or other chargeable compute without user approval.

The canonical local/CI verification command is `npm run verify`, which runs lint followed by a production build.

The CI workflow supports manual `workflow_dispatch` runs in addition to `main` pushes and pull requests. This lets a prepared remote branch be verified with GitHub Actions without requiring a new code push solely to trigger CI. Because Vercel watches pushed branches, batch branch updates deliberately and prefer manual CI against the already-pushed batch when possible.

Use `[skip ci]` only when intentionally skipping validation for a technical reason, not to conserve public-repository Actions minutes.
