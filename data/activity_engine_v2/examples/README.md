# ActivityProgram contract fixtures

These are original, explicitly authored Sidekick contract fixtures created for
this implementation task. Their observations, missions, passages and artifacts
are synthetic. They were not produced by Sidekick's live activity generator,
or played by a child. They can now be played through the opt-in development
preview at `/kid/activity-preview`; they do not replace regular V1 activities.
Passing the isolated validator establishes only the checks named in its report.

The examples are fixtures for an open composition contract, rather than a list
of approved games or a permanent skill-to-mechanic mapping.

| Program | Target | Student need and action | Mission finish | Assessment |
| --- | --- | --- | --- | --- |
| `observatory_floor.json` | `3.MD.C.7-1` | A hypothetical adds-the-sides observation motivates covering a fixed rectangle with actual unit tiles and constructing its multiplication expression. | The floor is covered and the expression represents its dimensions and area. | Objective construction checks; concept use still needs semantic review and child testing. |
| `habitat_designer.json` | `3.MD.C.7-1` | A hypothetical student can count units but needs to connect side lengths to area. The student changes dimensions under a fixed tile stock and constructs the corresponding expression. | Any supported factor-pair design using the stock, with its matching expression. | Several valid constructions, rather than a single prescribed rectangle. |
| `trail_evidence.json` | `RL.3.1-1` | A hypothetical unsupported-answer observation motivates investigating an original passage and placing literal evidence on a case board. | A chosen, predefined investigation route is resolved using its supporting sentence. | An explicit fixture key requiring semantic review; structural validation cannot establish that a passage uniquely supports a claim. |
| `story_studio.json` | `W.3.3-1` | A hypothetical missing-setup observation motivates creating and revising a story opening that establishes the situation and characters. | A real written draft is created and a changed revision is saved. | The artifact awaits parent assessment against a target-specific rubric; saving it does not mean the writing demonstrates the skill. |

The two Math programs target the same catalog demonstration through different
actions and different supported needs. They use persistent shared state; the ELA
investigation demonstrates a bounded choice between predefined mission routes.
The writing fixture separates finishing a mission from assessment of the saved
artifact. None requires a universal final quiz or guided/independent scene phases.

All rules, help and assessment criteria are fixed in the definition. Help may make
completion possible and must be recorded as assistance; it cannot change the
target or silently make the assessment easier. The examples do not update learner
state. That future boundary is specified in `docs/activity-engine-v2-spec.md`.

Semantic review and child testing have **not been performed** for these fixtures.
Their observation source categories describe hypothetical evidence snapshots,
not real uploads, children, parent reports, or private source identifiers.

The writing fixture uses one persistent editable artifact. Owned preview events
retain every accepted draft/revision and its resulting state privately; the
prior event or initial state supplies the previous text. The isolated witness
checks the same text-change condition through the shared Python core. Neither
the witness nor the preview inspects writing quality. V2 parent review UI and
learning-state integration remain future work.
