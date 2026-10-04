# SysselCraft image batch pipeline

This pipeline prepares deterministic image-generation task batches. It does not generate images by itself.

## Hard identity rule

Recurring character identity may only come from PNG character sheets under:

`public/assets/village/character-sheets/`

Runtime sprites, story images, environment images and WebP turnaround assets are never valid character identity references.

The canonical registry is:

`image-pipeline/character-registry.json`

If a registered character sheet is missing, outside the canonical directory or not a PNG, the builder fails closed.

## Batch workflow

1. Create a JSON batch manifest with `batchId`, optional `anchors`, and `scenes`.
2. Each scene declares its `characters` by registry id.
3. The builder injects exactly one canonical character sheet per declared recurring character.
4. Optional environment references remain separate from character identity references.
5. If unapproved anchors exist, only anchor tasks are emitted.
6. After an anchor is approved, set its `status` to `approved` and add its `outputRef` in the approval log.
7. Rerun. Scene tasks are then emitted in chunks of five by default.

## Example manifest

```json
{
  "batchId": "act3-example",
  "batchSize": 5,
  "aspectRatio": "landscape",
  "anchors": [
    {
      "id": "ANCHOR-NOVA-ALVE",
      "characters": ["nova", "alve"],
      "prompt": "Create a continuity anchor for Nova and Alve."
    }
  ],
  "scenes": [
    {
      "id": "ACT3-001",
      "characters": ["nova", "alve", "puppy"],
      "useAnchors": ["ANCHOR-NOVA-ALVE"],
      "environmentRefs": ["path/to/approved/environment-reference.png"],
      "prompt": "Describe only the authored action and composition for this scene.",
      "rules": ["Scene-specific positive rule."],
      "mustNot": ["Scene-specific forbidden element."],
      "qaChecks": ["Scene-specific QA check."]
    }
  ]
}
```

The example names above are structural only. They do not define Act 3 story canon.

## Build

```bash
node scripts/build-image-batch.mjs --batch=path/to/batch.json
```

Optional:

```bash
node scripts/build-image-batch.mjs \
  --batch=path/to/batch.json \
  --batch-size=5 \
  --out=image-pipeline/out/my-batch \
  --approvals=image-pipeline/approvals/my-batch.json
```

## Output

Before anchors are approved:

`anchors-01.json`, `status.json`, and the approval log.

After anchors are approved:

`scenes-01.json`, `scenes-02.json`, etc., with at most five image tasks in each file.

Every generated task keeps these reference classes separate:

- `characterSheetPaths`
- `environmentReferencePaths`
- `anchorReferencePaths`
- combined `referenceImagePaths`

This separation is deliberate. Character sheets are always the sole identity authority.

## Test

```bash
node scripts/test-image-batch-builder.mjs
```
