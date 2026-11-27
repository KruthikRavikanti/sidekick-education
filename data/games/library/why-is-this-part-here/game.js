// Why Is This Part Here?. Skill RL.5.5-1.
// Explaining how a series of chapters, scenes or stanzas fits together to provide the overall structure. Not being able to explain why a part is there is the known slip.
Sidekick.game(Sidekick.play({
  title: "Why Is This Part Here?",
  emoji: "🧩",
  premise: "Every chapter, scene or stanza has a job in the whole. Some set things up, some build tension, some resolve.",
  outro: "Each part of a text contributes to its overall structure.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "What would the story lose without this part?",
  tag: "cannot_explain_part",
  rounds: [
    { say: "Which chapter does each job in the story?", rows: [["sets up the problem", "Ch 1: Ana fears water."], ["the high point", "Ch 5: She must cross a river."], ["shows the change", "Ch 8: She teaches swimming."]], trap: [0, "Ch 8: She teaches swimming."], why: "That comes at the end, after she has changed. Which chapter sets things up?", win: "Set up, high point, change." },
    { say: "Which stanza does each job in the poem?", rows: [["sets the scene", "Stanza 1: a calm morning sea"], ["creates tension", "Stanza 2: dark clouds and wind"], ["brings a close", "Stanza 3: calm returns at dusk"]], trap: [0, "Stanza 2: dark clouds and wind"], why: "Clouds and wind bring trouble. The scene is set before that.", win: "Scene, tension, close." },
    { say: "Which scene does each job in the play? Match by yourself.", rows: [["sets up the plan", "Scene 1: friends plan a party"], ["complicates it", "Scene 2: everything goes amiss"], ["resolves it", "Scene 3: it works out after all"]], trap: [2, "Scene 1: friends plan a party"] },
  ],
}));
