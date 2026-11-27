// Story to Equation. Skill 6.EE.B.7-3.
// Writing and solving one-step equations from real-world problems. Setting up the equation backwards is the known slip.
Sidekick.game(Sidekick.play({
  title: "Story to Equation",
  emoji: "💵",
  premise: "A word problem hides an equation. Let a letter stand for the unknown, write the equation, then solve it.",
  outro: "Translate the story into an equation with a variable, then solve.",
  scene: "city",
  kind: "type",
  icon: "💵",
  hint: "What is unknown? What happens to it? What does it end up as?",
  tag: "sets_up_backwards",
  rounds: [
    { say: "Match each story to its equation.", kind: "fill", fs: 5.2, cast: "", rows: [["Tia has m dollars, earns 12, and now has 40.", "m + 12 = 40"], ["Sam has m dollars, spends 12, and now has 40.", "m − 12 = 40"]], extra: "12m = 40|", trap: [0, "m − 12 = 40"], why: "Earning adds to her money. That is m + 12.", win: "Earning adds. Spending subtracts." },
    { say: "Solve it. How much did Tia start with?", q: "m + 12 = 40", ans: 28, trap: 52, why: "She ended with 40 after earning 12, so she started with less than 40.", win: "40 − 12 = 28 dollars." },
    { say: "Write the equation in your head and solve it.", alt: [{ q: "5 equal bags hold 45 apples in all. How many apples are in each bag?", ans: 9, trap: 40 }, { q: "After paying 8 dollars for lunch, Ben has 15 dollars left. How much did he have before?", ans: 23, trap: 7 }, { q: "A rope is cut into 4 equal pieces of 6 feet. How long was the rope?", ans: 24, trap: 10 }] },
  ],
}));
