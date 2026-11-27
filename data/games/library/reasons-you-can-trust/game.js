// Reasons You Can Trust. Skill W.7.1-2.
// Supporting claims with logical reasoning and relevant evidence from credible sources. Using weak sources is the known slip.
Sidekick.game(Sidekick.play({
  title: "Reasons You Can Trust",
  emoji: "🏛️",
  premise: "Support a claim with sound reasoning and sources a reader can trust. A rumor or a wild leap weakens the whole argument.",
  outro: "Use logical reasoning and credible, accurate sources to support claims.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Who is the source? Does the reason actually lead to the claim?",
  tag: "weak_sources",
  rounds: [
    { say: "Claim: teens need more sleep. Which support is credible?", bins: "Credible|Weak", items: ["A national health agency recommends nine hours.|A university study linked sleep to memory.", "A video said so.|My friend heard it somewhere."], trap: ["A video said so.", 0], why: "Which video? By whom? An unnamed source cannot be checked.", win: "Named experts beat rumors." },
    { say: "Claim: the town should add bike lanes. Sort the support.", bins: "Credible|Weak", items: ["City crash records show fewer injuries on streets with lanes.|A transport engineer reviewed the plan.", "Bikes are cool, so lanes are good.|Someone posted that cars hate bikes."], trap: ["Bikes are cool, so lanes are good.", 0], why: "Being cool does not show that lanes make streets safer.", win: "Records and experts support the claim." },
    { say: "Claim: school lunches should include more vegetables. Sort by yourself.", bins: "Credible|Weak", items: ["Dietitians advise five servings a day.|A hospital study tracked students’ energy.", "A cartoon rabbit eats carrots.|An ad says its snack is healthy."], trap: ["An ad says its snack is healthy.", 0] },
  ],
}));
