# Visual fallback

The clean-slate storybook rebuild started from branch state:

`a477e0adf22c30eb1830edbf27afe60372d90a24`

That commit is the **pre-clean-slate visual fallback**. It intentionally preserves the previous mixed/pixel-heavy village presentation in Git history while the active branch moves to the illustrated storybook direction.

## Rule

Do not use the fallback as visual reference for new work. The canonical target is `docs/ART_DIRECTION.md` and the approved illustrated concept-art family.

The fallback exists only for recovery if a gameplay interaction, collision assumption, placement, or asset relationship is accidentally lost during the visual rebuild.

## Restore one file for investigation

```bash
git show a477e0adf22c30eb1830edbf27afe60372d90a24:path/to/file > /tmp/old-file
```

## Compare an active file against the fallback

```bash
git diff a477e0adf22c30eb1830edbf27afe60372d90a24 -- path/to/file
```

## Never wholesale-revert the branch for visual recovery

Recover only the specific functional detail needed. Pixel-era presentation, renderer flags, monospace world UI, crisp rendering, and retro marker styling are retired and must not be reintroduced.
