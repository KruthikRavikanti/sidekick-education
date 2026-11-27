// Match the Positions. Skill N-VM.C.8-1.
// Adding and subtracting matrices of appropriate dimensions. Adding matrices of different sizes is the known slip.
Sidekick.game(Sidekick.play({
  title: "Match the Positions",
  emoji: "🧮",
  premise: "To add matrices, add the entries that sit in the same position. That only works when the shapes match.",
  outro: "Add or subtract matrices entry by entry. They must be the same size.",
  scene: "desk",
  kind: "dial",
  cast: "",
  hint: "Pair each entry with the one in the same spot.",
  tag: "adds_different_sizes",
  rounds: [
    { say: "Finish the sum. Set the two missing entries.", view: { type: "mats", items: ["[1,2;3,4]", "+", "[5,0;1,1]", "=", "[6,x;y,5]"] }, dials: [["Upper right", 0, 12, 1, 0], ["Lower left", 0, 12, 1, 0]], ans: [2, 4], trap: [0, 3], why: "That multiplied the entries. Add them: 2 + 0 and 3 + 1.", win: "Same spot, add." },
    { say: "Which pairs can be added?", kind: "sort", fs: 5, bins: "Can add|Cannot add", items: ["a 2 by 2 and a 2 by 2|a 2 by 3 and a 2 by 3", "a 2 by 2 and a 2 by 3|a 1 by 2 and a 2 by 1"], trap: ["a 1 by 2 and a 2 by 1", 0], why: "One is a row and the other is a column. Their positions do not line up.", win: "Same shape or no sum." },
    { say: "Finish it by yourself.", alt: [{ view: { type: "mats", items: ["[4,1;0,2]", "+", "[3,5;2,2]", "=", "[7,x;y,4]"] }, dials: [["Upper right", 0, 12, 1, 0], ["Lower left", 0, 12, 1, 0]], ans: [6, 2], trap: [5, 0] }, { view: { type: "mats", items: ["[9,6;5,3]", "−", "[4,2;1,3]", "=", "[5,x;y,0]"] }, dials: [["Upper right", 0, 12, 1, 0], ["Lower left", 0, 12, 1, 0]], ans: [4, 4], trap: [8, 6] }, { view: { type: "mats", items: ["[2,7;3,1]", "+", "[6,1;4,8]", "=", "[8,x;y,9]"] }, dials: [["Upper right", 0, 12, 1, 0], ["Lower left", 0, 12, 1, 0]], ans: [8, 7], trap: [7, 12] }] },
  ],
}));
