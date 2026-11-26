// Close Enough Clips. Skill 2.MD.D.9-1.
// Measuring to the nearest unit: the object ends between marks, and the child picks the closer whole number. Always rounding one way is the known slip.
Sidekick.game(Sidekick.play({
  title: "Close Enough Clips",
  emoji: "🧷",
  premise: "Things do not always end right on a mark. Measure each one to the nearest whole unit.",
  outro: "To the nearest unit means the mark the end is closest to.",
  scene: "desk",
  kind: "dial",
  cast: "",
  dials: [["Units", 0, 10]],
  hint: "Look at where the end is. Which whole unit is it closest to?",
  tag: "rounds_the_other_way",
  rounds: [
    { say: "Measure the crayon to the nearest unit.", view: { type: "units", len: 3.2, icon: "🖍️" }, ans: [3], trap: [4], why: "The crayon ends just past 3. It is much closer to 3 than to 4.", win: "About 3 units." },
    { say: "Measure the brush to the nearest unit.", view: { type: "units", len: 4.8, icon: "🖌️" }, ans: [5], trap: [4], why: "The end is almost at 5. It is closer to 5.", win: "About 5 units." },
    { say: "Measure to the nearest unit by yourself.", alt: [{ view: { type: "units", len: 6.8, icon: "🥄" }, ans: [7], trap: [6] }, { view: { type: "units", len: 5.2, icon: "🔧" }, ans: [5], trap: [6] }] },
  ],
}));
