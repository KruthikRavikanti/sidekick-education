// Two Rulers. Skill 2.MD.A.2-1.
// Measuring the same object in two units: the object does not change, only the count of units. Expecting the same number in the smaller unit is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Rulers",
  emoji: "🪑",
  premise: "Measure one thing with long sticks, then again with short sticks. The thing stays the same, but the number changes.",
  outro: "The same length can have two different numbers when the units are different.",
  scene: "desk",
  kind: "dial",
  cast: "",
  dials: [["Sticks", 0, 12]],
  hint: "Lay the sticks end to end until they reach the other dotted line.",
  tag: "same_number_for_new_unit",
  rounds: [
    { say: "Measure the desk with long sticks.", view: { type: "units", len: 6, size: 2, icon: "🪑" }, ans: [3], trap: [2], why: "Part of the desk still has no stick under it.", win: "The desk is 3 long sticks." },
    { say: "Now measure the same desk with short sticks. A long stick is as long as 2 short ones.", view: { type: "units", len: 6, size: 1, icon: "🪑" }, ans: [6], trap: [3], why: "The desk did not change. Short sticks are smaller, so you need more of them.", win: "The same desk is 6 short sticks." },
    { say: "Measure with short sticks by yourself.", alt: [{ say: "This bed is 4 long sticks. Measure it with short sticks.", view: { type: "units", len: 8, size: 1, icon: "🛏️" }, ans: [8], trap: [4] }, { say: "This door is 5 long sticks. Measure it with short sticks.", view: { type: "units", len: 10, size: 1, icon: "🚪" }, ans: [10], trap: [5] }] },
  ],
}));
