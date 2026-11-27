// Memoir or Biography. Skill RI.6.9-1.
// Comparing one author’s presentation of events with that of another. Summarizing each one instead is the known slip.
Sidekick.game(Sidekick.play({
  title: "Memoir or Biography",
  emoji: "🪞",
  premise: "The same life can be told by the person who lived it or by someone looking in. Each stresses different things.",
  outro: "A memoir gives the writer’s own memories and feelings. A biography gives another person’s researched account.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Is the writer the person it happened to? Look for I and my.",
  tag: "summarizes_each",
  rounds: [
    { say: "Which kind of text is each line from?", bins: "Memoir|Biography", items: ["I was terrified the first time I flew alone.|My hands shook on the controls.", "She made her first solo flight in 1932.|Records show the flight lasted fifteen hours."], trap: ["She made her first solo flight in 1932.", 0], why: "She and a date signal someone else reporting the facts.", win: "I and my: memoir. She and records: biography." },
    { say: "What does each kind of text stress?", bins: "Memoir|Biography|Both", items: ["personal feelings in the moment|", "dates checked against records|", "the events of the person’s life|"], trap: ["the events of the person’s life", 0], why: "Both tell the life events. They differ in who tells and what is stressed.", win: "Feelings, records, and shared events." },
    { say: "Sort these by yourself.", bins: "Memoir|Biography", items: ["I never told my coach how scared I was.|We ate rice every night that winter.", "He won his first race at fourteen.|Letters from his coach describe his training."], trap: ["He won his first race at fourteen.", 0] },
  ],
}));
