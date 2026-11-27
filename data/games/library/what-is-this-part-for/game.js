// What Is This Part For?. Skill RL.6.5-1.
// Analyzing how a particular sentence, chapter, scene or stanza fits the overall structure. Describing the part without its role is the known slip.
Sidekick.game(Sidekick.play({
  title: "What Is This Part For?",
  emoji: "🧱",
  premise: "Every sentence, scene and stanza has a job in the whole. Ask what the story would lose without it.",
  outro: "Explain the role a part plays: setting the scene, building the problem, turning the plot or resolving it.",
  scene: "ocean",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "Not what it says. What does it DO for the story?",
  tag: "part_without_role",
  rounds: [
    { say: "What job does each sentence do?", read: "(1) The lighthouse had been dark for years. (2) One night its lamp flickered on. (3) Ana climbed the stairs and found her grandfather polishing the glass.", rows: [["sentence 1", "sets the scene"], ["sentence 2", "starts the mystery"], ["sentence 3", "solves the mystery"]], trap: [1, "sets the scene"], why: "The scene is already set. The lamp turning on creates a question.", win: "Scene, mystery, answer." },
    { say: "What job does each sentence do?", read: "(1) Everyone said the river could not be crossed. (2) Ibo tied three canoes side by side. (3) By noon the whole village stood on the far bank.", rows: [["sentence 1", "states the problem"], ["sentence 2", "shows the plan"], ["sentence 3", "gives the result"]], trap: [0, "gives the result"], why: "Nothing has happened yet. This sentence tells what stands in the way.", win: "Problem, plan, result." },
    { say: "Match these by yourself.", read: "(1) The team had lost every game that season. (2) A new goalie arrived from another town.", rows: [["sentence 1", "shows the trouble"], ["sentence 2", "brings a change"]], extra: "ends the story|describes the weather", trap: [1, "ends the story"] },
  ],
}));
