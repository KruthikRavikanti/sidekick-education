// Pattern Pairs. Skill 5.OA.B.3-2.
// Forming ordered pairs from corresponding terms of two patterns and graphing them. Mismatching the terms, or swapping the order in the pair, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Pattern Pairs",
  emoji: "🪁",
  premise: "Take one number from each pattern, in order, and you get a point. Plot the pairs and watch them line up.",
  outro: "Matching terms from two patterns make ordered pairs: (A term, B term).",
  scene: "sky",
  kind: "plot",
  cast: "",
  quiet: true,
  hint: "Pair the first with the first, the second with the second. A goes across, B goes up.",
  tag: "mismatches_terms",
  rounds: [
    { say: "Pair each A term with its B term. Plot the three missing points.", q: "A: 0, 1, 2, 3 · B: 0, 2, 4, 6", axes: [0, 7, 0, 7], given: [[0, 0]], ans: [[1, 2], [2, 4], [3, 6]], trap: [[2, 1], [4, 2], [6, 3]], why: "A goes across and B goes up. The pair for 1 and 2 is (1, 2).", win: "(1, 2), (2, 4) and (3, 6) make a straight line." },
    { say: "Plot the three missing pairs.", q: "A: 0, 2, 4, 6 · B: 0, 1, 2, 3", axes: [0, 7, 0, 7], given: [[0, 0]], ans: [[2, 1], [4, 2], [6, 3]], trap: [[1, 2], [2, 4], [3, 6]], why: "A goes across this time too. The pair for 2 and 1 is (2, 1).", win: "(2, 1), (4, 2) and (6, 3)." },
    { say: "Plot the missing pairs by yourself.", alt: [{ q: "A: 0, 1, 2 · B: 0, 3, 6", axes: [0, 7, 0, 7], given: [[0, 0]], ans: [[1, 3], [2, 6]], trap: [[3, 1], [6, 2]] }, { q: "A: 0, 3, 6 · B: 0, 2, 4", axes: [0, 7, 0, 7], given: [[0, 0]], ans: [[3, 2], [6, 4]], trap: [[2, 3], [4, 6]] }] },
  ],
}));
