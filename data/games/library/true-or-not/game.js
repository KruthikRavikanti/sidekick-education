// True or Not?. Skill 1.OA.D.7-2.
// Judging equations true or false: sentences with the total on the left (7 = 3 + 4) are true, and the child who expects the answer on the right calls them untrue.
Sidekick.game(Sidekick.play({
  title: "True or Not?",
  emoji: "✅",
  premise: "A number sentence is true when both sides are the same amount, no matter which side the sum is on.",
  outro: "Check both sides. If they are the same amount, the sentence is true.",
  scene: "paper",
  kind: "sort",
  cast: "",
  hint: "Work out each side. Are they the same amount?",
  tag: "total_must_be_on_the_right",
  rounds: [
    { say: "Sort each number sentence: true or not true?", bins: "True|Not true", items: ["7 = 3 + 4|6 = 6|5 + 2 = 2 + 5", "8 = 5 + 2|4 + 1 = 6"], trap: ["7 = 3 + 4", 1], why: "3 + 4 is 7. Both sides are the same, so it is true.", win: "The total can be on either side." },
    { say: "Check both sides of each one.", bins: "True|Not true", items: ["9 = 4 + 5|3 + 6 = 6 + 3|10 = 10", "7 = 7 + 1|2 + 5 = 8"], trap: ["9 = 4 + 5", 1], why: "4 + 5 is 9. Both sides are the same amount.", win: "Same on both sides means true." },
    { say: "Sort these by yourself.", bins: "True|Not true", items: ["8 = 6 + 2|4 + 4 = 5 + 3|12 = 12", "9 = 5 + 3|6 + 1 = 8|10 = 4 + 5"], trap: ["8 = 6 + 2", 1] },
  ],
}));
