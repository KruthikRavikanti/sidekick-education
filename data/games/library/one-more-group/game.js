// One More Group. Skill 3.OA.C.7-2.
// Facts for 3, 4 and 6 from known facts: 6 × 7 is 5 × 7 plus one more 7. Adding the other factor instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "One More Group",
  emoji: "➕",
  premise: "A fact you do not know is often one group more than a fact you do know. Build it from there.",
  outro: "Use a fact you know and add one more group.",
  scene: "candy",
  kind: "fill",
  cast: "",
  hint: "One more group means adding the size of one group.",
  tag: "adds_the_other_factor",
  rounds: [
    { say: "Build 6 × 7 from 5 × 7 and one more group.", rows: [["6 × 7 = 5 × 7 + ___", "7"], ["= 35 + 7 = ___", "42"]], extra: "6 41", trap: [0, "6"], why: "One more group of 7 means adding 7, not 6.", win: "35 + 7 = 42." },
    { say: "Build 4 × 8 by doubling 2 × 8.", rows: [["4 × 8 = 2 × 8 + 2 × ___", "8"], ["= 16 + 16 = ___", "32"]], extra: "4 24", trap: [0, "4"], why: "Both halves are groups of 8.", win: "16 + 16 = 32." },
    { say: "Build these by yourself.", rows: [["6 × 9 = 5 × 9 + ___", "9"], ["= 45 + 9 = ___", "54"], ["3 × 7 = 2 × 7 + ___", "7"]], extra: "6 3 51", trap: [0, "6"] },
  ],
}));
