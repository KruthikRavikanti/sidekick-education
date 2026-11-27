// Star Rows Equation. Skill 3.OA.A.1-3.
// Writing a multiplication equation for an array: rows times the number in each row equals the total. Adding the two numbers is the tempting slip.
Sidekick.game(Sidekick.play({
  title: "Star Rows Equation",
  emoji: "⭐",
  premise: "Stars shine in neat rows. Write the multiplication sentence that tells how many stars there are.",
  outro: "Rows times stars in each row gives the total.",
  scene: "night",
  kind: "row",
  cast: "",
  hint: "How many rows? How many in each row? Multiply them.",
  tag: "adds_rows_and_columns",
  rounds: [
    { say: "Build the multiplication sentence for the stars.", fig: { type: "array", v: [2, 5], icon: "⭐" }, seq: "2 × 5 = 10", also: ["5 × 2 = 10", "10 = 2 × 5", "10 = 5 × 2"], extra: "7 +", trap: "2 + 5 = 7", why: "Rows of equal size are multiplied, not added.", win: "2 × 5 = 10." },
    { say: "Build the sentence for these stars.", fig: { type: "array", v: [4, 6], icon: "⭐" }, seq: "4 × 6 = 24", also: ["6 × 4 = 24", "24 = 4 × 6", "24 = 6 × 4"], extra: "10 +", trap: "4 + 6 = 10", why: "4 rows of 6 is 6 + 6 + 6 + 6, which is 4 × 6.", win: "4 × 6 = 24." },
    { say: "Build the sentence by yourself.", alt: [{ fig: { type: "array", v: [3, 7], icon: "⭐" }, seq: "3 × 7 = 21", also: ["7 × 3 = 21", "21 = 3 × 7", "21 = 7 × 3"], extra: "10 +", trap: "3 + 7 = 10" }, { fig: { type: "array", v: [5, 4], icon: "⭐" }, seq: "5 × 4 = 20", also: ["4 × 5 = 20", "20 = 5 × 4", "20 = 4 × 5"], extra: "9 +", trap: "5 + 4 = 9" }] },
  ],
}));
