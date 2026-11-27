// Cut It Smaller. Skill 4.NF.A.1-2.
// Explaining equivalence with a model: the same amount is shown with more, smaller parts. Thinking more pieces means more is the known slip.
Sidekick.game(Sidekick.play({
  title: "Cut It Smaller",
  emoji: "🧈",
  premise: "Cut every piece into smaller pieces and the fraction gets a new name, but the amount of butter has not changed.",
  outro: "Cutting each part into more parts changes the numbers, not the amount.",
  scene: "kitchen",
  kind: "dial",
  cast: "",
  dials: [["Parts shaded", 0, 12]],
  hint: "Shade until the orange part ends exactly where the blue part ends.",
  tag: "more_pieces_means_more",
  rounds: [
    { say: "The top bar shows {1/2}. Each half is cut into 3. Shade sixths to match.", view: { type: "frac", ref: [1, 2], den: 6 }, ans: [3], trap: [4], why: "Four sixths is more than one half. Line up the ends.", win: "One half is three sixths." },
    { say: "The top bar shows {2/3}. Each third is cut into 2. Shade sixths to match.", view: { type: "frac", ref: [2, 3], den: 6 }, ans: [4], trap: [5], why: "Five sixths is more than two thirds. Line up the ends.", win: "Two thirds is four sixths." },
    { say: "Match the bars by yourself.", alt: [{ say: "The top bar shows {3/4}. Shade twelfths to match.", view: { type: "frac", ref: [3, 4], den: 12 }, ans: [9], trap: [10] }, { say: "The top bar shows {2/5}. Shade tenths to match.", view: { type: "frac", ref: [2, 5], den: 10 }, ans: [4], trap: [7] }] },
  ],
}));
