# ActivityProgram capability audit

This appendix records the current implementation and an offline review inventory across the complete K–5 catalog. It does not register new games or change runtime skill routing. The [architecture specification](activity-engine-v2-spec.md) defines the new contract and staged integration work.

## Scope and interpretation

The unchanged catalog contains **795 K–5 subskills: 396 Math and 399 ELA**. The inspectable [per-ID inventory](../data/activity_engine_v2/capability_gaps.json) includes every one of those IDs and its exact demonstration. Deterministic, coarse selectors over the existing family plan and catalog descriptions identify **590 rows with candidate extension reviews**; **205 rows have no specific extension inferred**. Neither category means supported, unsupported, playable, generated, assessed, or effective. Some simple tasks already have adequate legacy controls; a candidate extension often improves the range of experiences rather than being a prerequisite for every task on that skill.

The inventory is a review backlog. Candidate operations are many-to-many and may be combined, replaced, or unnecessary for a particular learning intent. They must never become an authoritative `subskill -> game/family` whitelist. Existing family labels appear solely to make this audit's provenance inspectable. Every program still needs concrete action, material, evidence and goal validation, semantic review, and eventual child testing.

Reproduce without a database, provider call, account or private worksheet:

```sh
backend/.venv/bin/python scripts/report_activity_program_gaps.py
backend/.venv/bin/python scripts/report_activity_program_gaps.py --check
```

The report binds to the SHA-256 of the supplied catalog, legacy coverage map, and the inspected component/runtime source files. `--check` becomes stale when those inputs change; the selectors and descriptions then need review. It does not alter these inputs or read the family database. The source catalog, legacy map and live runtime remain unchanged by this task.

## Actual constraints in the current engine

Line references below identify current functions, not proposed v2 behavior. No current restriction is removed in this foundation PR.

| Concern | Actual enforcement | Reuse or replace in future integration |
| --- | --- | --- |
| Three to six scenes and one final phase | [`ActivitySpec.scenes`](../backend/activities/models.py#L515); [`ActivitySpec.verify_general`](../backend/activities/models.py#L599) requires every preceding scene to be guided and the final scene independent. `SceneBase` declares `phase` and `nextSceneId`. | Preserve schema 1.0–1.3 parsing for old definitions. New `ActivityProgram` cannot be forced through this scene model. |
| Linear traversal | [`ActivitySpec.verify`](../backend/activities/models.py#L533), `verify_general` compare `nextSceneId` to the next list item. [`service.advance`](../backend/activities/service.py#L517) increments `current_scene`. | Replace traversal for new program versions; retain the legacy player/runtime for historical sessions. |
| Generator's fixed shape | [`COMPOSE_INSTRUCTION`](../backend/activities/general.py#L107) requires 2–5 guided scenes and one fresh independent challenge. Scene repair preserves `id`, `phase`, `nextSceneId` in [`compose`](../backend/activities/general.py#L638). | Reuse provider transport, bounded calls, private repair data and content-free diagnostic patterns. Replace the generated contract and review instructions for programs. |
| Universal check/submit/next UI | [`SceneStep`](../components/activity-player.tsx#L24) uses one form, `submit/hint/next`, Check it/Save my answer/Next, and disables the scene after submission. `perform` posts those actions. | Existing visual controls can be adapted. Replace the orchestration shell for persistent spaces and domain actions; it cannot remain the universal interaction grammar. |
| Scene snapshots rather than action streams | [`service.submit`](../backend/activities/service.py#L476) stores a response only on submit. [`006_activities.sql`](../backend/migrations/006_activities.sql) stores attempts and events limited to `next`/`hint`. | Reuse transactional ownership/idempotency patterns. Add versioned action/event persistence later; do not reinterpret old submissions as complete interaction histories. |
| Compatibility tied to the legacy map | [`capabilities.mechanics_for` and `validate_activity`](../backend/activities/capabilities.py#L14) use per-ID `mechanics` and `requiredGuidedMechanics`; [`families.validate_coverage`](../backend/activities/families.py#L429) imposes response/material/mode requirements. | Preserve catalog demonstrations and safety/assessment requirements. Replace family/component allowlists with capability and learning-requirement matching for programs. |
| Limited cross-scene connections | [`composition.validate_connections`](../backend/activities/composition.py#L328) permits earlier guided sources only. [`resolve_scene`](../backend/activities/composition.py#L406) copies saved source response into a later scene; independent input links are prohibited. | Reuse exact state transforms as trusted operations where appropriate. New shared state and relationships replace the later-scene copy model. |
| Exact bounded automatic grading | [`service._grade`](../backend/activities/service.py#L432), [`families.grade_response`](../backend/activities/families.py#L490), [`composition.grade_area_response`](../backend/activities/composition.py#L281) check submitted states. Area and numeric ordering keys can be derived; semantic ordering/evidence keys need review. | Reuse or extract pure numeric/structural checkers. Declare what each checker proves; a numeric predicate cannot certify a narrative, pronunciation, causal claim, or conceptual understanding. |
| Completion equated to final submission | [`service.submit`](../backend/activities/service.py#L499) completes on an independent response even when incorrect or pending parent review. `_result` selects the independent attempt; [`assessment.result_details`](../backend/activities/assessment.py#L28) selects `spec.scenes[-1]`. | Keep existing records honest. Separate stable mission finish, assistance and evidence outcome in the new contract; no universal final question. |
| Help after an attempted guided response | [`service.hint`](../backend/activities/service.py#L505) rejects before a response and in the independent phase; updates `hint_used` and a `hint` event. | Preserve assistance accounting, but replace phase-specific availability with declared help policy. Help may explain or demonstrate without mutating objective, rules, criteria or the child's artifact. |
| Immutable definitions and resume | [`service.start`](../backend/activities/service.py#L308) resumes existing sessions, saves a canonical `spec_sha256` and version; `_owned` reloads the same specification. `activity_versions` and `activity_sessions` separate definition from owner/session state. | Reuse the immutable-definition, hash/version, idempotency and reauthorization approach. Add program-specific state/events through an explicit migration in a later task. |
| Protected parent artifact assessment | [`assessment.review`](../backend/activities/assessment.py#L45) owns/PIN-authorizes the child, records append-only reviews, and only changes pending/reviewed independent attempts. [`parent_attempt`](../backend/activities/service.py#L546) returns exact saved materials and every submitted response. | Reuse parent authorization, pending/null semantics, version-bound artifacts and review audit patterns. New evidence must not be restricted to the last scene. |
| Voice/drawing are actual private artifacts | [`OralControl`](../components/activity-media-controls.tsx#L21) captures audio; `DrawingControl` captures strokes. [`save_recording`](../backend/activities/assessment.py#L100) and `recording_response` enforce scene/session/profile ownership and bounded private media. | Reuse private storage and capture. Do not invent speech-to-text, automated oral fluency, handwriting or general drawing correctness. |
| Activity outcomes do not update learner observations | [`_homework_state`](../backend/gap/service.py#L51) reads only `learning_evidence.source='homework'`; [`reduce_state`](../backend/gap/reducer.py#L12) ignores other sources. Activities `submit/review` do not call the observation reducer. | Preserve current semantics in this PR. Future activity evidence needs its own versioned projection, provenance, assistance policy and migration, not accidental insertion as uploaded-work evidence. |
| Account/private boundaries | [`authorize`](../backend/gap/service.py#L31), [`SecurityContext`](../backend/accounts/security.py#L54), `require_parent`, and current API wrappers recheck active mode and ownership. | Reuse these boundaries. Program JSON must not grant authority, name another child, select a file path, or override the authenticated session. |

Existing tests already defend these behaviors: [`test_activities.py`](../backend/tests/test_activities.py), [`test_activity_composition_recovery.py`](../backend/tests/test_activity_composition_recovery.py), [`test_catalog_activity_flow.py`](../backend/tests/test_catalog_activity_flow.py), and the corresponding browser journeys. A v2 migration must keep them as historical compatibility/security regressions instead of silently rewriting their definitions.

## Existing controls as tools

These are implemented **legacy semantic operations**, not claims that a v2 adapter or new program renderer exists. The isolated registry initially describes a subset; adapting other legacy tools is separate work. A capability version must specify accepted state, events, constraints and assessment semantics before the composer can use it.

| Existing tool | Semantic input → output and visible action | Constraints/materials and assessable evidence |
| --- | --- | --- |
| `quantity_lab` | Stock, rational unit value, named container allocations → changed allocations and conserved total. Move pieces in/out. | At most 120 pieces and 12 containers today; exact reachable allocation/group arithmetic can be checked. Unit/whole meaning and task alignment still need review. |
| `bundle_builder` | Loose objects → packed tens and residual ones. Pack/unpack exactly ten. | 10–60 objects, group size ten. Supports complete-tens conservation, not arbitrary regrouping or every place-value skill by itself. |
| `math_workspace` | Board geometry, scale, objects/marks or expression text → changed measured/plotted/constructed state. | Existing modes include ruler, clock, angle, balance, vessel, chart and equation. Bounds and exact arithmetic are checked; geometry names or a freehand artifact are not automatic proofs of a construction. |
| Area workspace modes | Rectangle sides/stock → unit-cell coverage or changed rectangle → expression using that actual rectangle. | Rectangular equal-unit geometry only, sides 1–12 and at most 120 tiles. Multiple valid design factor pairs are checked; supports area multiplication, not general region decomposition or 3D volume packing. |
| `fraction_split_compare` | One proper fraction and allowed equal split factors → refined numerator/denominator while shaded amount stays fixed. | Bounded whole/denominators/factors. A general fraction/multiple-whole operation needs explicit unit identity; add-to-both arithmetic is not equivalence. |
| `sort_connect` | Identified pieces and destination/category identities → placements/connections. | One placement per piece, finite meaningful relationships. A key may be objective, but category meaning and learning alignment still need review. |
| `tile_order` | Identified numerical/story/sentence tiles → permutation and rebuilt sequence. | 2–6 distinct scrambled tiles currently. Numeric order is computable; story causality/grammar must be reviewed and may support multiple valid constructions in a future operation. |
| `evidence_board` | Complete original passage and conclusion → one selected literal sentence. | 2–8 sentences currently. Offered IDs are checkable; semantic support is independently reviewed. Multiple spans/claims/sources are not implemented by this single-selection key. |
| `text_editor` | Draft/word material or blank artifact → authored text/revision. | Actual writing changes state. Case-sensitive objective edits may be automatic; open composition, explanations and dynamic child-draft revisions require a parent rubric. Word count alone does not establish quality or understanding. |
| `oral_studio` | Printed or audible material → an owned actual recording. | Parent-reviewed performance; actual playback/capture, no automatic transcript or pronunciation output port. Keep recording identity/private access separate from public definitions. |
| `drawing_studio` | Board and prompts → actual bounded strokes. | Parent-reviewed visual artifact. A stroke's existence cannot prove letter formation, symmetry, congruence or conceptual correctness. |
| Legacy fraction/number-line and plural controls | Fixed equal parts/ticks or plural letter/word pieces → selected parts/tick or constructed/chosen plural. | Retained schema-1.0 histories have narrow proper-fraction/plural constraints. Reusing a visual or deterministic helper does not remove those contracts or make the old player a v2 runtime. |

The new capability registry must follow typed inputs/outputs and learning requirements, rather than preserving a permanent map from a skill to any row of this table. The same quantity, board, text, ordering or evidence capability can support several objectives and student needs. A program may bind multiple representations to the same typed world object; a future trusted adapter should publish accepted actions and render the resulting canonical state instead of privately maintaining an unrelated answer.

## Candidate reusable operation extensions

Counts overlap. These are **review candidates**, not missing-game counts and not promises that every tagged subskill requires the proposed extension. Automatic semantic assessment is intentionally not fabricated.

| Candidate operation | Catalog rows flagged | Why inspect/extend it |
| --- | ---: | --- |
| `place_value_exchange` | 24 | General value-preserving exchange across named places/units, beyond packing one group of ten. |
| `editable_calculation_steps` | 10 | Inspectable intermediate steps and revisions, including carry/regroup relationships. |
| `general_fraction_units` | 37 | Explicit whole/unit identity, broader partitions, mixed quantities and linked representations. |
| `compose_measure_regions_and_solids` | 7 | Region decomposition and unit-cube packing beyond one rectangle. |
| `transform_geometric_objects` | 35 | Construction, reflection, rotation and shape composition with typed spatial relationships. |
| `typed_measurement_units` | 54 | Shared dimensioned quantities and valid conversions, rather than labels alone. |
| `editable_dataset_linked_representation` | 16 | Actual dataset edits reflected in graphs/tables/derived summaries. |
| `sound_print_segmentation` | 32 | Stable sound/grapheme segment identities and actual spoken production. |
| `annotated_audio_performance` | 47 | Reviewable timing/accuracy/self-correction evidence on real recordings. |
| `multi_span_evidence_connections` | 104 | Multiple evidence spans, claims, annotations and text-version relationships. |
| `source_linked_notes` | 17 | Source-aware notes, paraphrases and citations. |
| `revision_artifact_lineage` | 103 | Draft versions and meaningful revisions inside a persistent experience. |
| `structured_language_pieces` | 132 | Identified language pieces and alternative valid constructions, beyond one exact text key. |
| `observed_participation_evidence` | 25 | Concrete parent-witnessed physical/shared participation, kept distinct from on-screen correctness. |

Examples of candidate needs include `3.NBT.A.2-2` (regrouping across zeros), `5.MD.C.5-3` (composed prism volume), `4.G.A.3-2` (constructing symmetry), `RF.1.3-2` (actual decoding), and `W.4.8-1` (source-linked notes). These references illustrate reusable operations, not prescribed future games. See per-ID records, selection reason codes and operation source references in the JSON inventory for the complete scope.

## Platform work is separate

All new programs still need future trusted shared-world adapters; ordered action/assistance events; atomic bounded rules and replay; branching/finish handling; immutable artifact-assessment bindings; a versioned activity-evidence reducer; and evidence-aware next-intent selection. These are listed separately in `universalMigrationGaps` and must not be hidden in per-skill availability counts.

The current learning reducer intentionally preserves one eligible wrong uploaded answer as a support observation and awards no mastery. Changing that policy is a product/reducer migration, not a side effect of accepting a v2 schema. A future activity can finish with help, finish with unresolved conceptual evidence, or finish with an artifact awaiting parent assessment. None of those states alone certifies mastery.
