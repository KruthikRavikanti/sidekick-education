// Protractor Reader. Skill 4.MD.C.6-1.
// Measuring angles with a protractor that shows two scales. Reading the other scale (120 for 60) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Protractor Reader",
  emoji: "📐",
  premise: "A protractor has two rows of numbers. Decide first if the angle is smaller or bigger than a square corner, then pick the number that fits.",
  outro: "Check whether the angle is acute or obtuse, then read the scale that matches.",
  scene: "paper",
  kind: "type",
  hint: "Is the angle narrower or wider than a square corner? Pick the number that makes sense.",
  tag: "reads_the_other_scale",
  rounds: [
    { say: "Read the protractor. Key in the size of the angle.", fig: { type: "angle", protractor: true, twoScales: true, v: [60] }, ans: 60, trap: 120, why: "This angle is narrower than a square corner, so it is less than 90.", win: "The angle is 60 degrees." },
    { say: "Read this angle.", fig: { type: "angle", protractor: true, twoScales: true, v: [130] }, ans: 130, trap: 50, why: "This angle is wider than a square corner, so it is more than 90.", win: "The angle is 130 degrees." },
    { say: "Read the angle by yourself.", alt: [{ fig: { type: "angle", protractor: true, twoScales: true, v: [40] }, ans: 40, trap: 140 }, { fig: { type: "angle", protractor: true, twoScales: true, v: [150] }, ans: 150, trap: 30 }, { fig: { type: "angle", protractor: true, twoScales: true, v: [110] }, ans: 110, trap: 70 }] },
  ],
}));
