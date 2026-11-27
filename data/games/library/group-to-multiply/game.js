// Group to Multiply. Skill 3.OA.B.5-2.
// The associative property of multiplication: 3 × 5 × 2 = 3 × 10. Always multiplying the first two is the known slip.
Sidekick.game(Sidekick.play({
  title: "Group to Multiply",
  emoji: "🫧",
  premise: "With three numbers to multiply, you choose which two go first. Look for a pair that makes ten.",
  outro: "You can group factors in any way that makes the work easier.",
  scene: "ocean",
  kind: "fill",
  cast: "",
  hint: "Which two factors make 10? Multiply those first.",
  tag: "multiplies_left_to_right",
  rounds: [
    { say: "Group the pair that makes ten. Then finish.", rows: [["3 × 5 × 2 = 3 × ___", "10"], ["3 × 10 = ___", "30"]], extra: "15 7", trap: [0, "15"], why: "Here 5 and 2 are grouped. They make 10.", win: "3 × 10 = 30." },
    { say: "Find the ten again.", rows: [["4 × 2 × 5 = 4 × ___", "10"], ["4 × 10 = ___", "40"]], extra: "8 7", trap: [0, "8"], why: "Here 2 and 5 are grouped. They make 10.", win: "4 × 10 = 40." },
    { say: "Group to multiply by yourself.", rows: [["7 × 5 × 2 = 7 × ___", "10"], ["7 × 10 = ___", "70"], ["2 × 5 × 9 = ___ × 9", "10"]], extra: "35 14", trap: [0, "35"] },
  ],
}));
