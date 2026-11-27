// Sound or Shaky Reasoning. Skill W.8.1-2.
// Supporting claims with logical reasoning and relevant evidence from accurate, credible sources. Using weak evidence or reasoning is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sound or Shaky Reasoning",
  emoji: "🧱",
  premise: "Evidence only helps if the reasoning from it holds up. Watch for leaps, attacks on people and claims that everyone does it.",
  outro: "Support claims with logical reasoning and accurate, credible evidence.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Does the reason really lead to the claim? Or is it a leap?",
  tag: "weak_evidence",
  rounds: [
    { say: "Claim: the city should plant more trees. Judge the reasoning.", bins: "Sound|Shaky", items: ["Shaded blocks measured 5 degrees cooler, so trees cut heat.|Trees absorb storm water, which reduces flooding.", "Everyone likes trees, so we need more.|The mayor who opposes it is grumpy."], trap: ["The mayor who opposes it is grumpy.", 0], why: "Attacking a person says nothing about trees.", win: "Reasons must connect to the claim." },
    { say: "Claim: students should learn a second language. Judge the reasoning.", bins: "Sound|Shaky", items: ["Studies link language learning to stronger memory.|Many employers seek bilingual workers.", "My cousin speaks French and she is cool.|If we skip languages, schools will collapse."], trap: ["If we skip languages, schools will collapse.", 0], why: "That leaps from one choice to a disaster with nothing in between.", win: "Evidence and a fair link." },
    { say: "Claim: the school should add a recycling program. Judge by yourself.", bins: "Sound|Shaky", items: ["A trial cut trash pickups from five to three a week.|Nearby schools saved money on hauling.", "Only lazy people oppose recycling.|All the popular schools do it."], trap: ["All the popular schools do it.", 0] },
  ],
}));
