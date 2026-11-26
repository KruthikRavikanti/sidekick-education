// Tens Come First. Skill 1.NBT.B.3-1.
// Comparing two-digit numbers by tens first: the child orders numbers least to greatest. Ordering by the ones digit gives the trap order.
Sidekick.game(Sidekick.play({
  title: "Tens Come First",
  emoji: "🥇",
  premise: "The runners wear two-digit numbers. Line them up from least to greatest by looking at the tens first.",
  outro: "To compare two-digit numbers, look at the tens first. Use the ones only if the tens tie.",
  scene: "field",
  kind: "row",
  cast: "🥇 🏃 🏃 🏃",
  hint: "Look at the tens digit first. More tens means a bigger number.",
  tag: "compares_ones_first",
  rounds: [
    { say: "Line up the numbers from least to greatest.", seq: "29 41 53", trap: "41 53 29", why: "Look at the tens first. 29 has only 2 tens.", win: "29, 41, 53." },
    { say: "Four runners now. Least to greatest.", seq: "38 46 61 72", trap: "61 72 46 38", why: "That order goes by the ones. Look at the tens first.", win: "38, 46, 61, 72." },
    { say: "Line these up by yourself.", alt: [{ seq: "19 34 52 70", trap: "70 52 34 19" }, { seq: "27 45 63 81", trap: "81 63 45 27" }, { seq: "48 56 71 93", trap: "71 93 56 48" }] },
  ],
}));
