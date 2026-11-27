// Parentheses First. Skill 5.OA.A.1-1.
// Evaluating expressions with parentheses and brackets: the grouped part is computed first. Ignoring the grouping symbols is the known slip.
Sidekick.game(Sidekick.play({
  title: "Parentheses First",
  emoji: "🥚",
  premise: "Parentheses are like an eggshell around part of a problem. Crack that part open and work it out first.",
  outro: "Work out what is inside the grouping symbols first.",
  scene: "kitchen",
  kind: "type",
  icon: "🥚",
  hint: "Find the parentheses. Work out that part before anything else.",
  tag: "ignores_grouping",
  rounds: [
    { say: "Key in the value.", q: "(4 + 6) × 3", ans: 30, trap: 22, why: "The parentheses say to add 4 + 6 first. Then multiply by 3.", win: "10 × 3 = 30." },
    { say: "Key in this value.", q: "20 − (8 − 3)", ans: 15, trap: 9, why: "Work out 8 − 3 first. Then take that from 20.", win: "20 − 5 = 15." },
    { say: "Key in the value by yourself.", alt: [{ q: "2 × [5 + (9 − 3)]", ans: 22, trap: 16 }, { q: "(12 + 8) ÷ 4", ans: 5, trap: 14 }, { q: "6 × (7 − 2)", ans: 30, trap: 40 }] },
  ],
}));
