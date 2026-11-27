// Pick the Tool. Skill 2.MD.A.1-1.
// Choosing an appropriate measuring tool: a ruler for small things, a yardstick for medium ones and a measuring tape for long ones. Using a ruler for a hallway is the known slip.
Sidekick.game(Sidekick.play({
  title: "Pick the Tool",
  emoji: "🧰",
  premise: "Short things and long things need different measuring tools. Hand the builder the right tool for each job.",
  outro: "Pick a tool that fits the size of what you measure.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "How long is the thing? A small tool for a long thing takes forever.",
  tag: "ruler_for_everything",
  rounds: [
    { say: "Drag the best tool to each job.", rows: [["a crayon", "ruler"], ["a long hallway", "measuring tape"]], extra: "yardstick", trap: [1, "ruler"], why: "A ruler is only 12 inches. You would move it again and again down the hall.", win: "A ruler for the crayon, a tape for the hallway." },
    { say: "Three jobs, three tools.", rows: [["your thumb", "ruler"], ["a soccer field", "measuring tape"], ["a kitchen table", "yardstick"]], trap: [1, "ruler"], why: "A field is far too long for a ruler. Use the long tape.", win: "Each job has its tool." },
    { say: "Match the tools by yourself.", rows: [["a book", "ruler"], ["the playground fence", "measuring tape"], ["a doorway", "yardstick"]], extra: "cup", trap: [1, "ruler"] },
  ],
}));
