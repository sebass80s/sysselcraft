# Act 3 Art Pipeline

Status: **PREPARED / VEGA-OWNED ART PIPELINE**
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
