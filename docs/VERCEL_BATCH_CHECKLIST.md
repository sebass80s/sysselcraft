# Vercel batch deployment checklist

Purpose: spend one Vercel deployment on a coherent verification batch rather than many incremental changes.

Vercel deployments are a limited resource in this project. Git commits and ordinary GitHub Actions CI are not the scarce resource.

## Before merging a deployment batch

- Keep the PR as a draft while work is still being packed into it.
- Confirm the branch is based on current `main` and has no unexpected divergence.
- Review the complete `main...branch` diff, not only the latest commit.
- Run `npm run verify` through GitHub Actions on the exact intended head SHA.
- Require lint with zero warnings and a successful production build.
- Confirm no secrets, private family data or service-role credentials are present in the diff.
- Confirm migration/reconciliation code remains read-only unless a separately approved migration phase says otherwise.
- Update the PR body so the deploy represents a named, understandable product/technical batch.

## When the Vercel quota is available

1. Verify quota/deployment availability before merging.
2. Merge the prepared batch once.
3. Let the Git integration create the deployment rather than triggering redundant manual deploys.
4. Record the exact merged commit SHA.
5. Wait for Vercel to report the deployment as READY.
6. Verify that the production alias points at that exact commit before saying the change is live.

## Browser smoke test for the current backend/device batch

Use the deployed exact commit and verify these surfaces once:

- `/` loads the village without a runtime error.
- Backend quest inbox opens and refreshes.
- `/parent` loads and parent auth state resolves correctly.
- Parent quest lists can be refreshed without hook/render loops.
- `/pair` handles both fresh pairing and an already-paired device state correctly.
- `/?debug=reconciliation` stays hidden unless requested and remains read-only.
- Reconciliation diagnostics can refresh and copy a versioned JSON snapshot.

Do not perform destructive migration writes during this smoke test.

## Native follow-up after the browser batch is accepted

The iOS project already exists locally. Do not regenerate it.

Use:

```text
git pull
npm run ios:sync
```

Then in Xcode select the existing App target and the physical iPhone and run it.

The next meaningful native verification is the real two-session/two-device flow followed by before/after reconciliation snapshots.

## Deployment accounting rule

A successful GitHub CI run does not mean the change is live. A successful Vercel build does not prove the production alias is on the intended SHA. Always verify both the deployment status and exact commit before declaring a batch live.
