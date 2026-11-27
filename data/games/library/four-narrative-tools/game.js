// Four Narrative Tools. Skill W.8.3-2.
// Using narrative techniques such as dialogue, pacing, description and reflection. Summarizing instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Four Narrative Tools",
  emoji: "🧰",
  premise: "Dialogue, pacing and description build a scene. Reflection adds the narrator’s thoughts about what it meant.",
  outro: "Use dialogue, pacing, description and reflection to develop experiences and characters.",
  scene: "forest",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "Speech, a word picture, a change in speed, or a thought about meaning?",
  tag: "summarizes",
  rounds: [
    { say: "Which tool does each line use?", rows: [["“Leave it,” she said. “It is not ours.”", "dialogue"], ["The key was green with age and cold as a coin.", "description"], ["Only later did I see she had been protecting me.", "reflection"]], trap: [2, "description"], why: "The narrator is looking back and understanding. That is reflection.", win: "Speech, picture, meaning." },
    { say: "Which tool does each line use?", rows: [["A year went by without a single letter.", "pacing"], ["I had thought courage was loud. It was not.", "reflection"], ["“Who told you?” he whispered.", "dialogue"]], trap: [0, "reflection"], why: "A whole year passes in one sentence. That is pacing.", win: "Time, meaning, speech." },
    { say: "Match these by yourself.", rows: [["Smoke curled from the chimney like a question mark.", "description"], ["Looking back, I know that was the day I grew up.", "reflection"], ["In the space of a breath, the bridge was gone.", "pacing"]], extra: "dialogue", trap: [1, "dialogue"] },
  ],
}));
