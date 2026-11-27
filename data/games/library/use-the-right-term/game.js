// Use the Right Term. Skill RL.4.5-2.
// Referring to the structural elements of poems and drama when writing or speaking about a text. Using the incorrect terms is the known slip.
Sidekick.game(Sidekick.play({
  title: "Use the Right Term",
  emoji: "🏷️",
  premise: "When you talk about a text, use the right word for its parts: stanza, verse, stage directions, scene, chapter.",
  outro: "Refer to a text with accurate structural terms.",
  scene: "paper",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Is the text a poem, a play or a story?",
  tag: "uses_incorrect_terms",
  rounds: [
    { say: "Drop in the right term.", rows: [["The second ___ of the poem describes the sea.", "stanza"], ["The ___ tell the actor to exit left.", "stage directions"]], extra: "chapter", trap: [0, "chapter"], why: "Poems are not divided into chapters. A group of lines is a stanza.", win: "Stanza and stage directions." },
    { say: "Drop in these terms.", rows: [["The play opens with a ___ in the forest.", "scene"], ["The ___ of characters lists six people.", "cast"], ["The poem has a steady ___, like a drum.", "rhythm"]], trap: [0, "cast"], why: "The cast is the list of characters. A part of the action is a scene.", win: "Scene, cast and rhythm." },
    { say: "Drop in the terms by yourself.", rows: [["Each ___ of the poem has four lines.", "stanza"], ["In the last ___ of the novel, they go home.", "chapter"], ["The ___ between the two actors is funny.", "dialogue"]], extra: "paragraph", trap: [0, "paragraph"] },
  ],
}));
