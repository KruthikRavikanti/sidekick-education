// Scene Builder Tools. Skill W.7.3-2.
// Using narrative techniques such as dialogue, pacing and description to develop experiences and characters. Summarizing instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Scene Builder Tools",
  emoji: "🧰",
  premise: "To develop a scene, writers let characters talk, paint what the senses notice, and slow down or skip time.",
  outro: "Dialogue reveals character, description builds the picture, pacing controls time.",
  scene: "forest",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "Is someone speaking? Is it a picture? Or is time stretching or jumping?",
  tag: "summarizes",
  rounds: [
    { say: "Which tool does each line use?", rows: [["“You promised,” Ada said, not looking up.", "dialogue"], ["Fog pressed against the windows like wet wool.", "description"], ["Two winters passed before he wrote back.", "pacing"]], trap: [2, "description"], why: "Two winters go by in one sentence. That is pacing.", win: "Talk, picture, time." },
    { say: "Which tool does each line use?", rows: [["“Is it locked?” “Try it and see.”", "dialogue"], ["The key was cold and pitted with rust.", "description"], ["For a heartbeat, the whole crowd held still.", "pacing"]], trap: [2, "dialogue"], why: "Nobody speaks. The line slows one moment right down.", win: "Three tools at work." },
    { say: "Match these by yourself.", rows: [["“Wait for me!” shouted Kofi.", "dialogue"], ["The market smelled of oranges and diesel.", "description"], ["By nightfall they had crossed the valley.", "pacing"]], extra: "summary|", trap: [2, "summary"] },
  ],
}));
