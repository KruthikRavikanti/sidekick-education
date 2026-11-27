// Show It Happening. Skill W.9-10.3-2.
// Using narrative techniques such as dialogue, pacing, description and reflection to develop experiences and characters. Summarizing instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Show It Happening",
  emoji: "🎬",
  premise: "Summary says a thing happened. Narrative technique lets the reader live through it: voices, speed, detail, thought.",
  outro: "Develop events with dialogue, pacing, description and reflection.",
  scene: "night",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "Is someone speaking, is time speeding up, is the scene pictured, or is the narrator thinking back?",
  tag: "summarizes_instead",
  rounds: [
    { say: "Match each technique to the line that uses it.", rows: [["dialogue", "“You kept it?” she whispered."], ["description", "Rust had eaten the hinges to lace."], ["reflection", "Only later did I see what that cost him."]], extra: "They talked and then left.|", trap: [0, "They talked and then left."], why: "That sums up a talk without letting us hear it.", win: "Voice, picture, thought." },
    { say: "Match each technique.", rows: [["fast pacing", "Door. Stairs. Street. Gone."], ["slow pacing", "The coin turned once, twice, hung in the light."], ["dialogue", "“Run,” he said. “Now.”"]], extra: "Some time went by.|", trap: [1, "Some time went by."], why: "That skips the moment. Slow pacing stretches one instant out.", win: "Speed is a choice." },
    { say: "Match these by yourself.", rows: [["description", "Frost feathered the inside of the window."], ["reflection", "I think I knew, even then, that we would not return."], ["dialogue", "“Whose coat is this?” Mom asked."]], extra: "It was cold and we left.|", trap: [1, "It was cold and we left."] },
  ],
}));
