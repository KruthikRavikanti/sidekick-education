// Benchmark Check. Skill 5.NF.A.2-2.
// Using benchmark fractions to judge reasonableness: 1/2 + 1/3 cannot be 2/5, because 2/5 is less than 1/2.
Sidekick.game(Sidekick.play({
  title: "Benchmark Check",
  emoji: "🤔",
  premise: "Before you trust a fraction answer, compare it with one half and with one whole. Some answers cannot be right.",
  outro: "Use benchmarks like one half and one whole to check whether an answer is reasonable.",
  scene: "paper",
  kind: "sort",
  fs: 5,
  hint: "Is the answer bigger than each part you added? It should be.",
  tag: "accepts_unreasonable_sum",
  rounds: [
    { say: "Could each answer be right?", bins: "Makes sense|Cannot be right", items: ["{1/2} + {1/3} = {5/6}|{3/4} + {1/8} = {7/8}", "{1/2} + {1/3} = {2/5}|{3/4} + {1/8} = {4/12}"], trap: ["{1/2} + {1/3} = {2/5}", 0], why: "Two fifths is less than one half. Adding to one half must give more.", win: "A sum is bigger than its parts." },
    { say: "Check these.", bins: "Makes sense|Cannot be right", items: ["{7/8} − {1/2} = {3/8}|{2/3} + {1/2} = {7/6}", "{7/8} − {1/2} = {6/6}|{2/3} + {1/2} = {3/5}"], trap: ["{2/3} + {1/2} = {3/5}", 0], why: "Both parts are one half or more, so the sum must be more than 1.", win: "You checked against one half and one whole." },
    { say: "Check these by yourself.", bins: "Makes sense|Cannot be right", items: ["{1/4} + {1/2} = {3/4}|{9/10} − {1/2} = {4/10}", "{1/4} + {1/2} = {2/6}|{9/10} − {1/2} = {8/8}|{5/6} + {3/4} = {8/10}"], trap: ["{1/4} + {1/2} = {2/6}", 0] },
  ],
}));
