#!/usr/bin/env node

const SPECS = {
  "IMG-A2-JET-005": {
    cast: "Barnet/Adam, Alve, Valpen",
    stage: "Bryggan stage 1 (damaged old jetty)",
    requiredRefs: ["barnet", "alve", "valpen", "bryggan-stage-1"],
    action: "Adam and Alve actively clear loose debris and damaged boards from the stage-1 jetty and expose that deeper supports/timber are rotten. Both children are visibly working. This is diagnosis/clearing work, not rebuilding.",
    continuity: "No salvaged replacement timber has arrived yet. Ordinary hand tools only. Valpen is passive nearby.",
    mustNot: "Linus, Sol, Mira, Henning, life buoy, new replacement structure, completed repaired sections beyond accepted stage 1, accident, civilization."
  },
  "IMG-A2-JET-001": {
    cast: "Barnet/Adam, Alve, Linus, Valpen",
    stage: "Bryggan stage 1 (damaged old jetty), immediately before runtime 1/4→2/4",
    requiredRefs: ["barnet", "alve", "linus", "valpen", "bryggan-stage-1"],
    action: "Linus has come to the isolated lake with Adam and Alve to help deliver/inspect sound reused timber selected from Återvinningen. Salvaged boards/timber are staged naturally at the worksite. Linus participates practically or inspects material. The jetty remains visibly incomplete.",
    continuity: "This is the causal salvage-arrival moment before the first substantial repair payoff. Valpen is passive. No delivery vehicle or boat may be invented unless an accepted environment reference explicitly contains it.",
    mustNot: "Sol, Mira, Henning, life buoy, swimmers, completed jetty, village/civilization, sentimental memorial framing, invented truck, invented boat, invented outboard motor."
  },
  "IMG-A2-JET-002": {
    cast: "Barnet/Adam, Alve, Sol, Valpen",
    stage: "Bryggan stage 2",
    requiredRefs: ["barnet", "alve", "sol", "valpen", "bryggan-stage-2"],
    action: "Sol performs a calm age-appropriate prevention/safety check because Adam and Alve intend to swim. She examines or indicates safe access into/out of the water and visible old harmless debris/hazards at the shoreline.",
    continuity: "Nobody is hurt. The water is inviting, but the bathing edge still visibly needs cleanup. The need for a proper life buoy is identified here, but the buoy has not been purchased or mounted yet.",
    mustNot: "injury, blood, emergency treatment, ambulance, panic, already-mounted life buoy, Mira, Henning, crowd, completed jetty, civilization."
  },
  "IMG-A2-JET-006": {
    cast: "Barnet/Adam, Alve, Valpen",
    stage: "Bryggan stage 2 moving toward stage 3",
    requiredRefs: ["barnet", "alve", "valpen", "bryggan-stage-2"],
    action: "Adam and Alve actively clear the bathing edge/shoreline after Sol's inspection. The already-purchased proper life buoy is physically present, new, and ready to mount or being mounted.",
    continuity: "The life buoy purchase already happened off-image through Mira; its price is deliberately TBD and never visible. Valpen is passive. The scene precedes the runtime 2/4→3/4 transition.",
    mustNot: "Mira transaction, price, signage, Sol supervising, injury, crowd, old/weathered buoy, completed jetty, civilization."
  },
  "IMG-A2-JET-007": {
    cast: "Barnet/Adam, Alve, Valpen",
    stage: "Bryggan stage 3 moving toward stage 4",
    requiredRefs: ["barnet", "alve", "valpen", "bryggan-stage-3"],
    action: "Adam and Alve actively finish the remaining major mid-stage repair and tidy the social/bathing portion. The jetty is nearly complete but still visibly an active worksite.",
    continuity: "The proper life buoy is already permanently mounted and must persist. Enough ordinary tools/material remain to show ongoing work. Valpen is passive.",
    mustNot: "completion crowd, removed-all-tools final state, new purchased furniture system, extra residents, missing life buoy, civilization."
  },
  "IMG-A2-JET-003": {
    cast: "Barnet/Adam, Alve, Henning, Valpen",
    stage: "Bryggan stage 3, unfinished but usable",
    requiredRefs: ["barnet", "alve", "henning", "valpen", "bryggan-stage-3"],
    action: "Henning is the first social visitor who deliberately comes to the lake because the restoration is making it inviting again. Adam and Alve remain the primary emotional focus; Henning is clearly present but secondary.",
    continuity: "The permanent mounted life buoy is visible. Work traces remain so the project is clearly unfinished. The composition may support the transition into Adam and Alve's first proper water break without turning into a crowd scene.",
    mustNot: "multiple residents, Sol, Mira, Linus, Linus+Henning pair, full completion celebration, finished crowd scene, missing life buoy, civilization."
  },
  "IMG-A2-JET-004": {
    cast: "Barnet/Adam, Alve, Valpen",
    stage: "Bryggan stage 4 (completed accepted state)",
    requiredRefs: ["barnet", "alve", "valpen", "bryggan-stage-4"],
    action: "Adam and Alve look over and use the completed summer place. The composition emphasizes the lake, sitting/swimming access and the feeling that the place has been handed back to ordinary summer life.",
    continuity: "The permanent life buoy is mounted. Tools and construction-material clutter are removed. Prefer Adam and Alve alone with passive Valpen so later ambient resident combinations remain discoveries.",
    mustNot: "construction debris, unsafe broken boards, crowd, family-return material, motorboat completion, Act 3 destination, civilization."
  }
};

const FRESH_ALLOWED = new Set(["IMG-A2-JET-005", "IMG-A2-JET-001"]);

const FROZEN = ({id,spec,anchor}) => `${anchor ? `EDIT MODE REQUIRED. Start from the supplied accepted anchor image ${anchor}. Preserve its established SysselCraft rendering, camera language, human proportions, material realism, character identities and overall visual world unless the locked action/stage below explicitly requires a change. Do NOT reinterpret the scene from scratch.\n\n` : ""}Create ONE finished landscape/iPhone SysselCraft Story Moment for ${id}.

Use the supplied accepted ${spec.stage} reference as the visual authority for the restoration project's geometry, construction state and lake environment. Do not redesign the accepted project stage.

Use the supplied canonical character sheets ONLY for the identities, clothing, proportions and silhouettes of ${spec.cast}. Ignore every background/environment visible in character reference sheets.

${anchor ? "VISUAL-ANCHOR LAW: copy established character rendering from the accepted anchor wherever the same character persists. Character sheets resolve identity details; they do not authorize a fresh redesign. Text describes only the required scene change.\n\n" : ""}STYLE LOCK: warm cinematic semi-realistic CGI / photographic storybook. Natural human anatomy and proportions. Natural small eyes. Realistic skin, hair, fabric, wood, water and vegetation. Subtle believable facial expressions. Cinematic natural daylight and physically believable materials. Preserve the established SysselCraft character identities without converting them into an animated-film aesthetic.

ABSOLUTELY FORBIDDEN STYLE DRIFT: cartoon, glossy cartoon, animated-film aesthetic, Pixar-like rendering, Disney-like rendering, anime, chibi, giant or exaggerated eyes, oversized heads, plastic toy-like skin/materials, caricatured faces, flat vector/clipart styling.

CHILD LOCK: Barnet/Adam is shown only from the back or rear-three-quarter. His face must never be visible, inferred or invented. Preserve his canonical cap, red hoodie, blue cargo pants, blue/gray shoes, rugged olive/brown backpack and established body proportions.

PUPPY LOCK: when Barnet is present, Valpen is present unless the image contract explicitly says otherwise. Valpen remains passive/background unless the image contract explicitly authors an action.

ALVE LOCK: when Alve is present, preserve his canonical messy reddish-brown hair, freckles, natural/small eyes, olive/gray hoodie, gray-brown cargo shorts, sturdy brown boots, work gloves, tool belt/pouches and established natural proportions.

ENVIRONMENT LOCK: isolated Act 2 lake wilderness only: lake, forest, rocks, reeds and natural vegetation consistent with the accepted stage reference. Absolutely no village skyline, church, houses, house rows, harbor, roads, vehicles, modern traffic, unrelated buildings, random people or other signs of civilization.

COMPOSITION LOCK: one coherent full-frame image only. No diptych, split screen, collage, contact sheet, sprite sheet, multiple panels, inset image, UI, caption or baked-in text.

CAST LOCK: show exactly ${spec.cast} and no additional people or characters.

ACTION: ${spec.action}

CONTINUITY OBJECTS: ${spec.continuity}

IMAGE-SPECIFIC MUST NOT SHOW: ${spec.mustNot}

Do not add story events, props, purchases, injuries, residents, construction progress, transport/delivery mechanisms or environmental features not authorized above.`;

function fail(message) {
  console.error("\nACT2 IMAGE PREFLIGHT FAILED:\n" + message + "\n");
  process.exit(1);
}

const [id, ...args] = process.argv.slice(2);
if (!id || !SPECS[id]) {
  fail("Unknown or missing IMAGE_ID. Allowed IDs:\n" + Object.keys(SPECS).join("\n"));
}

const refsArg = args.find(a => a.startsWith("--refs="));
if (!refsArg) fail("Missing --refs=. Declare the references actually present in the active image conversation.");

const refs = new Set(refsArg.slice("--refs=".length).split(",").map(s => s.trim().toLowerCase()).filter(Boolean));
const spec = SPECS[id];
const missing = spec.requiredRefs.filter(r => !refs.has(r));
if (missing.length) {
  fail(`Missing required active references for ${id}: ${missing.join(", ")}`);
}

const anchorArg = args.find(a => a.startsWith("--anchor="));
const anchor = anchorArg ? anchorArg.slice("--anchor=".length).trim() : "";
if (!FRESH_ALLOWED.has(id) && !anchor) {
  fail(`EDIT MODE REQUIRED for ${id}. Supply --anchor=<accepted prior production image id>. Fresh text-to-image is forbidden once the Bryggan series has an accepted visual anchor.`);
}
if (anchor && !/^IMG-A2-JET-00[1-7]$/.test(anchor)) {
  fail("Invalid --anchor=. Use an accepted Bryggan production image id such as IMG-A2-JET-001.");
}

console.error(`ACT2 IMAGE PREFLIGHT PASSED: ${id}\nRequired refs declared: ${spec.requiredRefs.join(", ")}${anchor ? `\nEDIT anchor: ${anchor}` : "\nFresh generation explicitly allowed for this anchor-producing ID."}\n`);
console.log(FROZEN({id, spec, anchor}));
