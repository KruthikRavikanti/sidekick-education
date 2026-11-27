// Fraction Line Plot. Skill 3.MD.B.4-2.
// Showing fractional measurements on a line plot: the scale is ordered correctly and each measurement gets one mark. Misordering the fractions, or one mark per value, are the known slips.
Sidekick.game(Sidekick.play({
  title: "Fraction Line Plot",
  emoji: "📌",
  premise: "Lengths with halves and quarters go on a line plot too. First put the lengths in order, then stack the marks.",
  outro: "A line plot puts lengths in order and stacks one X for each thing measured.",
  scene: "paper",
  kind: "row",
  cast: "",
  hint: "One fourth is less than one half, and one half is less than three fourths.",
  tag: "fractions_out_of_order",
  tag2: "one_mark_per_value",
  rounds: [
    { say: "A line plot needs its numbers in order. Line up the lengths from shortest to longest.", seq: "{1/4} {1/2} {3/4} 1", trap: "{1/2} {1/4} {3/4} 1", why: "One fourth is smaller than one half. It comes first.", win: "One fourth, one half, three fourths, one." },
    { say: "Now build the line plot. Each length gets one X.", kind: "dial", q: "Lengths in inches: 1/2, 3/4, 1/2, 1/4, 1/2", dials: [["1/4 in", 0, 5], ["1/2 in", 0, 5], ["3/4 in", 0, 5]], view: { type: "bars", stack: true, cap: 5, tick: 1 }, ans: [1, 3, 1], trap: [1, 1, 1], why: "Three of the lengths are one half inch. Each one gets its own X.", win: "One, three and one." },
    { say: "Build this line plot by yourself.", kind: "dial", dials: [["1/4 in", 0, 5], ["1/2 in", 0, 5], ["3/4 in", 0, 5]], view: { type: "bars", stack: true, cap: 5, tick: 1 }, alt: [{ q: "Lengths in inches: 3/4, 1/4, 3/4, 3/4, 1/2, 1/4", ans: [2, 1, 3], trap: [1, 1, 1] }, { q: "Lengths in inches: 1/2, 1/2, 1/4, 3/4, 1/2, 1/2", ans: [1, 4, 1], trap: [1, 1, 1] }] },
  ],
}));
