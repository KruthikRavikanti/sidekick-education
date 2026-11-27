// Match the Top Bar. Skill 3.NF.A.3-2.
// Generating equivalent fractions with a model: the child shades a second bar until it matches the first. Adding the same number to top and bottom is the known slip.
Sidekick.game(Sidekick.play({
  title: "Match the Top Bar",
  emoji: "🧱",
  premise: "The top bar shows a fraction. The bottom bar is cut into more pieces. Shade it until both bars cover the same amount.",
  outro: "Equivalent fractions cover the same amount with a different number of pieces.",
  scene: "desk",
  kind: "dial",
  cast: "",
  dials: [["Parts shaded", 0, 8]],
  hint: "Shade until the orange part ends exactly where the blue part ends.",
  tag: "adds_same_to_top_and_bottom",
  rounds: [
    { say: "The top bar shows {1/2}. Shade fourths until the bars match.", view: { type: "frac", ref: [1, 2], den: 4 }, ans: [2], trap: [3], why: "Three fourths is longer than one half. Line up the ends.", win: "One half is two fourths." },
    { say: "The top bar shows {1/3}. Shade sixths until the bars match.", view: { type: "frac", ref: [1, 3], den: 6 }, ans: [2], trap: [4], why: "Four sixths is longer than one third. Line up the ends.", win: "One third is two sixths." },
    { say: "Match the bars by yourself.", alt: [{ say: "The top bar shows {3/4}. Shade eighths until the bars match.", view: { type: "frac", ref: [3, 4], den: 8 }, ans: [6], trap: [7] }, { say: "The top bar shows {1/2}. Shade sixths until the bars match.", view: { type: "frac", ref: [1, 2], den: 6 }, ans: [3], trap: [5] }] },
  ],
}));
