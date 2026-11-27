// Poem, Play or Prose. Skill RL.4.5-1.
// Explaining major differences between poems, drama and prose. Not knowing structural elements such as verse, stage directions and cast is the known slip.
Sidekick.game(Sidekick.play({
  title: "Poem, Play or Prose",
  emoji: "🎭",
  premise: "Poems, plays and stories are built differently. Each has its own parts.",
  outro: "Poems have verses and rhythm. Plays have a cast and stage directions. Prose has paragraphs.",
  scene: "candy",
  kind: "sort",
  hint: "Which kind of writing has that part?",
  tag: "cannot_name_parts",
  rounds: [
    { say: "Which kind of writing has each feature?", bins: "Poem|Play|Prose", items: ["verses|rhythm and meter", "stage directions|a cast of characters", "paragraphs|chapters"], trap: ["stage directions", 2], why: "Stage directions tell actors what to do. They belong to a play.", win: "Three forms, three sets of parts." },
    { say: "Sort these features.", bins: "Poem|Play|Prose", items: ["stanzas|line breaks", "dialogue with speaker names|acts and scenes", "a narrator telling in sentences|"], trap: ["acts and scenes", 2], why: "Acts and scenes divide a play.", win: "You know the forms." },
    { say: "Sort these by yourself.", bins: "Poem|Play|Prose", items: ["rhyme scheme|", "[Enter KING, angry]|a setting described for the stage", "a short story|a novel"], trap: ["[Enter KING, angry]", 2] },
  ],
}));
