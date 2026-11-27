// Both Sides Balance. Skill 1.OA.D.7-3.
// Reading equations with operations on both sides (4 + 5 = ▢ + 3): the box is not the total. A balance tips until the box makes the sides equal.
Sidekick.game(Sidekick.play({
  title: "Both Sides Balance",
  emoji: "🎚️",
  premise: "There is adding on both sides of this balance. Set the box so the two sides weigh the same.",
  outro: "A number sentence can have adding on both sides. Both sides still have to match.",
  scene: "desk",
  kind: "dial",
  cast: "",
  hint: "Work out the left side. The box plus the other number must match it.",
  tag: "box_is_the_total",
  dials: [["▢", 0, 14]],
  rounds: [
    { say: "Set the box so both sides are the same amount.", view: { type: "balance", eq: [0, 9, 1, 3], left: "4 + 5", x: "▢" }, ans: [6], trap: [9], why: "The box is not the total. The box plus 3 must be the same as 4 + 5.", win: "4 + 5 = 6 + 3." },
    { say: "Balance this one.", view: { type: "balance", eq: [0, 8, 1, 5], left: "6 + 2", x: "▢" }, ans: [3], trap: [8], why: "The box plus 5 must be the same as 6 + 2.", win: "6 + 2 = 3 + 5." },
    { say: "Balance it by yourself.", alt: [{ view: { type: "balance", eq: [0, 11, 1, 4], left: "7 + 4", x: "▢" }, ans: [7], trap: [11] }, { view: { type: "balance", eq: [0, 12, 1, 2], left: "5 + 7", x: "▢" }, ans: [10], trap: [12] }, { view: { type: "balance", eq: [0, 9, 1, 1], left: "3 + 6", x: "▢" }, ans: [8], trap: [9] }] },
  ],
}));
