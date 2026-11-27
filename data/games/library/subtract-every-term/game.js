// Subtract Every Term. Skill A-APR.A.1-1.
// Adding and subtracting polynomials. Forgetting to distribute the minus sign is the known slip.
Sidekick.game(Sidekick.play({
  title: "Subtract Every Term",
  emoji: "➖",
  premise: "Subtracting a polynomial means subtracting every one of its terms. The minus sign reaches all the way through the bracket.",
  outro: "To subtract a polynomial, change the sign of each term in it, then combine like terms.",
  scene: "paper",
  kind: "fill",
  fs: 5,
  cast: "",
  hint: "Flip the sign of EVERY term in the second bracket first.",
  tag: "forgets_to_distribute_minus",
  rounds: [
    { say: "Work out each one.", rows: [["(5x + 3) − (2x − 4)", "3x + 7"], ["(5x + 3) + (2x − 4)", "7x − 1"]], extra: "3x − 1|", trap: [0, "3x − 1"], why: "Subtracting −4 adds 4: 3 + 4 = 7.", win: "The minus flips both signs." },
    { say: "Work out each one.", rows: [["(3x^2 + 2x − 5) − (x^2 − 4x + 1)", "2x^2 + 6x − 6"], ["(x^2 + x) − (x^2 − x)", "2x"]], extra: "2x^2 − 2x − 4|", trap: [0, "2x^2 − 2x − 4"], why: "Only the first sign was flipped. −(−4x) is +4x and −(+1) is −1.", win: "Every term changed sign." },
    { say: "Work these out by yourself.", rows: [["(4x^2 − x + 2) − (x^2 + 3x − 5)", "3x^2 − 4x + 7"], ["(2x^2 + 5) − (x^2 − 5)", "x^2 + 10"]], extra: "3x^2 + 2x − 3|x^2", trap: [0, "3x^2 + 2x − 3"] },
  ],
}));
