// Angle Maker. Skill 4.MD.C.6-2.
// Sketching angles of a given measure: the arm is opened against a protractor with no number readout. Using the other scale is the known slip.
Sidekick.game(Sidekick.play({
  title: "Angle Maker",
  emoji: "🦾",
  premise: "Swing the arm open until it points at the right mark on the protractor. No number will help you, so read the marks.",
  outro: "To draw an angle, keep one ray on zero and swing the other to the right mark.",
  scene: "desk",
  kind: "dial",
  cast: "",
  blind: true,
  hint: "One ray stays on 0. Swing the other ray up to the mark you need.",
  tag: "reads_the_other_scale",
  rounds: [
    { say: "Open the arm to 60 degrees.", dials: [["Open or close", 0, 180, 10]], view: { type: "angle", protractor: true, twoScales: true }, ans: [60], trap: [120], why: "60 degrees is narrower than a square corner. Use the numbers that start at 0 on the flat ray.", win: "That is a 60 degree angle." },
    { say: "Open the arm to 45 degrees. It sits between two marks.", dials: [["Open or close", 0, 180, 5, 20]], view: { type: "angle", protractor: true, twoScales: true }, ans: [45], trap: [135], why: "45 degrees is narrower than a square corner.", win: "Halfway between 40 and 50." },
    { say: "Make the angle by yourself.", alt: [{ say: "Open the arm to 130 degrees by yourself.", dials: [["Open or close", 0, 180, 10, 90]], view: { type: "angle", protractor: true, twoScales: true }, ans: [130], trap: [50] }, { say: "Open the arm to 150 degrees by yourself.", dials: [["Open or close", 0, 180, 10, 90]], view: { type: "angle", protractor: true, twoScales: true }, ans: [150], trap: [30] }] },
  ],
}));
