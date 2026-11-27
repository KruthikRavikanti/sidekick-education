// Tough Facts Arena. Skill 3.OA.C.7-3.
// Multiplication facts for 7, 8 and 9: the facts most often guessed are sorted to nearby products, so a guess lands in a neighbor bin.
Sidekick.game(Sidekick.play({
  title: "Tough Facts Arena",
  emoji: "🥊",
  premise: "The sevens, eights and nines are the champions of tricky. Send each fact to its product.",
  outro: "The hardest facts get easy with practice: 7 × 8 = 56.",
  scene: "city",
  kind: "sort",
  cast: "",
  hint: "Use a fact you know: 7 × 8 is 7 × 7 plus 7.",
  tag: "fact_slip",
  rounds: [
    { say: "Send each fact to its product.", bins: "56|63|72", items: ["7 × 8|8 × 7", "7 × 9|9 × 7", "8 × 9|9 × 8"], trap: ["7 × 8", 1], why: "7 × 7 is 49, and one more 7 is 56.", win: "56, 63 and 72." },
    { say: "New facts. Where does each one go?", bins: "48|54|64", items: ["6 × 8|8 × 6", "6 × 9|9 × 6", "8 × 8"], trap: ["6 × 9", 0], why: "6 × 9 is 60 take away 6, which is 54.", win: "48, 54 and 64." },
    { say: "Sort these by yourself.", bins: "42|56|72", items: ["6 × 7|7 × 6", "7 × 8|8 × 7", "8 × 9|9 × 8"], trap: ["7 × 8", 0] },
  ],
}));
