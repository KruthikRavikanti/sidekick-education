// Both Sides Equal. Skill GA-3-PAR.3.4-1.
// Deciding whether two expressions are equal (4 × 3 = 6 + 6): the equal sign compares values. Expecting a single answer after the sign is the known slip.
Sidekick.game(Sidekick.play({
  title: "Both Sides Equal",
  emoji: "🟰",
  premise: "An equation is true when the two sides are worth the same, even if they look nothing alike.",
  outro: "Work out each side. If they match, the equation is true.",
  scene: "paper",
  kind: "sort",
  cast: "",
  hint: "Work out the left side. Work out the right side. Are they the same?",
  tag: "equal_means_write_the_answer",
  rounds: [
    { say: "Sort each equation: true or not true?", bins: "True|Not true", items: ["4 × 3 = 6 + 6|2 × 8 = 10 + 6|5 × 4 = 20", "3 × 5 = 5 + 3|6 × 2 = 6 + 2"], trap: ["4 × 3 = 6 + 6", 1], why: "4 × 3 is 12 and 6 + 6 is 12. Both sides match.", win: "Both sides can have work to do." },
    { say: "Check both sides.", bins: "True|Not true", items: ["9 × 2 = 20 − 2|3 × 6 = 9 + 9|7 × 1 = 7", "4 × 4 = 4 + 4|5 × 3 = 5 + 3"], trap: ["9 × 2 = 20 − 2", 1], why: "9 × 2 is 18 and 20 − 2 is 18. Both sides match.", win: "Same value on both sides means true." },
    { say: "Sort these by yourself.", bins: "True|Not true", items: ["6 × 4 = 12 + 12|8 × 3 = 30 − 6|2 × 9 = 18", "7 × 2 = 7 + 2|5 × 5 = 5 + 5"], trap: ["6 × 4 = 12 + 12", 1] },
  ],
}));
