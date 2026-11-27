// Words to Expression. Skill 5.OA.A.2-1.
// Writing an expression for a calculation given in words: twice the sum of 8 and 7 is 2 × (8 + 7). Leaving out the parentheses is the known slip.
Sidekick.game(Sidekick.play({
  title: "Words to Expression",
  emoji: "📝",
  premise: "Turn a sentence into numbers and symbols. Parentheses keep a sum or difference together.",
  outro: "Words like \"the sum of\" need parentheses when that sum is then multiplied or divided.",
  scene: "paper",
  kind: "fill",
  cast: "",
  hint: "Which part happens first in the sentence? Wrap that part in parentheses.",
  tag: "drops_the_parentheses",
  rounds: [
    { say: "Match each sentence to its expression.", rows: [["twice the sum of 8 and 7", "2 × (8 + 7)"], ["7 more than twice 8", "2 × 8 + 7"]], extra: "2 + 8 + 7|", trap: [0, "2 × 8 + 7"], why: "The sum of 8 and 7 comes first, so it needs parentheses.", win: "The sum is wrapped, then doubled." },
    { say: "Match these.", rows: [["subtract 4 from 10, then multiply by 3", "(10 − 4) × 3"], ["subtract 4 times 3 from 10", "10 − 4 × 3"]], extra: "(4 − 10) × 3|", trap: [0, "10 − 4 × 3"], why: "Subtract first here, so the subtraction needs parentheses.", win: "Parentheses show what happens first." },
    { say: "Match these by yourself.", rows: [["half of the sum of 6 and 12", "(6 + 12) ÷ 2"], ["6 more than half of 12", "12 ÷ 2 + 6"], ["3 times the difference of 9 and 5", "3 × (9 − 5)"]], extra: "3 × 9 − 5|", trap: [2, "3 × 9 − 5"] },
  ],
}));
