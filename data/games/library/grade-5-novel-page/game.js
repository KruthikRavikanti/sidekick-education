// Grade 5 Novel Page. Skill RL.5.10-1.
// Reading and comprehending literature at the high end of the grades 4-5 band independently. Needing support is the known slip.
Sidekick.game(Sidekick.play({
  title: "Grade 5 Novel Page",
  emoji: "📗",
  premise: "Read a rich passage on your own. Notice what the character wants, what stands in the way, and what the mood is.",
  outro: "In complex fiction, track goals, obstacles and mood as you read.",
  scene: "forest",
  kind: "fill",
  cast: "",
  hint: "Go back to the passage for each answer.",
  tag: "needs_support",
  rounds: [
    { say: "Read the passage. Answer each question.", read: "The compass needle spun uselessly. Somewhere beyond the fog lay the harbor, and with it her father’s ship. Iris gripped the oars. She had rowed this bay a hundred times, but never blind.", rows: [["Goal", "reach the harbor"], ["Obstacle", "thick fog"], ["Mood", "tense"]], extra: "cheerful|", trap: [2, "cheerful"], why: "A useless compass and rowing blind do not feel cheerful.", win: "Goal, obstacle and mood." },
    { say: "Read this passage. Answer each question.", read: "Every desk in Room 12 had a name carved under it. Marcus ran his thumb over his grandfather’s, then his mother’s. Tomorrow the old school would be torn down.", rows: [["What Marcus is doing", "saying goodbye"], ["Mood", "wistful"]], extra: "angry|", trap: [1, "angry"], why: "He is gently touching the names. The feeling is quiet and sad.", win: "A quiet farewell." },
    { say: "Read and answer by yourself.", read: "The letter had no stamp and no name, only a map with one red X. Sofia folded it into her pocket before anyone could see.", rows: [["What Sofia has", "a secret map"], ["Mood", "mysterious"]], extra: "silly|a birthday card", trap: [1, "silly"] },
  ],
}));
