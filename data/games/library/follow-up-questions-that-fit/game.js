// Follow-Up Questions That Fit. Skill W.8.7-1.
// Conducting short research projects and generating additional related, focused questions. Unfocused questions are the known slip.
Sidekick.game(Sidekick.play({
  title: "Follow-Up Questions That Fit",
  emoji: "🧭",
  premise: "Research raises new questions. The useful ones stay tied to the main question and can actually be looked up.",
  outro: "Generate additional related, focused questions that allow for further exploration.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Is it tied to the main question? Is it specific enough to research?",
  tag: "unfocused",
  rounds: [
    { say: "Main question: why are honeybee numbers falling? Sort the follow-ups.", bins: "Related and focused|Off track", items: ["Which pesticides are linked to hive losses?|How do mites weaken a colony?", "Why is honey sweet?|What is the biggest insect?"], trap: ["Why is honey sweet?", 0], why: "It is about bees, but not about why they are declining.", win: "Stay tied to the main question." },
    { say: "Main question: how did the railroad change the American West? Sort the follow-ups.", bins: "Related and focused|Off track", items: ["How did travel times change after 1869?|What happened to towns the railroad bypassed?", "Who invented the bicycle?|Are trains fun?"], trap: ["Are trains fun?", 0], why: "It is an opinion question with nothing to research.", win: "Focused questions go deeper." },
    { say: "Main question: why do cities flood more than they used to? Sort by yourself.", bins: "Related and focused|Off track", items: ["How does pavement affect runoff?|Which cities added wetlands and what happened?", "What is the tallest building?|Is rain nice?"], trap: ["What is the tallest building?", 0] },
  ],
}));
