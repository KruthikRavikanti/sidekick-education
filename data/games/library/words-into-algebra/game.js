// Words Into Algebra. Skill 6.EE.A.2-1.
// Writing expressions that record operations with numbers and letters. Writing 5 − y for 5 less than y is the known slip.
Sidekick.game(Sidekick.play({
  title: "Words Into Algebra",
  emoji: "🔤",
  premise: "Phrases turn into expressions. Watch the order: 5 less than y starts from y.",
  outro: "5 less than y is y − 5. The number you start from comes first.",
  scene: "paper",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "What are you starting with? What is being taken from it?",
  tag: "reverses_subtraction",
  rounds: [
    { say: "Match each phrase to its expression.", rows: [["5 less than y", "y − 5"], ["5 more than y", "y + 5"]], extra: "5 − y|", trap: [0, "5 − y"], why: "You start with y and take 5 away: y − 5.", win: "Start with y, then subtract." },
    { say: "Match these phrases.", rows: [["twice a number n", "2n"], ["n divided by 4", "n ÷ 4"], ["3 less than twice n", "2n − 3"]], extra: "3 − 2n|", trap: [2, "3 − 2n"], why: "Start with twice n, then take 3 away.", win: "Three expressions." },
    { say: "Match these by yourself.", rows: [["7 less than x", "x − 7"], ["the product of 6 and x", "6x"], ["x subtracted from 10", "10 − x"]], extra: "7 − x|", trap: [0, "7 − x"] },
  ],
}));
