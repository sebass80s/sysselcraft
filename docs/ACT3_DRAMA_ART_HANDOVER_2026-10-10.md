# NOVA HANDOVER — ACT 3 DRAMA ART (2026-10-10)

## Read this first
This is an ongoing SysselCraft production, not a new start. Canonical story: `docs/ACT3_STORY_MANIFEST.md`. Work branch: `nova/runtime-architecture-v1`, repo `sebass80s/sysselcraft`. Before making changes fetch latest version and verify branch/HEAD. Dialogue stored in GitHub overrides assistant recollection. Latest verification before this handover: full canonical manifest fetched successfully, contains A3-DRAMA-001 through 015.

## Current state
We are illustrating the DRAMA sequence one cinematic landscape 16:9 image per beat. User reviewed/accepted art:
- 001 Pappa ringer: accepted. Nova on phone, Barnet from behind, Alve at shuffleboard.
- 002 Det är alltid något: corrected image accepted; only Nova, Alve, Barnet, child face not visible.
- 003 En dålig idé: corrected argument composition accepted. Removed Nova's “Förlåt. Jag...” in canonical manuscript; commit `157a4dc40bdd87fd36e3549eacba32a46f5dddea`.
- 004 Gå inte: accepted after retries. Nova departing near folkpark entrance, turns back; child from behind. Removed “Vi ses imorgon” from “Glöm det. Vi ses imorgon.”, so she says “Glöm det.” then leaves; commit `fa9f7b4151385a02b9f361f08ce3a19f95c8a9f6`.
- 005 Efteråt: accepted. Only Alve (sad, at shuffleboard table) and Barnet from behind, Nova NOT in scene. Generated output user approved.
- 006 Ingen Nova: accepted. Following morning Henrik and Alve and child securing flapping tarpaulin at red folkpark stage, no Nova.
- 007 Vid lägenheten: accepted. Nova mildly relieved, not cheerful, takes recovered notebook from child at apartment building entrance; Alve optional, omitted from art.
- 008 Inte ert fel: accepted. Nova, Alve, Barnet seated outside apartment building on low stone wall; Nova with notebook, serious tender tone; child strictly from behind.
NEXT = 009 Något hon inte har berättat. No art for 009 yet. User asked “vad har vi på 9?” then requested this handover instead. Fetch exact 009 text from canonical GitHub before presenting or generating. 009 at the same apartment exterior reveals Nova remembers last family dinner, her angry outburst, and that the VERY NEXT EVENING parents told her they were separating; she privately connects and feels guilty. She gets up at end, asks to go somewhere. Handle this with restraint, not smiling.

**IMPORTANT:** Images have been produced/displayed in ChatGPT but NOT verified committed/uploaded to repository. Never claim GitHub art assets are synced; user previously preferred drag-and-drop uploads manually. The approval statuses above are conversation-based, not verifiable GitHub art states. Ask the user only if a genuine missing reference or art selection blocks progress.

## Image generation pipeline: WHAT FINALLY WORKED
1. Always read exact beat dialogue in `docs/ACT3_STORY_MANIFEST.md` BEFORE image generation. Do not draw the previous beat or invent action.
2. Identify story moment, location, exact cast, time-of-day, mood; honor both textual and visual continuity. Prefer expressive action over static group posing.
3. Prefer the supplied *character reference sheets* as identity guides. User uploaded canonical reference images Oct 10, available in this conversation as `/mnt/data/henrik.png`, `/mnt/data/alve(20261010-200529).png`, `/mnt/data/barnet(20261010-200529).png` (verify in current runtime; paths may not transfer across sessions). Nova reference may also exist `/mnt/data/nova.png`. If current instance lacks references, request them and explain, do not claim they were attached to generation if not.
4. Strongly isolate scene from previous image composition: earlier repeated failures kept drawing Nova in 005 despite dialogue stating she had left, and drew Nova in 006 despite absence. At generation time specify exact allowed cast (and exclude others), location and actual action. For 006 successful image was Henrik, Alve and Barnet battling presenning, matching script. Don't assume generator obeys prompt.
5. ABSOLUTE invariant: Barnet's face NEVER shown, not even a profile or 3/4 glimpse. Back of head/cap facing away from camera, rust-red hoodie, blue-and-cream mountain-logo cap, olive worn mountain-patch pack with flask and compass, baggy blue pants, boots. Screen image and reject if face visible.
6. Art look: warm cinematic stylized photo-realistic/3D-like animation, Swedish lakeside setting, rich natural detail, consistent outfits, 16:9 landscape, no dialogue lettering, no arbitrary festival or year signage. Early art consistent golden light but respect chronological time: 006 NEXT MORNING, then 007/008 outside apartment, not always shuffleboard.
7. Identity: Alve = young freckled tousled orange/auburn-haired boy, olive/green hoodie sleeves rolled, brown work cargo SHORTS, gloves, tool belt and boots; no beanie. Henrik = gray shaggy-haired middle-aged/elderly stubbly-bearded man, olive jacket/plaid shirt, work trousers, work gear; no baseball hat if ref doesn't show it. Nova = teenage freckled copper/orange bob with bangs, slate/teal sweater, baggy jeans, black headphones round neck, brown backpack. Barnet = strictly back.
8. Prior good behavior: reject incorrect output without falsely declaring it done. Multiple attempts happened for 005 because Nova incorrectly appeared twice, then user specified “Alve ska se ledsen ut”; resulting image with sad Alve and Barnet only was accepted. When user says “kör art 00X”, generate immediately based on canonical, avoid duplicate art and excess explanation. Do not repeatedly ask for references if available.
9. If model cannot genuinely access or pass images to generator, say so. Never claim references attached unless actually used. User is sensitive to overclaiming/art time waste.

## Canonical story and consistency cautions
DRAMA 003 and 004 dialogue corrections already committed as above. DRAMA-009 canonical explicitly says parents told Nova they would divorce **the next evening** after remembered final dinner (not later or same evening). Do NOT convert Nova’s parents into villains, assume her anger caused the divorce, or invoke Alve’s deceased mother to compare grief. In 007 Nova has apologized once; tension evolves, not instantly resolved.
There is outdated story continuity in DRAMA-005 footnote claiming Nova apologizes during 003, contradicted by updated canonical 003. Trust actual revised dialogue. Optionally flag and align docs during an authorized documentation cleanup; do not silently reinsert apology.

## Operational next steps
1. On resumption, explain in Swedish that next is A3-DRAMA-009, offer/show exact dialogue if user asks; continue illustrating only on request.
2. For 009, user may want to review dialogue before art, as with 007 and 008. Read manifest. Stay outside Nova's apartment, on/near low wall. Scene likely Nova opening up serious confession, Barnet back to camera and Alve listening. Do not inject a precise still without consulting user if they request another moment.
3. Art for 009, then 010–015 in order with per-beat dialogue verification and user approval.
4. Ensure user manually uploads selected images to relevant GitHub asset folders; do not imply art saved on GitHub unless checked.
5. Avoid gratuitous Vercel deployments and GitHub Actions spending while working on manuscript/art.

## URLs
Canonical: https://github.com/sebass80s/sysselcraft/blob/nova/runtime-architecture-v1/docs/ACT3_STORY_MANIFEST.md
