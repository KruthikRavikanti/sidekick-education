// How an Idea Gets Sharper. Skill RI.9-10.2-1.
// Determining a central idea and analyzing its development, including how it is shaped and refined by details. Listing details is the known slip.
Sidekick.game(Sidekick.play({
  title: "How an Idea Gets Sharper",
  emoji: "🔪",
  premise: "A central idea is introduced, then narrowed and strengthened by the details that follow. Watch it tighten.",
  outro: "Trace a central idea: where it is introduced, and how specific details shape and refine it.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "What does this detail do to the idea: introduce it, narrow it, or prove it?",
  tag: "lists_details",
  rounds: [
    { say: "Central idea: sleep is a need, not a luxury. What does each sentence do?", read: "Many teens treat sleep as optional. Yet during sleep the brain files the day’s memories. Students who slept eight hours recalled twice as many words.", rows: [["sentence 1", "names a mistaken view"], ["sentence 2", "explains why sleep matters"], ["sentence 3", "gives evidence"]], trap: [0, "gives evidence"], why: "The first sentence sets up the view the author will answer. The study is the evidence.", win: "Introduce, refine, support." },
    { say: "Central idea: plan for floods early. What does each sentence do?", fs: 4.4, read: "Floods cost more every decade. Most of the cost comes later, in repairs. One city spent far less by building wetlands first.", rows: [["sentence 1", "introduces the problem"], ["sentence 2", "narrows the idea to timing"], ["sentence 3", "shows the idea working"]], trap: [1, "introduces the problem"], why: "This sentence moves from floods in general to when the money is spent.", win: "Each sentence sharpens the point." },
    { say: "Central idea: handwriting helps memory. Match by yourself.", read: "Typing is faster than writing by hand. But speed lets students copy without thinking. Students who wrote notes by hand scored higher on concept questions.", rows: [["typing is faster", "grants a point before turning"], ["the higher scores", "supports the idea with evidence"]], extra: "repeats the title|changes the subject", trap: [0, "supports the idea with evidence"] },
  ],
}));
