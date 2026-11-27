// Author Versus Others. Skill RI.7.6-1.
// Determining an author’s point of view and how the author distinguishes it from that of others. Missing the opposing views is the known slip.
Sidekick.game(Sidekick.play({
  title: "Author Versus Others",
  emoji: "🥊",
  premise: "Authors often bring up views they disagree with, then answer them. Watch for signals such as some say and critics argue.",
  outro: "Separate the author’s own position from the opposing views the author mentions.",
  scene: "city",
  kind: "sort",
  fs: 4.4,
  hint: "Look for signals: some say, critics argue, but, in fact.",
  tag: "misses_opposing_views",
  rounds: [
    { say: "The author supports later school start times. Whose view is each sentence?", bins: "The author|The other side", items: ["Later starts clearly improve learning.|In fact, the evidence is hard to ignore.", "Some argue that buses would cost more.|Critics say sports would end too late."], trap: ["Some argue that buses would cost more.", 0], why: "Some argue signals a view the author is reporting, not holding.", win: "Signal words mark the other side." },
    { say: "The author opposes zoos. Whose view is each sentence?", bins: "The author|The other side", items: ["Cages cannot replace wild habitat.|The truth is that animals suffer in small spaces.", "Supporters claim zoos teach children.|It is often said that zoos save rare species."], trap: ["It is often said that zoos save rare species.", 0], why: "It is often said introduces what other people believe.", win: "The author answers the opposing view." },
    { say: "The author supports school uniforms. Sort by yourself.", bins: "The author|The other side", items: ["Uniforms reduce pressure over clothes.|Clearly, they save families money.", "Opponents say uniforms limit expression.|Some students argue they are uncomfortable."], trap: ["Opponents say uniforms limit expression.", 0] },
  ],
}));
