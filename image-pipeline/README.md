# SysselCraft image batch pipeline

> **Act 3 production authority:** the renderer-independent continuity pipeline in this directory plus `docs/ACT3_ART_PIPELINE.md`.
>
> Character identity, beat content, continuity anchors and approval history belong to the pipeline, not to any renderer. ChatGPT is the preferred interactive renderer. Runway and the local OpenAI API generator are optional rendering adapters/fallbacks. Switching renderer must never change the canonical identity inputs or continuity lineage.

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

## Generate the batch automatically

The generator reads the built batch JSON, opens every referenced character sheet/environment/anchor from the local checkout, sends one image request per task, and writes one separate PNG per scene.

First build the batch:

```bash
npm run image:batch:build -- --batch=path/to/batch.json
```

Then generate a built chunk:

```bash
export OPENAI_API_KEY="..."
npm run image:batch:generate -- --input=image-pipeline/out/<batch-id>/scenes-01.json
```

Useful safe preflight:

```bash
npm run image:batch:generate -- --input=image-pipeline/out/<batch-id>/scenes-01.json --dry-run
```

Defaults:

- model: `gpt-image-2.5-sunburst`
- size: `1536x1024`
- quality: `high`
- output: separate PNG files plus `generation-results.json`
- generation is sequential so a five-image chunk produces five independent API requests and five image files

Override with `--model=`, `--size=`, `--quality=`, or environment variables `SYC_IMAGE_MODEL`, `SYC_IMAGE_SIZE`, and `SYC_IMAGE_QUALITY`.

The OpenAI image edit endpoint accepts multiple source images per request, so each task can carry its own canonical character sheets, environment references and approved anchors. The generator refuses non-canonical character identity paths before making any API request.

## Continuity PoC — 2026-10-08

The first scalable continuity proof is implemented.

Commands:

```bash
npm run art:job -- --manifest=image-pipeline/batches/poc-continuity-chain-01.json --beat=POC-A3-001
npm run art:approve -- --manifest=image-pipeline/batches/poc-continuity-chain-01.json --beat=POC-A3-001 --output=<approved-image.png>
npm run test:art-continuity-poc
```

The job resolver automatically combines:
- canonical character sheets from the registry;
- structured beat content;
- environment references;
- the latest approved continuity anchors in the same sequence;
- global and beat-specific hard rules;
- QA checks and output contract.

The approval command only promotes an image into the continuity chain when identity and continuity are explicitly accepted.

The automated PoC proves:
1. beat 1 resolves two canonical refs and zero anchors;
2. after beat 1 is approved, beat 2 automatically resolves beat 1 as an anchor;
3. after beat 2 is approved, beat 3 automatically resolves the two latest approved anchors;
4. if an approved anchor disappears from durable storage, generation fails closed.

This means future beats do not need manually copied reference lists or anchor ids.

### Remaining ChatGPT adapter gate

The continuity engine is renderer-independent and green. The remaining one-time-upload requirement for ChatGPT is a transport problem: canonical PNGs must also live on a persistent ChatGPT-accessible file surface so a later conversation can re-inject them as actual image inputs without asking the user to upload them again.

Do not confuse this transport gate with continuity-engine correctness.

