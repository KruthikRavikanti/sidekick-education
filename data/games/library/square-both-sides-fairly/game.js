// Square Both Sides Fairly. Skill A-REI.B.4-1.
// Using the method of completing the square to solve quadratic equations. Adding the constant to one side only is the known slip.
Sidekick.game(Sidekick.play({
  title: "Square Both Sides Fairly",
  emoji: "⬜",
  premise: "To solve by completing the square, add the same number to both sides so the left becomes a perfect square.",
  outro: "Add (half of b)² to BOTH sides, write the left as a square, then take square roots.",
  scene: "paper",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Whatever completes the square on the left must be added on the right too.",
  tag: "adds_to_one_side",
  rounds: [
    { say: "Solve x^2 + 6x − 7 = 0 by completing the square.", rows: [["move the 7 across", "x^2 + 6x = 7"], ["add 9 to both sides", "(x + 3)^2 = 16"], ["take square roots", "x = 1 or x = −7"]], extra: "(x + 3)^2 = 7|", trap: [1, "(x + 3)^2 = 7"], why: "The 9 was added on the left only. The right side becomes 7 + 9.", win: "x + 3 is 4 or −4." },
    { say: "Solve x^2 + 4x − 5 = 0.", rows: [["add 4 to both sides of x^2 + 4x = 5", "(x + 2)^2 = 9"], ["solutions", "x = 1 or x = −5"]], extra: "(x + 2)^2 = 5|x = 3 only", trap: [0, "(x + 2)^2 = 5"], why: "Add the 4 to the right side as well: 5 + 4.", win: "x + 2 is 3 or −3." },
    { say: "Solve x^2 − 2x − 8 = 0 by yourself.", rows: [["add 1 to both sides of x^2 − 2x = 8", "(x − 1)^2 = 9"], ["solutions", "x = 4 or x = −2"]], extra: "(x − 1)^2 = 8|x = 4 only", trap: [0, "(x − 1)^2 = 8"] },
  ],
}));
