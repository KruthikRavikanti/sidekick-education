// Name the Property. Skill 6.EE.A.4-2.
// Explaining why two expressions are equivalent using properties of operations. Relying on how the expressions look is the known slip.
Sidekick.game(Sidekick.play({
  title: "Name the Property",
  emoji: "📜",
  premise: "You do not have to test numbers to know two expressions are equal. A property guarantees it.",
  outro: "Properties of operations prove equivalence for every value at once.",
  scene: "paper",
  kind: "fill",
  cast: "",
  hint: "What was done: multiplied through, swapped the order, or regrouped?",
  tag: "relies_on_looks",
  rounds: [
    { say: "Which property shows each pair is equivalent?", rows: [["4(n + 2) = 4n + 8", "distributive"], ["a + b = b + a", "commutative"]], extra: "they look alike|", trap: [0, "they look alike"], why: "Looks prove nothing. The 4 was multiplied through both terms.", win: "Distributive and commutative." },
    { say: "Which property is used?", rows: [["(a + b) + c = a + (b + c)", "associative"], ["3 × x = x × 3", "commutative"], ["2(x + 5) = 2x + 10", "distributive"]], trap: [0, "commutative"], why: "The order stayed the same. Only the grouping changed.", win: "Three properties." },
    { say: "Name the property by yourself.", rows: [["5(y + 1) = 5y + 5", "distributive"], ["x + 7 = 7 + x", "commutative"], ["(2 × 3) × n = 2 × (3 × n)", "associative"]], extra: "they look alike|", trap: [2, "commutative"] },
  ],
}));
