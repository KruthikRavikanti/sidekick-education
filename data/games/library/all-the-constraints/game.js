// All the Constraints. Skill A-CED.A.3-1.
// Representing constraints by equations or inequalities and by systems of them. Leaving out non-negativity constraints is the known slip.
Sidekick.game(Sidekick.play({
  title: "All the Constraints",
  emoji: "🍕",
  premise: "A real situation has more than one limit. The budget is one. You also cannot buy a negative number of things.",
  outro: "Represent every constraint, including that quantities cannot be negative.",
  scene: "kitchen",
  kind: "pick",
  fs: 5.6,
  hint: "What is the budget limit? Can either quantity go below zero?",
  tag: "omits_non_negativity",
  rounds: [
    { say: "You have $50 for pizzas (p, $10 each) and drinks (d, $2 each). Tap every constraint.", yes: "10p + 2d ≤ 50|p ≥ 0|d ≥ 0", no: "10p + 2d ≥ 50|p ≤ 0", trap: "-p ≥ 0", why: "You cannot buy a negative number of pizzas. That is a constraint too.", win: "A budget and two floors at zero." },
    { say: "A bus holds 40 people: adults a and children c. Tap every constraint.", yes: "a + c ≤ 40|a ≥ 0|c ≥ 0", no: "a + c ≥ 40|a × c ≤ 40", trap: "-c ≥ 0", why: "The number of children cannot be below zero.", win: "Capacity plus non-negative counts." },
    { say: "You can work at most 20 hours: tutoring t and coaching c. Tap every constraint by yourself.", yes: "t + c ≤ 20|t ≥ 0|c ≥ 0", no: "t + c ≥ 20|t − c ≤ 20|c ≤ 0", trap: "-c ≥ 0" },
  ],
}));
