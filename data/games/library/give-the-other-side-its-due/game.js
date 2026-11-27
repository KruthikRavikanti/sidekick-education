// Give the Other Side Its Due. Skill W.9-10.1-2.
// Developing claims and counterclaims fairly, supplying evidence and pointing out strengths and limitations. Writing one-sidedly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Give the Other Side Its Due",
  emoji: "⚖️",
  premise: "A strong argument treats the opposing view fairly. It admits what is true in it, then answers with evidence.",
  outro: "Develop claim and counterclaim fairly: supply evidence for each and note strengths and limits.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Does the sentence admit a real point on the other side, or just dismiss it?",
  tag: "one_sided",
  rounds: [
    { say: "Fair to the other side, or one-sided?", bins: "Fair|One-sided", items: ["Critics are right that buses would need new schedules.|The cost is real, though savings on tutoring offset it.", "Only a fool would oppose this plan.|There are no good arguments against it."], trap: ["There are no good arguments against it.", 0], why: "That waves the other side away without looking at it.", win: "Admit the point, then answer it." },
    { say: "The essay argues for a four-day school week. Match each piece of evidence to the side it supports.", kind: "fill", fs: 4.4, cast: "", rows: [["supports the claim", "One district cut absences by a fifth."], ["supports the counterclaim", "Families must find care for the fifth day."]], extra: "Fridays are nice.|", trap: [0, "Fridays are nice."], why: "Nice is a feeling, not evidence. Which fact shows a benefit?", win: "Evidence on both sides." },
    { say: "Sort these by yourself.", bins: "Fair|One-sided", items: ["Opponents raise a real worry about privacy.|This plan has limits: it helps only larger schools.", "Anyone who disagrees has not thought about it.|The other side is simply being lazy."], trap: ["The other side is simply being lazy.", 0] },
  ],
}));
