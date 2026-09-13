# CI policy

Sysselcraft is a public GitHub repository. Normal GitHub-hosted Actions on standard runners may be used autonomously for lint, build and test verification.

The scarce deployment resource is Vercel, not ordinary GitHub Actions CI. Avoid explicitly billed larger runners, paid third-party CI or other chargeable compute without user approval.

Use `[skip ci]` only when intentionally skipping validation for a technical reason, not to conserve public-repository Actions minutes.
