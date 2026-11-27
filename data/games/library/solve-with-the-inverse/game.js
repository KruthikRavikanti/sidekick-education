// Solve With the Inverse. Skill A-REI.C.9-1.
// Finding the inverse of a matrix and using it to solve systems of linear equations. Multiplying on the other side, or by A itself, is the known slip.
Sidekick.game(Sidekick.play({
  title: "Solve With the Inverse",
  emoji: "🗝️",
  premise: "If AX = B, multiply both sides by the inverse of A, on the left. What remains is X, the solution.",
  outro: "The solution of AX = B is X = A^(−1)B. The inverse goes on the left.",
  scene: "desk",
  kind: "dial",
  cast: "",
  dials: [["Upper", 0, 20, 1, 0], ["Lower", 0, 20, 1, 0]],
  hint: "Each row of the inverse times the constants gives one unknown.",
  tag: "multiplies_by_a",
  rounds: [
    { say: "Put the plan in order.", kind: "fill", fs: 5.4, rows: [["write the system as", "AX = B"], ["multiply both sides on the left by", "A^(−1)"], ["the solution is", "X = A^(−1)B"]], extra: "X = AB|", trap: [2, "X = AB"], why: "Multiplying by A again does not undo A. Its inverse does.", win: "The inverse cancels A." },
    { say: "Solve 2x + y = 5 and x + y = 3. The inverse of the coefficient matrix is shown. Multiply it by the constants.", view: { type: "mats", items: ["[1,-1;-1,2]", "×", "[5;3]", "=", "[x;y]"] }, ans: [2, 1], trap: [13, 8], why: "That used the original coefficients. Use the inverse rows: 5 − 3, then −5 + 6.", win: "x = 2 and y = 1. Check: 4 + 1 = 5." },
    { say: "Multiply the inverse by the constants by yourself.", alt: [{ view: { type: "mats", items: ["[3,-1;-5,2]", "×", "[4;11]", "=", "[x;y]"] }, ans: [1, 2], trap: [2, 1] }, { view: { type: "mats", items: ["[1,-2;-1,3]", "×", "[8;3]", "=", "[x;y]"] }, ans: [2, 1], trap: [1, 2] }, { view: { type: "mats", items: ["[2,-1;-3,2]", "×", "[6;10]", "=", "[x;y]"] }, ans: [2, 2], trap: [12, 20] }] },
  ],
}));
