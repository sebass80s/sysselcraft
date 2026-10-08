# Act 3 Art Pipeline

Status: **CONTINUITY POC GREEN / CHATGPT ADAPTER NEXT**
Date: 2026-10-04

This document defines the production method for **all Act 3 art**. It carries forward the proven SysselCraft visual rules from `docs/ART_DIRECTION.md`, but replaces the Act 2 manual reference-upload bottleneck with a connected Runway reference library and a strict no-guess resolver.

Act 2 is complete and is not to be retrofitted to this pipeline. This document exists so Act 3 can start cleanly.

## Ownership

**Vega is the Act 3 art agent.**

Vega owns:
- canonical reference lookup,
- image-generation contracts,
- Runway reference grounding,
- story-moment generation,
- environment/master-scene art production,
- construction/state art production,
- visual continuity checks,
- rejection/regeneration of failed art,
- deterministic finishing where needed,
- stable output naming and handoff to runtime.

Vega does **not** redesign story canon. Story/beat decisions come from the authored Act 3 design/manifest. Vega executes the visual contract.

## Canonical visual authority

Global visual rules live in:
- `docs/ART_DIRECTION.md`

Act-specific image requirements will live in the future Act 3 story/image manifest.

For reusable visual identity, the preferred source is the connected Runway Brand Kit:

- Brand Kit: **Syssel**
- current sections include **Character sheets** and **Environment references**

The library is a resolver, not merely a gallery. If the user writes a canonical name such as `Nova`, Vega must resolve that name to the corresponding canonical image asset and pass the real asset into the generation request.

## 🔒 NO-GUESS GENERATION RULE

**Vega must never generate a SysselCraft production image when doing so would require guessing a canonical identity, environment, building state, prop, orientation, or other locked visual fact.**

If a required source cannot be:
1. identified unambiguously,
2. fetched successfully,
3. and passed into the selected generator as an actual image reference when the contract requires one,

then **do not generate**.

Stop and report exactly what is missing or inaccessible.

A wrong image is not a draft. It is a failed pipeline execution.

## 🔒 Name → asset → generation contract

For every established named character or canonical visual entity:

1. Parse the requested cast/entities from the authored beat or user instruction.
2. Look up each canonical entity in the Runway **Syssel** library.
3. Resolve the correct asset by canonical name/role.
4. Verify that the asset is actually retrievable as a real image URL/reference.
5. Pass those exact references into the generation call.
6. Only then generate the scene.

**Name recognition is not grounding.**

Seeing that `nova.png` exists does not count as using Nova. The actual Nova image must be included as a reference input to the renderer.

Likewise, a prose description such as “brown-haired girl named Nova” must never substitute for the canonical Nova reference when one exists.

## Character grounding policy

For every established character in a generated Act 3 image:
- canonical character sheet/reference is mandatory;
- all requested established characters must be referenced in the same generation where supported;
- identity, face, age read, proportions, hair and stable design traits come from the reference;
- scene prompt controls action, pose, expression, scene-appropriate wardrobe and staging without replacing identity;
- if a model cannot accept the required number or type of references, use another supported production route or stop. Do not silently drop a character reference.

### Barnet
The existing locked child rule remains absolute:
- Barnet's face is never shown in Story Moments/cutscenes;
- preserve canonical cap, backpack, clothing, proportions and rear-view silhouette;
- a generator result that reveals/invents the face is rejected.

## Environment grounding policy

When an Act 3 scene has an accepted environment/master reference:
- fetch and pass the actual environment reference;
- preserve camera language, geography, light direction, landmark placement and scale;
- do not invent civilization, structures, roads, props or background activity not authored by the beat;
- accepted master geometry outranks generator creativity.

For a new Act 3 outdoor area, follow the master-scene method in `ART_DIRECTION.md`:
**visual brief → one master composition → approve/freeze geometry → derive dynamic states/assets → deterministic validation → runtime handoff.**

## Preferred Runway execution path

For Act 3 character/story images, Runway is the preferred production path because Vega can:
- read the **Syssel** Brand Kit,
- retrieve reusable hosted image references,
- send multiple references into image generation,
- run distinct prompts as separate image tasks,
- preserve results as reusable Runway-hosted assets,
- later support queued/workflow production if useful.

Use another renderer only when it can satisfy the same reference-grounding contract. Switching tools never relaxes the no-guess rule.

## Proof-of-concept requirement

Before full Act 3 art production starts, the pipeline must pass a small identity-grounding proof of concept.

The PoC is successful only if:
1. Vega receives a natural-language scene request using canonical names only;
2. Vega resolves those names automatically from **Syssel**;
3. the actual canonical assets are included in the generation request;
4. output characters are recognizably the requested canonical characters;
5. environment/style constraints remain coherent;
6. no user re-upload of already-library-held canonical references is required.

A generation that merely knows an asset exists, but fails to feed it into the renderer, is a **PoC failure**.

## Act 3 manifest contract

Before large-scale story-image production, each IMAGE/MAJOR beat should define:

- stable beat ID;
- stable image ID;
- target runtime filename/path;
- narrative purpose;
- exact moment depicted;
- characters present;
- canonical Runway reference keys required;
- environment/master reference required;
- camera/framing/POV;
- action and expression;
- continuity in/out;
- required props;
- forbidden elements;
- lighting/weather/time;
- orientation/direction constraints;
- acceptance criteria.

Conceptual example:

```text
A3-OPEN-001
  output: act3-opening-001.png
  cast:
    - Barnet -> Syssel/Character sheets/barnet
    - Alve   -> Syssel/Character sheets/alve
  environment:
    - <approved Act 3 master/reference>
  constraints:
    - Barnet rear view only
    - exact travel direction from previous beat
    - no extra buildings/people
  acceptance:
    - both identities grounded from actual refs
    - child face invisible
    - environment continuity preserved
```

## Batch / queue production

Act 3 art should be produced as a queue rather than a one-prompt-at-a-time dependency on the runtime thread.

For each queued item:
1. resolve all references;
2. fail closed if anything is missing;
3. generate one standalone production image;
4. inspect identity, continuity and composition;
5. reject/regenerate internally if the contract fails;
6. bind accepted output to the stable image ID/filename;
7. continue to the next beat.

Do not generate contact sheets or grids as substitutes for final raster assets unless explicitly requested.

## Acceptance gates

Every generated Act 3 image must pass:

1. **Reference gate** — every required canonical entity was actually supplied as a reference.
2. **Identity gate** — requested characters visibly retain canonical identity.
3. **Story gate** — the exact authored beat is depicted, with no invented story facts.
4. **POV gate** — Barnet/back-view and other camera rules are satisfied.
5. **Environment gate** — accepted geography/master-scene continuity is preserved.
6. **Prop/state gate** — only correct project stage and authored props are visible.
7. **Orientation gate** — vehicles, movement and object direction match canon.
8. **Style gate** — image belongs to the accepted SysselCraft visual language, with no generic glossy-animation drift.
9. **Runtime gate** — framing/aspect/output maps cleanly to its intended runtime use.

If any gate fails, the image is rejected and is not canon.

## Failure behavior

Vega must not “have a go” when the production contract is incomplete.

Examples:
- Nova requested but Nova reference cannot be retrieved → **stop, do not draw a substitute**.
- Mira + Nova requested but renderer only receives Nova → **stop or switch route**.
- environment reference unavailable → **stop if the environment is canonical/locked**.
- requested object orientation is unclear from canon → **ask/resolve before generation**.
- reference exists in Runway but cannot be passed to the chosen renderer → **do not pretend it was used**.

The user should never need to inspect a finished-looking image to discover that Vega silently guessed.

## Production principle

**References define identity.  
The manifest defines story.  
The master scene defines geometry.  
The prompt defines the moment.  
Generation paints.  
Vega verifies.  
If any locked input is missing, Vega does not guess.**


## Runway execution contract — LOCKED 2026-10-04

This is the concrete production path Vega must use for Act 3 character/story images when canonical references live in the Runway Brand Kit **Syssel**.

### 1. Resolve canonical assets

For every named established character or locked visual entity in the request:

1. Read the **Syssel** Brand Kit.
2. Search the appropriate section, normally **Character sheets** or **Environment references**.
3. Match the requested canonical name to exactly one asset.
4. Retrieve the asset's reusable Runway-hosted URL.
5. If zero or multiple plausible matches remain, stop before generation.

Examples:
- `Nova` -> canonical Nova asset in `Syssel / Character sheets`
- `Mira` -> canonical Mira asset in `Syssel / Character sheets`

A filename suffix such as `(1)` is not semantically relevant if the canonical name is otherwise unambiguous.

### 2. Generate inside Runway, not through an ungrounded fallback

When the canonical references come from Runway, Vega should use Runway's image-generation tool directly so those hosted assets can be passed without re-uploading.

For a multi-character scene:
- send every required canonical asset in `referenceImages`;
- assign a unique tag to each reference, e.g. `nova`, `mira`, `alve`;
- explicitly reference those tags in the generation prompt, e.g. `@nova` and `@mira`;
- include environment/master references in the same request when the scene requires locked geography/style;
- use a model that supports the required number of references.

Do not route the request through a renderer that cannot consume the resolved Runway references.

### 3. Example execution shape

Conceptually:

```text
referenceImages:
  - url: <Nova canonical Runway URL>
    tag: nova
  - url: <Mira canonical Runway URL>
    tag: mira
  - url: <optional canonical environment URL>
    tag: environment

prompt:
  "@nova and @mira are bathing together in the lake.
   Preserve both canonical identities exactly.
   Use @environment for geography and visual continuity.
   [beat-specific action, camera, lighting, forbidden elements...]"
```

The exact URLs are runtime data and must be copied verbatim from the Brand Kit result. Never reconstruct or abbreviate signed asset URLs.

### 4. Reference-count/model gate

Before submission, Vega must confirm that the selected Runway image model accepts at least the number of required references.

If the scene needs more references than the selected model supports:
1. select another available Runway image model that supports the full reference set, or
2. reduce references only if the manifest marks some reference as optional, otherwise
3. stop.

Never silently omit a required character/environment reference.

### 5. Post-generation verification

A successfully submitted Runway task is not yet an accepted production image.

After completion, Vega must inspect the result and verify:
- every requested canonical character is recognizable;
- no character identity was merged or swapped;
- Barnet's face is not exposed when applicable;
- environment continuity is correct;
- no unauthored characters/objects/civilization appeared;
- action/orientation/framing match the beat;
- visual style remains within SysselCraft canon.

If identity drifts, reject the image and regenerate with tightened reference instructions or a more suitable Runway model. Do not accept a merely attractive image.

### 6. No local-materialization dependency

The Act 3 production path must **not** depend on Kalle manually downloading or re-uploading canonical references into ChatGPT.

The canonical route is:

**user says canonical name -> Vega resolves it in Syssel -> Vega passes the Runway-hosted reference directly into Runway generation -> Vega verifies output**

Local materialization may be used for deterministic post-processing when necessary, but it is not the primary identity-grounding mechanism.

### 7. Fail-closed behavior

If Vega can see that an asset exists but cannot retrieve its reusable URL, or if the generation tool rejects the reference input, the pipeline is considered blocked.

Vega must say what failed and generate nothing.

The proof of concept is passed only when this direct Runway path works from a natural-language request without any repeated user upload of canonical references.


## Vega batch execution guard — LOCKED 2026-10-04

This is the mandatory operational guard for every Act 3 image batch.

### Core rule

**No preflight -> no batch.  
No canonical reference -> no image.  
Lost reference mid-batch -> stop.  
No guessing, ever.**

### Mandatory preflight

Before generating the first image, Vega must:

1. Read the entire requested batch.
2. Extract every named canonical character, environment, building/state, vehicle/prop and locked POV/orientation rule.
3. Resolve every required canonical entity from the Runway Brand Kit **Syssel**.
4. Retrieve the real reusable Runway asset URL for every required reference.
5. Verify that the selected Runway image model supports the full required reference count.
6. Build an internal batch reference map and reuse it consistently throughout the batch.
7. Authorize the batch only when every required reference is resolved and usable.

If any required reference is missing, ambiguous, inaccessible or unsupported by the selected generation route, the batch is **BLOCKED** and no image is generated.

### Per-image guard

Immediately before every image generation, Vega must verify:

- exact cast for this image;
- exact canonical references being sent;
- required environment/master reference;
- Barnet rear-view rule when applicable;
- required object/vehicle orientation;
- project/building state;
- forbidden additions.

The generation request must contain the actual references, not only their names in prose.

### Mid-batch failure

If a required reference can no longer be supplied at image N of a batch, Vega must stop before image N.

Never:
- fall back to text-only identity descriptions;
- silently omit a reference;
- substitute a visually similar character;
- switch to an ungrounded renderer;
- continue the remaining batch “as best as possible”.

### QA before continuing

Each generated image must pass the existing Act 3 acceptance gates before Vega proceeds to the next image. A failed image is rejected and retried or the batch is stopped if the cause is systemic.

### Operational shorthand

For every batch, Vega executes:

**parse batch -> resolve refs -> verify model capacity -> lock ref map -> generate one image -> QA -> next image**

This sequence is mandatory and must not be skipped for speed.


## Current project handover pointer — 2026-10-06

This document remains authoritative for its own domain. Current Runtime Architecture 1.1 execution status and continuation order are tracked in `docs/RUNTIME_1_1_HANDOVER_2026-10-06.md`.

Verified Runtime 1.1 docs baseline before this closeout: `eb7df728adea783c676fe697738be62200430fc9`, GitHub Actions #2252 SUCCESS. Runtime items 1–4 are closed; generic chapter persistence is next. This pointer does not change the domain decisions recorded above.

## Connected production-path verification — 2026-10-08

The Runway production route has now been exercised from ChatGPT against the real connected workspace.

Verified:
- authenticated Runway workspace available;
- Brand Kit **Syssel** resolves successfully;
- categories **Character sheets** and **Environment references** are readable;
- all eight canonical recurring character sheets resolve as reusable Runway-hosted image assets;
- multi-reference image generation accepts the real canonical Alve and Barnet assets in the same request;
- a 16:9 / 2K proof-of-concept generation completed successfully;
- the user did not need to download or re-upload canonical references.

PoC task:
- Runway task id: `9c020c98-03c4-4822-ab96-17cbf79a92f8`
- refs: canonical `alve.png (1)` + `barnet.png (1)`
- Barnet rear-view / face-hidden rule was included explicitly in the generation contract.

**Important acceptance boundary:** successful generation proves reference resolution and transport, not visual identity quality by itself. The generated raster still requires visual QA against the canonical sheets before the identity-grounding PoC is considered fully accepted.

### Canonical route decision

For Act 3 production:
1. **Primary:** Runway Brand Kit `Syssel` through this document's resolver/generation contract.
2. **Fallback / experiment only:** local `image-pipeline/` OpenAI batch tooling.
3. Never silently switch routes because a production reference is unavailable.
4. Never persist signed Runway asset URLs in repository manifests; resolve current hosted URLs from Brand Kit at execution time.
5. Repository manifests should store semantic canonical ids/names, not expiring transport URLs.

This removes the previous ambiguity where the local batch scripts and the Runway pipeline could both appear to be production authorities.

## Renderer-independent continuity engine — 2026-10-08

Act 3 art production no longer assigns identity/continuity ownership to Runway or any other renderer.

Canonical ownership is now:
- `image-pipeline/character-registry.json` for recurring character identity;
- structured beat manifests for authored image intent;
- `scripts/build-art-job.mjs` for deterministic reference + prompt + continuity resolution;
- approval logs for accepted visual lineage;
- `scripts/approve-art-image.mjs` for promotion into the continuity chain.

Preferred renderer: **ChatGPT image generation**.

Optional adapters:
- Runway, when useful;
- local OpenAI API generator, for automation/fallback/testing.

The renderer receives a prepared art job. It does not decide which character reference or continuity anchor is canonical.

### Verified three-beat continuity PoC

Manifest:
`image-pipeline/batches/poc-continuity-chain-01.json`

Regression:
`scripts/test-art-continuity-poc.mjs`

Verified behavior:
- first beat: canonical Alve + Barnet refs, zero continuity anchors;
- second beat: automatically inherits approved first image;
- third beat: automatically inherits the two most recent approved images;
- missing approved anchor fails closed;
- global Barnet face-hidden and style rules are compiled into every job.

GitHub Actions CI #2444: **SUCCESS** on `d2dfc3511f4c696f0e9b6912556332d53ad0678c`, including `art continuity PoC: PASS`.

### Remaining one-time-upload gate

For ChatGPT to remain the renderer across future conversations, the same canonical PNGs must be persisted on a ChatGPT-accessible Project/Library surface and recoverable as real image inputs.

The Git repository alone is not sufficient for this adapter because repository paths are not image inputs to ChatGPT image generation.

This is the next PoC step. Until it passes, do not claim that cross-conversation “upload once” is solved.

