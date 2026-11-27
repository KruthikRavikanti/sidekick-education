// Is the Evidence Enough?. Skill RI.7.8-1.
// Evaluating an argument: whether the reasoning is sound and the evidence relevant and sufficient. Accepting weak evidence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Is the Evidence Enough?",
  emoji: "🧪",
  premise: "Good arguments use evidence that is on topic and strong enough. One story or a popularity claim does not prove much.",
  outro: "Evaluate whether evidence is relevant to the claim and sufficient to support it.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Is it about the claim? Is it more than one person’s story?",
  tag: "accepts_weak_evidence",
  rounds: [
    { say: "Claim: the new crosswalk made the street safer. Judge the evidence.", bins: "Strong|Weak", items: ["Crashes fell from 12 a year to 3.|Police data covers the two years since.", "My cousin thinks it looks nice.|Everybody says so."], trap: ["Everybody says so.", 0], why: "Popularity is not proof. Where are the numbers?", win: "Data over opinion." },
    { say: "Claim: reading before bed improves sleep. Judge the evidence.", bins: "Strong|Weak", items: ["A study of 500 adults found they fell asleep faster.|Three other studies found the same.", "I read once and slept fine.|Books are made of paper."], trap: ["I read once and slept fine.", 0], why: "One night for one person is not enough to prove a pattern.", win: "Many people, repeated results." },
    { say: "Claim: the school garden cut lunch waste. Judge by yourself.", bins: "Strong|Weak", items: ["Trash bags dropped from 20 to 12 a week.|The count was kept all year.", "Gardens are pretty.|One student said lunch tastes better."], trap: ["One student said lunch tastes better.", 0] },
  ],
}));
