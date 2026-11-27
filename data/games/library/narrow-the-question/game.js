// Narrow the Question. Skill W.6.7-1.
// Conducting short research projects, refocusing the inquiry when appropriate. Not refocusing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Narrow the Question",
  emoji: "🔍",
  premise: "A research question should be small enough to answer and big enough to matter. Adjust it as you learn.",
  outro: "Refocus a research question when it is too broad to answer or too narrow to explore.",
  scene: "desk",
  kind: "sort",
  fs: 4.6,
  hint: "Could you answer it in a few pages, with more than one source?",
  tag: "does_not_refocus",
  rounds: [
    { say: "Is each research question too broad, just right, or too narrow?", bins: "Too broad|Just right|Too narrow", items: ["What is the ocean?|", "How do coral reefs protect coastlines?|", "How many fish did one diver see on Tuesday?|"], trap: ["What is the ocean?", 1], why: "Whole books could not finish that question. Narrow it down.", win: "Not too big, not too small." },
    { say: "Sort these.", bins: "Too broad|Just right|Too narrow", items: ["Tell me about space.|", "Why did Pluto stop being called a planet?|", "What color is the Mars rover’s left wheel?|"], trap: ["What color is the Mars rover’s left wheel?", 1], why: "One quick fact answers it. There is nothing to explore.", win: "A good question needs several sources." },
    { say: "Sort these by yourself.", bins: "Too broad|Just right|Too narrow", items: ["What is music?|", "How does practice change a musician’s brain?|", "What is the first note of one song?|"], trap: ["What is music?", 1] },
  ],
}));
