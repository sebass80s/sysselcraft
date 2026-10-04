# Act 3 Art Pipeline

Status: **Parked design decision for Act 3 preparation**

This document captures the agreed direction for producing Act 3 story images more efficiently than Act 2.

## Problem observed in Act 2

The main production bottleneck was not writing prompts, but the serial image-generation workflow:

1. write one prompt,
2. wait for one image,
3. save/store the image,
4. write the next prompt,
5. repeat.

Because image generation sat on the critical path, runtime and story implementation repeatedly stalled while individual images were being produced, reviewed and corrected.

## Agreed Act 3 direction

Act 3 art production should run as a **parallel production line**, separate from the main runtime/story implementation thread.

The main SysselCraft thread owns:

- story and beat design,
- runtime implementation,
- canonical art rules,
- image manifest,
- reference selection,
- prompt preparation,
- final visual acceptance.

A separate art agent / image-generation workflow should own:

- reading the prepared beat list,
- using the canonical reference material,
- generating each requested story image,
- keeping outputs tied to stable image IDs / filenames,
- progressing autonomously through the queue as far as the tooling allows.

The art agent should **not redesign the story**. It should execute the authored image manifest.

## Preferred production model

Prepare a machine-readable or highly structured Act 3 manifest before full image production starts.

Conceptual example:

```text
beat-001
  output: act3-opening-001.png
  prompt: ...
  references:
    - child
    - alve
    - environment

beat-002
  output: act3-opening-002.png
  prompt: ...
  references:
    - child
    - alve
    - puppy
```

Each beat should define at minimum:

- stable beat / image ID,
- target filename,
- authored scene description,
- characters present,
- canonical references to use,
- camera / POV requirements,
- continuity constraints,
- forbidden elements,
- acceptance criteria.

## Canonical art constraints to carry forward

The Act 3 manifest should explicitly encode lessons learned from Act 2, including:

- the child's face must not be visible when the scene uses the established child POV,
- character faces, clothing and proportions must remain consistent,
- environmental continuity must be preserved,
- unwanted civilization / background elements must not appear,
- the puppy should only appear when authored,
- image direction and object orientation must match the beat,
- outputs must map cleanly to stable runtime filenames.

## Tooling direction

Two promising routes were identified for later evaluation:

### Runway

Runway appears particularly suitable for the desired autonomous workflow because it supports:

- image generation from text and references,
- reusable workflows,
- API-driven generation,
- saved workflow execution,
- multi-step creative pipelines.

The intended use is not to request many variants of one prompt, but to process **one distinct prompt per beat** from an Act 3 manifest.

### OpenArt

OpenArt is also available as a ChatGPT integration and supports image generation with reference images and multiple current image models.

It may be useful for experimentation or direct ChatGPT-driven production, but the preferred direction for a fully queued manifest-driven pipeline is currently Runway/workflow/API unless testing shows otherwise.

## Planned proof of concept

Before committing Act 3 production to this pipeline, run a small proof of concept using approximately **three existing Act 2 scenes**.

The PoC should test whether the chosen art workflow can:

1. load the same canonical reference material,
2. process several distinct beats without manual prompting between each image,
3. preserve character and environment continuity,
4. keep each result associated with its requested beat / filename,
5. produce quality close enough to the accepted Act 2 visual standard.

If the PoC succeeds, build the full Act 3 art manifest and run art production in parallel with runtime implementation.

## Important boundary

This is an **Act 3 preparation decision only**.

Do not start Act 3 feature implementation or art-pipeline integration as part of Runtime 1.0 cleanup unless explicitly requested. When Act 3 planning resumes, this document is the starting point for the art-production discussion.
