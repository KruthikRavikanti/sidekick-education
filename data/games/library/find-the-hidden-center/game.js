// Find the Hidden Center. Skill G-GPE.A.1-2.
// Completing the square to find the center and radius of a circle. Using the opposite signs for the center is the known slip.
Sidekick.game(Sidekick.play({
  title: "Find the Hidden Center",
  emoji: "🎯",
  premise: "A circle equation can arrive scrambled. Complete the square for x and for y and the center and radius appear.",
  outro: "In (x − h)^2 + (y − k)^2 = r^2 the center is (h, k): the signs flip, and the radius is the square root of the right side.",
  scene: "paper",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "x − 2 means the center has x = 2. y + 3 means y = −3.",
  tag: "center_signs_flipped",
  rounds: [
    { say: "Read the center and the radius.", q: "(x − 2)^2 + (y + 3)^2 = 25", rows: [["center", "(2, −3)"], ["radius", "5"]], extra: "(−2, 3)|25", trap: [0, "(−2, 3)"], why: "The equation subtracts the center. x − 2 gives 2 and y + 3 gives −3.", win: "Center (2, −3), radius 5." },
    { say: "x^2 + y^2 − 4x + 6y − 12 = 0. Complete each square.", rows: [["x^2 − 4x needs", "+ 4"], ["y^2 + 6y needs", "+ 9"], ["the right side becomes 12 + 4 + 9 =", "25"]], extra: "+ 16|+ 36", trap: [0, "+ 16"], why: "Halve the −4 to get −2, then square it: 4.", win: "(x − 2)^2 + (y + 3)^2 = 25." },
    { say: "Read the center and radius by yourself.", alt: [{ q: "(x + 1)^2 + (y − 4)^2 = 9", rows: [["center", "(−1, 4)"], ["radius", "3"]], extra: "(1, −4)|9", trap: [0, "(1, −4)"] }, { q: "(x − 5)^2 + (y + 2)^2 = 16", rows: [["center", "(5, −2)"], ["radius", "4"]], extra: "(−5, 2)|16", trap: [0, "(−5, 2)"] }, { q: "x^2 + (y − 6)^2 = 49", rows: [["center", "(0, 6)"], ["radius", "7"]], extra: "(0, −6)|49", trap: [0, "(0, −6)"] }] },
  ],
}));
