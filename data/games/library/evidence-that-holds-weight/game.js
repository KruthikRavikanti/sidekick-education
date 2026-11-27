// Evidence That Holds Weight. Skill RI.9-10.1-1.
// Citing strong and thorough textual evidence to support analysis of an informational text. Citing weak evidence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Evidence That Holds Weight",
  emoji: "🏋️",
  premise: "Not all support is equal. Specific facts, numbers and named sources carry an argument. Vague feelings do not.",
  outro: "Strong evidence is specific, relevant and checkable. Explain how it supports the claim.",
  scene: "city",
  kind: "sort",
  fs: 4.4,
  hint: "Could someone check it? Does it speak directly to the claim?",
  tag: "weak_evidence",
  rounds: [
    { say: "Claim: street trees cool cities. Strong evidence or weak?", bins: "Strong|Weak", items: ["Shaded pavement measured 11 degrees cooler in a city survey.|Blocks with full tree cover used less air conditioning.", "Everyone knows trees are nice.|My street feels cooler, I think."], trap: ["Everyone knows trees are nice.", 0], why: "Nice is not a measurement, and everyone knows cannot be checked.", win: "Numbers and records beat feelings." },
    { say: "Claim: later school start times help teens. Sort the evidence.", bins: "Strong|Weak", items: ["Attendance rose 4 percent after one district moved its start time.|Sleep researchers found teens fall asleep later than children.", "Mornings are the worst.|Lots of people probably agree."], trap: ["Lots of people probably agree.", 0], why: "Probably and lots of people give nothing to check.", win: "Specific and checkable." },
    { say: "Claim: the river is cleaner than it was. Sort these by yourself.", bins: "Strong|Weak", items: ["Monthly tests show oxygen levels doubled since 2015.|Three fish species have returned, a state count found.", "The water looks nicer to me.|People say it used to be gross."], trap: ["The water looks nicer to me.", 0] },
  ],
}));
