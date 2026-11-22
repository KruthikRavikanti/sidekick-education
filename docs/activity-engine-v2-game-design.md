# AI game design and a shared playable world

The development-preview **Create an activity** flow now plans an experience
before authoring its executable program. It proposes five concepts, reviews their
learning and play quality, then composes one through reusable world and concept
controls. GameDesign is planning data; only the existing ActivityProgram language
executes in the authoritative Python `ExecutionCore`.

This builds on the [foundation](activity-engine-v2-spec.md),
[trusted runtime](activity-engine-v2-runtime.md),
[live composition](activity-engine-v2-composition.md), and
[fraction-piece benchmark](activity-engine-v2-fraction-benchmark.md). Those reports
retain their original milestone boundaries. A valid fraction panel alone does
not satisfy the new gameplay admission requirement.

## Run the current preview

Keep the existing account, database, credentials and dependencies. Apply all
pending migrations, including `010_game_design_composition.sql`, then restart:

```sh
npm run db:migrate
SIDEKICK_ACTIVITY_V2_PREVIEW=true npm run dev:all
```

`APP_ENV` must be `development` or `test`. The preview defaults to off and refuses
production even when its flag is enabled. The existing `backend/.env` supplies
`VISION_API_KEY`, `VISION_MODEL` and `VISION_BASE_URL`; no new credential is needed.
Do not replace that file when updating the repository.

To play the four saved examples, sign in, choose a child, and select **Saved activities**
on the child's home, or open **http://localhost:3000/kid/activity-preview**. The reviewed examples are
available to every signed-in child in this development preview. Starting one
creates that child's own private attempt; **Continue** resumes their latest
attempt with the same approved definition. These examples need no new provider
call or upload. Original evaluator URLs remain private to their original profile.
Opening an activity link while signed out now returns to that link after sign-in
and child selection. A link owned by another profile offers **Browse activities**
instead of exposing that profile's attempt.

The saved-example access regression is covered by
`backend/tests/test_activity_program_benchmarks_v2.py` and
`npx playwright test --config playwright.activity-v2-benchmarks.config.ts`.
The browser suite uses separate ports, database, upload storage and Next cache;
it verifies login/profile return, all four example cards, a real action and
refresh, Continue/fresh attempts, parent-to-child navigation and account isolation.

Sign in, choose a child, and open **http://localhost:3000/kid/homework**. Upload
schoolwork, select **Read my work**, then **Create an activity** in the development
preview. The server derives the learning goal from the owned upload, supported
observations and relevant saved history. It does not ask the child to select a
game. V1 **Try an activity** remains a separate flow.

Progress has a durable address at
`/kid/activity-preview/generations/{generationId}`. The owned preview list at
**http://localhost:3000/kid/activity-preview** resumes accepted attempts; a session
lives at `/kid/activity-preview/{sessionId}`. Refresh restores accepted decisions,
help and the exact pinned definition. A finished attempt remains visible and
read-only. A failed generation offers an explicit retry; duplicate requests and
uncertain responses reuse their reservation. Interrupted generation can recover
after its nine-minute worker lease expires.

Migration 010 adds private planning, candidate evaluation, gameplay review,
structural fingerprint, render-manifest and duration records to generation jobs.
It does not reinterpret V1 or older V2 histories. Plans, assessment predicates,
finish witnesses and raw provider responses are not exposed through child APIs.

## Design, select, author, review

1. One bounded model request proposes exactly five typed `GameDesign` candidates.
   Each names its exact objective, supported need, brief child goal, objects,
   decisions, action loop, constraints, conceptual consequences, recovery, help,
   finish, evidence limitations and required or missing capabilities.
2. Deterministic evaluation rejects invented context references, target changes,
   unsupported operations, unresolved roles and cosmetic duplicate structures.
   At least three eligible, structurally distinct concepts are required. A failed
   planning attempt can receive one repair with the previous typed batch and its
   specific eligibility reasons. Both attempts remain inspectable privately.
3. A separate model request reviews all five concepts for target integration,
   understandable play, meaningful choice, recovery and support from the actual
   context. It is bound to the exact batch hash and known candidate IDs. Quality
   rank selects an eligible approved concept; structural novelty breaks ties.
4. The author composes that selected design into the closed provider authoring
   schema. The deterministic compiler preserves server-owned intent and emits
   ActivityProgram. Schema, operation contracts, exact mathematics, assessment,
   runtime compatibility and a nonempty finish witness must all pass.
5. Independent semantic and gameplay reviews approve the exact final definition
   hash. Gameplay review also binds the exact render-manifest hash. A repair
   repeats compilation, computational admission and both reviews; approval from
   an earlier candidate never carries over.

There is no finished-game fallback, permanent skill-to-game dispatch or second
GameDesign interpreter. Missing operations stay unavailable. A safe reason code
and bounded repair feedback distinguish provider, schema, witness, scoring,
semantic and gameplay failures. Candidate content is retained only in private
owned audit records, never in errors or ordinary logs.

The normal successful path uses five provider calls. The hard job bounds are
**eight total calls and 480 seconds**, with at most three authored candidates and
one planning repair. Another author attempt starts only with at least three calls
remaining for authoring and both reviews. This allows a third candidate after
cheap schema failures; a planning repair or a fully reviewed rejection consumes
the same budget. The server retains the last concrete failure and stops rather
than admitting an incompletely reviewed candidate.

| Request | Maximum output tokens |
| --- | ---: |
| Propose or repair five designs | 9,000 |
| Review the design batch | 3,500 |
| Author or repair the program | 18,000 |
| Semantic review | 2,000 |
| Gameplay review | 2,500 |

Task-scoped requests have a 512 KiB input ceiling. The existing provider timeout
also applies within the overall deadline. Safe metadata records task, requested
and returned model identifiers, elapsed milliseconds, output-token cap, bounded
usage counters, HTTP status and finish reason when available. These bound and
explain consumption; they are not a fixed monetary price guarantee. Credentials,
worksheet content and provider bodies stay out of logs.

## Reusable world capabilities

The central stage contains locations, movable actors or devices, fixed objects,
connections, contextual tools and visible reactions. It composes the existing
fraction, grid, equation, evidence and writing controls rather than implementing
a controller for each game name or subskill.

| Capability | Trusted behavior and visible effect |
| --- | --- |
| Locations and pieces | Typed location state, accepted entity kinds and capacities constrain where a piece can go. Percent coordinates arrange the stage. |
| Travel | `move_actor` changes an actor's actual location only across an adjacent, currently usable connection. |
| Placement | `place_piece` moves a device into a permitted location; capacity and kind constraints remain server enforced. |
| Inspection | `inspect_location` records a bounded discovery. Declared guards can make source material or a tool available after inspection. |
| Concept representations | `representationObjectId` displays actual bound fraction pieces, grid coverage, an expression, selected literal evidence or saved writing in the world. A correctness label cannot substitute for the artifact. |
| Physical surfaces | `stage.surfaces` places an actual concept object on a connection or at a location. Grid cells can form the route's visible planks; fractions retain the complete same-whole geometry. Literal evidence and saved text remain actual source artifacts. Optional direct cells reuse the existing server-checked action. |
| Contextual tools | Every non-world component attaches to an entity. A compound tool can attach to different entities representing its real objects; identical component/entity pairs cannot repeat. Native world controls are not tool attachments. |
| Connections and reactions | Predicates over actual concept state derive usable routes, reveals and visible statuses. They can change ongoing choices before the final finish. |
| Construction mounts | An optional connection `construction` binds an actual grid and target rows/columns. Its full source surface shows a dashed target footprint at the same unit scale. The core requires exact dimensions and every cell covered, in addition to declared guards, before travel is possible. |

A construction mount is `connection.construction = {objectId, rows, columns}`.
Targets are integers from 1 to 12, with area at most 120 and dimensions inside the
source grid's bounds. The same connection must have a surface for that same grid,
with `layout: "object"` and `cellIds: []`. Route availability is the declared
`when` predicate **and** exact actual dimensions **and** full source coverage.
`when: {kind: "always"}` is valid: the mount itself supplies the conceptual
dependency. Its derived fit is a navigation affordance; assessment still uses
actual dimensions, covered cells and the child's multiplication or other target
evidence. No fit flag substitutes for that evidence. Connections without a
construction field retain their earlier semantics and serialized shape.

The bounded stage permits 12 locations, 12 entities, 24 connections, 12 tool
attachments, 24 reactions and eight physical surfaces. A surface has exactly one
location or connection anchor. Only grids support selected cell subsets and
row/column layouts; a fraction surface always shows its whole. Mutable source
display uses the surface's explicit visibility predicate and a bound visible
presentation space. Editing separately requires tool availability, so a discovered
construction can remain visible read-only after its actor leaves the workshop.
A hidden space or false surface predicate hides that source; discovery hiding
must be explicit in the surface predicate. An immutable reference can be shown
without an interactive tool. A public construction target can still appear as a
read-only dashed footprint while its source is hidden; source values and actions
remain absent. Geometry too small for direct touch targets stays read-only with
contextual tools. These surfaces connect actual source geometry to the
world; they do not add optical, fluid, collision or transport simulation.
Assets use a closed reusable set of simple SVG
illustrations. No generated HTML, JavaScript, unrestricted expression or new
image-service credential executes.

Each grid's selected-cell count is bounded by its own `unit_tiles.quantity` and
collection bounds. Lifting frees that grid's stock; resizing does not paint cells,
and out-of-bounds occupied cells must be lifted before shrinking. This is not a
shared stock across multiple grids. Finite stock is an optional design resource,
not a requirement for every experience. A fitted construction can have one common
finish: meaningful alternative shapes or approaches do not require divergent
endings or a different later use at every destination. Arbitrary numeric room
keys and unrelated correct-answer rewards still fail gameplay review.

Rule guards and effect values use the existing pre-action snapshot. The core
validates and atomically commits an accepted transition, then derives stage
connections, tool availability, representations and reactions from the new
authoritative state. These derived views do not execute additional effects or
trigger rule cascades. A cyclic route does not run itself; each traversal requires
another bounded child action. Rejected actions leave state unchanged. Browser
animations illustrate accepted state and do not award correctness.

World movement, placement and inspection are recorded decisions, but are not
automatic learning evidence. Automatic assessment must use the underlying concept
actions and state. An opened route or completed mission cannot establish
understanding. Subjective language quality remains **pending parent review**;
saving or revising text and meeting a word count can constrain mission completion
without scoring writing quality. Assistance is durable and separate from an
independent result. This milestone does not update learner states or award mastery.

## What quality review can establish

Gameplay admission requires a main stage, an actual mutable concept representation,
concept-dependent consequences and a verified finish through the same core.
A bounded world-only counterfactual explores up to 64 states and 256 attempted
world moves with concept state unchanged; an obtainable finish rejects the
candidate as bypassing the concept. This is a shortcut check, not exhaustive
proof about every possible path.

The render manifest describes actual renderer geometry, accessible controls,
contextual-tool behavior, visible materials, current representations and sampled
authoritative intermediate states. Hidden source material is not misreported as
initially visible. Review checks meaningful choices, understandable consequences,
recovery, conceptual necessity, a brief goal, finish quality and relevant variety.
Bare teaching panels and a correct-answer gate followed by a cosmetic reward can
fail even when schema and arithmetic pass. Click count is not a quality metric.

The React stage supports direct drag or select-then-place movement, native
keyboard controls, mobile layout and reduced motion. Its central representations
show real constructed state; contextual controls open around the selected object.
Model review of this render contract is separate from actual desktop/mobile
screenshots, browser play, child usability testing and evidence of learning
effectiveness. The latter two have not been established by this engineering work.

## Responsive stage layout

The renderer places whole artifacts in bounded clear lanes. It considers preferred
anchors plus five horizontal candidate columns in 24-pixel vertical steps.
Avoiding other artifacts and native entity/location controls outweighs proximity
to the original anchor. Construction bounds include the actual/target footprint
union, a 40-pixel heading and 64-pixel feedback footer. The displayed SVG route
passes through the relocated target's entry and opposite exit ports; it does not
continue as a disconnected straight line through the original midpoint. This
changes presentation, not the authoritative connection graph or allowed moves.

| Visible content | Phone ≤520px | Tablet 521–1049px | Desktop ≥1050px |
| --- | ---: | ---: | ---: |
| No surface | 410px | 440px | 500px |
| Path surface or public construction target | 500px | 500px | 550px |
| Any location surface | 580px | 580px | 620px |
| Each additional distinct path beyond the first | +400px | +400px | +220px |
| Each visible location surface when multiple paths exist | +160px | +160px | +80px |

Path counts use distinct connection IDs, including public target-only mounts.
The manifest records the resulting height at initial and sampled intermediate
states. Taller worlds scroll vertically on a phone.

Actual source cells and dashed target cells share row/column positions and a fixed
unit scale: `min(44px, 224px / columns, 176px / rows)`, using public source bounds
and target dimensions. Reshaping changes the occupied footprint rather than
resizing every unit to manufacture a fit. Hidden source bounds are not inferred.
Direct native cell buttons require a unit of at least 24px; smaller representations
stay visible with contextual controls. Fractions retain their complete equal-sized
whole and their existing piece geometry.

## Render changes and operator re-review

A gameplay receipt approves both an immutable program hash and a particular
render-manifest hash. A generic renderer correction can invalidate the latter
without changing the program or its semantic receipt. A receipt is never rewritten
to claim it reviewed another layout.

The engineering-only `scripts/refresh_game_render_review.py` handles that case.
It requires `SIDEKICK_RUN_GAME_LIVE=true`, an external private verification config,
an explicit case, isolated synthetic storage, an owned ready generation, and an
untouched original session with zero actions, revision and help. It checks the
unchanged definition/intent, semantic receipt, prior stored render receipt,
runtime compatibility and nonempty finish witness. Witness validation runs in
the execution core; it never plays actions into a child's session.

The tool reserves **one** configured gameplay-review call with no automatic retry.
It must fit the original job's remaining eight-call and 480-second active-time
budget; inactive time spent inspecting the browser does not become generation
time. The old receipt and manifest stay in private audit. A new approval binds the
current manifest while leaving program bytes, semantic approval and child events
unchanged. Rejection or invalid output fails the job and prevents evaluator
import. Safe report history contains hashes, outcomes and call/timing metadata;
provider bodies and private manifests stay out of logs. Browser proof is cleared
for fresh recording after a render change. This is an operator verification tool,
not a child-facing regeneration or approval bypass.

## Structural variety and history

Planning signatures compare action loops, goal and constraint types, relationships
and concept consequences with relevant owned history. Final program fingerprints
independently record actual operation/rule structure, state dependencies, directed
connections, entity relationships, resources, tools, reactions and completion.
Changing titles, numbers, IDs, coordinates, colors, asset skins or the private
finish witness does not establish a different play loop.

Saved history includes both the selected plan signature and actual pinned-program
signature. Planning comparison uses compatible planning features; final review
still sees actual runtime structure. Novelty is a conservative tie-break and
review input, not a reason to sacrifice learning clarity or a claim of enjoyment.

## Verified generated benchmarks

Four selected activities were composed by the configured AI, admitted with exact
semantic and gameplay receipts, and completed through native browser controls.
Requested and returned model: **gpt-6.1-terra**. The
[generation and verification report](activity-engine-v2-game-design/report.json)
contains the five-candidate plans, judgments, safe call/timing metadata, rejected
attempts, public-play decisions, hashes and final checks.

The Activities gallery above starts a private copy for the current child. Each
original link below opens a separately saved, **zero-action** evaluator attempt in the
existing local account/child used for the Lantern benchmark. Select that profile
before opening a link. The recorded engineering attempts used isolated synthetic
storage. Only reviewed curriculum definitions were copied to the local account;
no synthetic uploads, student observations, mistakes or completed outcomes were
attributed to a real child. Existing attempts were preserved.

| Untouched local activity | Mapped target | Actual browser evidence |
| --- | --- | --- |
| [Choose a Crossing](http://localhost:3000/kid/activity-preview/5a362e3a71d640fcba7870e47ca5fe1e) | `3.MD.C.7-1` | [Recording](activity-engine-v2-game-design/area-first.webm) · [Desktop](activity-engine-v2-game-design/area-first-desktop.png) · [Phone](activity-engine-v2-game-design/area-first-mobile.png) |
| [The Garden Walks](http://localhost:3000/kid/activity-preview/60d93983058a492984a44b9168a70428) | `3.MD.C.7-1` | [Recording](activity-engine-v2-game-design/area-second.webm) · [Desktop](activity-engine-v2-game-design/area-second-desktop.png) · [Phone](activity-engine-v2-game-design/area-second-mobile.png) |
| [The Traveling Seed Report](http://localhost:3000/kid/activity-preview/43bf5216938f467c8b1e0c6b38125da2) | `RI.3.2-1` | [Recording](activity-engine-v2-game-design/ela-reading.webm) · [Desktop](activity-engine-v2-game-design/ela-reading-desktop.png) · [Phone](activity-engine-v2-game-design/ela-reading-mobile.png) |
| [Write What Comes Before](http://localhost:3000/kid/activity-preview/5e32eea95afb4feeb2d8ee93e477b07c) | `W.4.3-1` | [Recording](activity-engine-v2-game-design/ela-writing.webm) · [Desktop](activity-engine-v2-game-design/ela-writing-desktop.png) · [Phone](activity-engine-v2-game-design/ela-writing-mobile.png) |

These local account/session IDs are not portable to a clean clone. The exact
synthetic [programs and reviews](activity-engine-v2-game-design/report.json) are
exported beside the report for audit. They are never loaded as runtime fallbacks.
The explicit development gallery validates the four whitelisted program and
review exports through the same approval gate before starting an owned attempt;
it does not alter upload routing, live generation or another child's history.

### Choose a Crossing

- **What can the child decide?** Build a long `2 × 6` crossing or a wide `3 × 4`
  crossing; test one, return, and rebuild before finishing.
- **What visibly changes?** Real unit squares fit or protrude beyond dashed
  footprints. Reshaping switches which route is usable, changes the visible
  equality, and lets the traveler cross the fitting construction.
- **Why use the concept?** Complete coverage and an independently entered product
  must agree with the actual rectangle. The browser probe preserved the incorrect
  `2 × 5 = 11` exactly; it did not earn the area result.
- **How does it finish?** Travel across a completed crossing and inspect its
  lookout with a valid area product. The recording tries both shapes and finishes
  with `3 × 4 = 12`.

### The Garden Walks

- **What can the child decide?** Choose which row to build first, test that walk,
  lift a plank, and repair or build the other row.
- **What visibly changes?** Each three-square row opens its own route while the
  other may remain unfinished. Lifting one square closes that route; completing
  both rows makes both walks usable together.
- **Why use the concept?** The two rows form the actual six-square rectangle.
  Completion checks its coverage and the child's `2 × 3 = 6` equality. An incorrect
  `2 × 3 = 5` remains visible until revised.
- **How does it finish?** Complete the rectangle, show its area, and inspect the
  hub. Exploring the opened walks is optional; our browser play tests both.

These Math experiences differ in their state and consequences, beyond numbers or
skins: one reshapes a whole construction and switches between mutually exclusive
fits; the other grows a fixed network whose rows become useful independently
before the whole rectangle is complete. The latter has no reshaping action.

### The Traveling Seed Report

- **What can the child decide?** Compare animal and wind evidence, write an
  original main-idea label, and revise it after considering the other example.
- **What visibly changes?** The selected literal detail and actual written label
  replace the mounted report cards; the prepared report can travel to Publisher.
- **Why use the concept?** A fox-only label misses the wind example. The child
  needs a broader main idea covering both, expressed in original words and
  supported by the passage. The workflow cannot establish semantic quality.
- **How does it finish?** Take the report to Publisher and publish. The saved text
  and evidence remain **pending parent review**. Our broad response was “Wind and
  animals carry seeds to new places.”

### Write What Comes Before

- **What can the child decide?** Choose a glowing-map or stopping-train
  continuation, write an original preceding opening, then switch cues and revise.
- **What visibly changes?** The chosen next line and the child's actual writing
  change on stage. Finishing moves that same opening card to Story display,
  where the cue and revised text remain visible.
- **Why use the concept?** An opening must establish narrator, characters and
  situation so the selected next event follows naturally. Many openings can work;
  a word count or completed display cannot establish their quality.
- **How does it finish?** Place the revised opening card on display. The exact
  artifact is saved **pending parent review**. The browser experiment switches
  from a map opening to a newly written train opening before publishing.

The writing source's blank story-opening prompt overlaps adjacent grade-level
standards. Live mapping selected **W.4.3-1**, accepted unchanged rather than
replaced with the initially anticipated W.3.3-1. Every selected context used
`explore_skill` with no reliable student-work observations. No diagnosis, confidence
upgrade, misconception or mastery was invented.

An additional, earlier verified writing activity, **The Opening Detective**, is
retained in `extraVerifiedBenchmarks`, with its
[recording](activity-engine-v2-game-design/extra-opening-detective.webm) and audit
exports. It is separate from the four selected evaluator attempts.

## Frozen composition and maintenance record

The shared capabilities were frozen before ELA generation. A later Math pointer
check exposed a rotated caption covering a native tile. Three shared renderer
files were corrected, with no operation, schema, scoring, program or render-receipt
change. All four original definitions were then replayed through fresh native
attempts.

To make the final-renderer transfer check explicit, **Write What Comes Before was
newly composed after that renderer freeze**, without a game-specific branch,
brief, prebuilt program or finished-activity fallback. Its six-call generation
and five-action public rehearsal are separately recorded. A final review also
tightened the server's hint availability check to match the UI; this added no
learning capability. All four selected definitions passed fresh browser play
again after that authorization correction. Snapshot history, changed files,
composition snapshot hashes, exact unchanged definitions and replay checks are
retained in the report rather than represented as one uninterrupted binary hash.

## Verification

| Check | Result |
| --- | --- |
| Full backend regression | 1,831 cases passed; 57 transient SQLite fixture setup errors passed on isolated rerun |
| Final help-boundary/runtime checks | 61 passed, including rejected hidden hints, no mutation, discovery and replay |
| Shared V2 browser regression | 20 passed |
| Stubbed upload → composition → completion browser flow | 2 passed |
| V1 accounts/activity browser regression | 12 passed |
| Selected real-provider browser activities | 4 passed with the final renderer/service |
| TypeScript and production build | Passed |
| Original witnesses, capability-gap and catalog checks | Passed |

Every selected browser journey starts with zero actions and checks an experiment
or alternative, recovery, meaningful choice, delivered help, refresh, lost-response
retry, duplicate idempotency, another account's read/write denial, completion,
deterministic replay and an unchanged pristine source. Plans came from public
materials and controls; private finish witnesses were not used for autoplay.
Screenshots and short recordings capture actual browser decisions, not mockups.

Controlled geometry tests additionally reproduce the missed integer-coordinate
pointer click and check native cells/captions on phone and desktop. Model review,
engineering verification, actual child testing and learning effectiveness are
separate: **no child study or learning-effectiveness result is claimed**.

## Rejections and remaining limits

The [earlier rejected explorations](activity-engine-v2-game-design/rejected-explorations.json)
include decorative fraction worlds, invalid attachments, a truncated planning
response and weak area proposals. The current report also retains the rejected
repetitive Math draft, reading shortcut/hash failures, overlapping-layout and
pointer failures, and an engineering test-auth interruption. That interruption's
provider count/usage was unavailable and is marked incomplete rather than zero;
subsequent authorization/timeout paths now retain safe attempted-call metadata.

- New fraction-world drafts did not meet this gameplay benchmark; the existing
  Lantern activity and exact fraction semantics remain supported and tested.
- Live generation can still be rejected. Jobs have bounded repair and explicit
  retry; automated approval is a filter, not a guarantee of enjoyable play.
- Large worlds scroll vertically on phones. Stage text cards show excerpts;
  contextual tools provide the complete source and writing. Full native live
  journeys were desktop; phone layouts and representative controls used browser
  emulation, not a physical-device or child usability study.
- Reading interpretation and original writing quality await a parent. The server
  validates actual artifacts and workflow without declaring literacy mastery.
- The stage is a bounded symbolic world with real mathematical/source artifacts,
  not a general physics engine or proof of live coverage across every K–5 skill.

## Engineering reproduction

The app's local run command and required environment variables are above. For a
new isolated real-provider proof, generate the original synthetic uploads and use
new external private filenames:

```sh
backend/.venv/bin/python scripts/generate_game_design_work.py
SIDEKICK_RUN_GAME_LIVE=true backend/.venv/bin/python scripts/prepare_game_design_live.py \
  --private-config /tmp/sidekick-new-games-config.json \
  --browser-state /tmp/sidekick-new-games-state.json \
  --report /tmp/sidekick-new-games-report.json
SIDEKICK_RUN_GAME_LIVE=true backend/.venv/bin/python scripts/compose_game_design_case.py \
  --private-config /tmp/sidekick-new-games-config.json --case area-first
```

Use `prepare_game_design_play.py` for separate zero-action engineering attempts,
inspect their public materials, and rehearse those public decisions with
`game_design_public_action.py`. The live browser configuration takes
`SIDEKICK_GAME_PRIVATE_CONFIG` and optional `SIDEKICK_GAME_CASES`; it refuses to
invent a plan or use a private witness. `freeze_game_capabilities.py` records and
checks the shared source boundary. Audit exports and local evaluator copies
require matching browser hashes, both exact reviews and pristine sources.
