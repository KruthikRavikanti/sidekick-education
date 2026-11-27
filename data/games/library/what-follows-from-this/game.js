// What Follows From This. Skill W.11-12.2-4.
// Providing a concluding statement that supports the explanation by articulating implications or significance. Restating only is the known slip.
Sidekick.game(Sidekick.play({
  title: "What Follows From This",
  emoji: "🔭",
  premise: "An advanced conclusion looks past the topic to its implications: what changes, now that the reader understands?",
  outro: "Provide a conclusion that articulates the implications or significance of the topic.",
  scene: "desk",
  kind: "sort",
  fs: 4.2,
  hint: "Does it say what the idea means for the future or for the reader?",
  tag: "restates_only",
  rounds: [
    { say: "A report explained how antibiotic resistance develops. Which endings state an implication?", bins: "States an implication|Only restates", items: ["Unless prescribing changes, routine surgery could become risky again.|New drugs alone will not help if they are overused too.", "In short, bacteria can become resistant.|That is how resistance works."], trap: ["In short, bacteria can become resistant.", 0], why: "The reader knows that already. What follows from it?", win: "Say what it means going forward." },
    { say: "A report explained compound interest. Sort the endings.", bins: "States an implication|Only restates", items: ["Starting to save ten years earlier can double the final sum.|The same math makes unpaid debt grow just as fast.", "To sum up, interest compounds.|As I explained, money grows."], trap: ["As I explained, money grows.", 0], why: "That repeats the topic. The implication is what a saver should do about it.", win: "So what should the reader do?" },
    { say: "A report explained coral bleaching. Sort these by yourself.", bins: "States an implication|Only restates", items: ["Fisheries that feed millions depend on reefs surviving.|Cutting local pollution buys reefs time to adapt.", "Thus corals bleach in warm water.|Reefs were the subject of this report."], trap: ["Thus corals bleach in warm water.", 0] },
  ],
}));
