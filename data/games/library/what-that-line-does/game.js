// What That Line Does. Skill RL.8.3-1.
// Analyzing how particular lines of dialogue or incidents propel the action, reveal character or provoke a decision. Summarizing the dialogue is the known slip.
Sidekick.game(Sidekick.play({
  title: "What That Line Does",
  emoji: "💬",
  premise: "A single line of dialogue or one small incident can do real work: push the plot, reveal who someone is, or force a choice.",
  outro: "Analyze whether a line propels the action, reveals character or provokes a decision.",
  scene: "city",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "After this line, what changes? Or what do we learn about the speaker?",
  tag: "summarizes_dialogue",
  rounds: [
    { say: "What does each line do in its story?", rows: [["“The bridge is out. We go through the mine or not at all.”", "forces a decision"], ["“I counted the coins twice so nobody would be short.”", "reveals character"]], extra: "describes the weather|", trap: [0, "reveals character"], why: "It lays out two choices. Someone now has to decide.", win: "One forces a choice. One shows who she is." },
    { say: "What does each one do?", rows: [["The letter arrives a day too late.", "pushes the plot forward"], ["“I never said thank you. I should have.”", "reveals character"]], extra: "ends the story|", trap: [1, "pushes the plot forward"], why: "Nothing happens because of it. It shows regret.", win: "An incident moves things. A line reveals." },
    { say: "Match these by yourself.", rows: [["“If you tell them, I lose everything.”", "forces a decision"], ["The power fails in the middle of the vote.", "pushes the plot forward"]], extra: "reveals the setting|adds humor", trap: [0, "adds humor"] },
  ],
}));
