// Same Whole Rule. Skill 4.NF.A.2-3.
// Fraction comparisons are valid only for the same whole: half of a small pizza cannot be compared with a third of a large one by the fractions alone.
Sidekick.game(Sidekick.play({
  title: "Same Whole Rule",
  emoji: "🫓",
  premise: "Comparing fractions only makes sense when they are parts of the same size whole. Check the wholes first.",
  outro: "Fractions can be compared only when they refer to the same whole.",
  scene: "kitchen",
  kind: "sort",
  hint: "Are both fractions parts of the same size whole?",
  tag: "compares_different_wholes",
  rounds: [
    { say: "Is it fair to compare these by their fractions alone?", bins: "Fair to compare|Not fair", items: ["{1/2} and {1/3} of same-size pizzas|{3/4} and {2/4} of the same rope", "{1/2} of a small pizza and {1/3} of a large pizza|{3/4} of a pond and {2/4} of a lake"], trap: ["{1/2} of a small pizza and {1/3} of a large pizza", 0], why: "The pizzas are different sizes, so the fractions alone cannot tell you who ate more.", win: "Same whole first, then compare." },
    { say: "Check the wholes.", bins: "Fair to compare|Not fair", items: ["{2/3} and {1/3} of the same jug|{5/8} and {3/8} of same-size cakes", "{2/3} of a cup and {1/3} of a bucket|{5/8} of a short book and {3/8} of a long book"], trap: ["{2/3} of a cup and {1/3} of a bucket", 0], why: "A cup and a bucket are different wholes.", win: "You checked the wholes." },
    { say: "Sort these by yourself.", bins: "Fair to compare|Not fair", items: ["{1/4} and {3/4} of the same hour|{2/5} and {4/5} of same-size bars", "{1/4} of a minute and {3/4} of an hour|{2/5} of a pond and {4/5} of a puddle"], trap: ["{1/4} of a minute and {3/4} of an hour", 0] },
  ],
}));
