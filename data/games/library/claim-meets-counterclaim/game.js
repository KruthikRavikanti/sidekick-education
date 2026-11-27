// Claim Meets Counterclaim. Skill W.7.1-1.
// Introducing claims, acknowledging alternate or opposing claims, and organizing reasons logically. Ignoring counterclaims is the known slip.
Sidekick.game(Sidekick.play({
  title: "Claim Meets Counterclaim",
  emoji: "🤝",
  premise: "A strong argument does not pretend the other side is silent. It names an opposing view, then answers it.",
  outro: "Introduce your claim, acknowledge a counterclaim, and respond to it.",
  scene: "city",
  kind: "sort",
  fs: 4.6,
  hint: "Which sentence is what the writer argues? Which is what others might say against it?",
  tag: "ignores_counterclaims",
  rounds: [
    { say: "The writer wants a later school start. Sort each sentence.", bins: "The claim|A counterclaim", items: ["School should begin at 9:00.|", "Some worry later starts would cut into sports.|Critics say more buses would be needed."], trap: ["Critics say more buses would be needed.", 0], why: "Critics say marks a view against the writer’s position.", win: "One claim, two opposing views to answer." },
    { say: "Build the paragraph: claim, counterclaim, response.", kind: "row", fs: 4.4, seq: "School should start later.|Some say this would hurt after-school sports.|Yet many schools simply moved practice by half an hour.", trap: "Some say this would hurt after-school sports.|School should start later.|Yet many schools simply moved practice by half an hour.", why: "State your own claim first. Then bring in the other view.", win: "Claim, counterclaim, answer." },
    { say: "The writer wants phones banned in class. Sort by yourself.", bins: "The claim|A counterclaim", items: ["Phones should stay in lockers.|", "Some argue phones help with research.|Others say families need to reach students."], trap: ["Some argue phones help with research.", 0] },
  ],
}));
