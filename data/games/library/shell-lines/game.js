// Shell Lines. Skill 1.OA.A.1-3.
// Compare problems: two rows are lined up so the extra ones stick out. Adding both rows is the known slip for how many more.
Sidekick.game(Sidekick.play({
  title: "Shell Lines",
  emoji: "🐚",
  premise: "Two friends line up their shells side by side. Find how many more one friend has than the other.",
  outro: "How many more is the extra part, not everything together.",
  scene: "sand",
  kind: "type",
  icon: "🦀",
  hint: "Match the shells one to one. Count the ones with no partner.",
  tag: "adds_in_compare_problem",
  rounds: [
    { say: "Look at the two rows. Key in how many more.", fig: { type: "mix", rows: true, icons: "🐚 🐚", v: [9, 5] }, q: "Ana has 9 shells. Ben has 5. How many more does Ana have?", ans: 4, trap: 14, why: "How many more asks for the extra ones, not all of them together.", win: "Ana has 4 more." },
    { say: "Compare these two rows.", fig: { type: "mix", rows: true, icons: "🐚 🐚", v: [11, 6] }, q: "Ana has 11 shells. Ben has 6. How many more does Ana have?", ans: 5, trap: 17, why: "Count only the shells that stick out past the shorter row.", win: "Ana has 5 more." },
    { say: "Key in the answer by yourself.", alt: [{ fig: { type: "mix", rows: true, icons: "🐚 🐚", v: [10, 7] }, q: "Ana has 10 shells. Ben has 7. How many more does Ana have?", ans: 3, trap: 17 }, { fig: { type: "mix", rows: true, icons: "🐚 🐚", v: [12, 4] }, q: "Ana has 12 shells. Ben has 4. How many more does Ana have?", ans: 8, trap: 16 }, { fig: { type: "mix", rows: true, icons: "🐚 🐚", v: [8, 6] }, q: "Ana has 8 shells. Ben has 6. How many fewer does Ben have?", ans: 2, trap: 14 }] },
  ],
}));
