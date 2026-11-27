// Braid the Story. Skill W.11-12.3-2.
// Using narrative techniques such as dialogue, pacing, description, reflection and multiple plot lines. Summarizing instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Braid the Story",
  emoji: "🧵",
  premise: "Advanced narratives weave techniques together: talk, speed, thought, and more than one storyline running at once.",
  outro: "Use dialogue, pacing, description, reflection and multiple plot lines to develop events and characters.",
  scene: "night",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "Is it speech, a change of speed, a thought about the past, or a cut to another storyline?",
  tag: "summarizes_instead",
  rounds: [
    { say: "Match each technique to the line that uses it.", rows: [["dialogue", "“Who told you?” she asked."], ["reflection", "I see now that she was protecting me."], ["second plot line", "Meanwhile, across town, the letter was being opened."]], extra: "Things happened that week.|", trap: [2, "Things happened that week."], why: "That sums up without showing. Meanwhile cuts to another storyline.", win: "Voice, thought, parallel story." },
    { say: "Match each technique.", rows: [["fast pacing", "Keys. Coat. Stairs. The train."], ["description", "Salt had bleached the dock boards gray."], ["second plot line", "Back at the farm, her brother lit the stove."]], extra: "She went somewhere.|", trap: [0, "She went somewhere."], why: "That tells us nothing we can feel. Fragments make the rush felt.", win: "Speed, picture, parallel story." },
    { say: "Match these by yourself.", rows: [["dialogue", "“Not tonight,” he said."], ["slow pacing", "The match flared, steadied, and bent toward the wick."], ["reflection", "Years on, I still hear that door."]], extra: "Then some time passed.|", trap: [1, "Then some time passed."] },
  ],
}));
