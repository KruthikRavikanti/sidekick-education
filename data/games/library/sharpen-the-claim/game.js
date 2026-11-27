// Sharpen the Claim. Skill W.9-10.1-1.
// Introducing precise claims and distinguishing them from alternate or opposing claims. Writing vague claims is the known slip.
Sidekick.game(Sidekick.play({
  title: "Sharpen the Claim",
  emoji: "🎯",
  premise: "A precise claim says exactly what should happen and why. It also stands apart from the view it argues against.",
  outro: "Introduce a precise claim and set it apart from the counterclaim.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Does it say who should do what, and why?",
  tag: "vague_claim",
  rounds: [
    { say: "Precise claim or vague claim?", bins: "Precise|Vague", items: ["High schools should start at 8:30 so teens sleep enough.|The city should add bike lanes on Main Street to cut crashes.", "School schedules are bad.|Something should be done about traffic."], trap: ["School schedules are bad.", 0], why: "Bad how? It names no change and no reason.", win: "Who, what and why." },
    { say: "An essay argues for a later start time. Label each sentence.", kind: "fill", fs: 4.4, cast: "", rows: [["claim", "Classes should begin at 8:30 to protect teen sleep."], ["counterclaim", "Some argue that a later start disrupts after-school jobs."]], extra: "Sleep is a thing people do.|", trap: [0, "Some argue that a later start disrupts after-school jobs."], why: "Some argue introduces the other side. The claim is the writer’s own position.", win: "Your position, then the opposing one." },
    { say: "Sort these by yourself.", bins: "Precise|Vague", items: ["The library should open Sundays so working families can use it.|Our school should replace foam trays to reduce waste.", "Libraries are important.|Trash is a big problem."], trap: ["Libraries are important.", 0] },
  ],
}));
