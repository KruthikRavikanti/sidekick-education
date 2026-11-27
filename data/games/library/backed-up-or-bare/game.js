// Backed Up or Bare?. Skill RI.6.8-2.
// Distinguishing claims that are supported by reasons and evidence from claims that are not. Accepting all claims is the known slip.
Sidekick.game(Sidekick.play({
  title: "Backed Up or Bare?",
  emoji: "🧱",
  premise: "Some claims come with reasons and evidence. Others are just said loudly. Readers should tell them apart.",
  outro: "A supported claim comes with facts, data or examples. An unsupported claim has none.",
  scene: "desk",
  kind: "sort",
  fs: 4.1,
  hint: "Is there a fact, number or example right there with the claim?",
  tag: "accepts_all_claims",
  rounds: [
    { say: "Is each claim supported or not?", bins: "Supported|Unsupported", items: ["Recess helps focus: scores rose in a study.|Reading grows vocabulary: readers meet many new words.", "Homework is pointless. Everyone knows it.|Our team is simply the best."], trap: ["Homework is pointless. Everyone knows it.", 0], why: "Everyone knows it is not evidence. No fact or example is given.", win: "Evidence makes the difference." },
    { say: "Sort these.", bins: "Supported|Unsupported", items: ["Seat belts save lives: crash data shows fewer deaths.|The lake is cleaner: tests found half the algae.", "This is the greatest movie ever.|Cats are better than dogs, period."], trap: ["Cats are better than dogs, period.", 0], why: "Saying period does not add proof.", win: "Data and tests support a claim." },
    { say: "Sort these by yourself.", bins: "Supported|Unsupported", items: ["Walking helps health: walkers had lower blood pressure.|Gardens help bees: counts doubled near them.", "Video games are bad. That is just true.|Our town is the friendliest."], trap: ["Video games are bad. That is just true.", 0] },
  ],
}));
