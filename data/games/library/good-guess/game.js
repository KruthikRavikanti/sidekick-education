// Good Guess. Skill 2.MD.A.3-2.
// Estimating lengths in inches, feet, centimeters and meters: each object is matched to a sensible length. Estimates with the right number but a far-off unit are the known slip.
Sidekick.game(Sidekick.play({
  title: "Good Guess",
  emoji: "🧐",
  premise: "A good estimate sounds right when you picture it. Give each thing the length that makes sense.",
  outro: "Picture the unit, then picture the thing. A good estimate fits both.",
  scene: "paper",
  kind: "fill",
  cast: "",
  hint: "Picture the unit first. Would that many fit along the thing?",
  tag: "unreasonable_estimate",
  rounds: [
    { say: "Drag the estimate that makes sense.", rows: [["A new pencil is about", "7 inches"], ["A door is about as tall as", "7 feet"]], extra: "70 feet|", trap: [0, "7 feet"], why: "7 feet is as tall as a door. A pencil is about 7 inches.", win: "A pencil is 7 inches. A door is 7 feet." },
    { say: "Three more estimates.", rows: [["A crayon is about", "9 centimeters"], ["A car is about as long as", "4 meters"], ["A spoon is about", "6 inches"]], extra: "9 meters|", trap: [0, "9 meters"], why: "9 meters is longer than a classroom. A crayon is about 9 centimeters.", win: "Those estimates make sense." },
    { say: "Estimate these by yourself.", rows: [["A toothbrush is about", "7 inches"], ["A bed is about as long as", "2 meters"], ["A finger is about as wide as", "1 centimeter"]], extra: "7 feet|2 centimeters", trap: [0, "7 feet"] },
  ],
}));
