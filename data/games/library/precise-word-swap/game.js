// Precise Word Swap. Skill W.4.2-4.
// Using precise language and domain-specific vocabulary to inform about a topic. Using vague words is the known slip.
Sidekick.game(Sidekick.play({
  title: "Precise Word Swap",
  emoji: "🎯",
  premise: "Stuff, things and a lot are vague. Informative writing uses exact words and the special vocabulary of the topic.",
  outro: "Use precise language and topic vocabulary instead of vague words.",
  scene: "ocean",
  kind: "fill",
  fs: 5.2,
  cast: "",
  hint: "Which word tells the reader exactly what you mean?",
  tag: "vague_words",
  rounds: [
    { say: "Swap the vague word for a precise one.", rows: [["Sharks eat ___. (stuff)", "fish and seals"], ["Sharks breathe with ___. (things)", "gills"]], extra: "things", trap: [0, "things"], why: "Things is just as vague as stuff. Name what they eat.", win: "Exact words inform the reader." },
    { say: "Swap these vague words.", rows: [["Plants make food by ___. (a process)", "photosynthesis"], ["A volcano sends out ___. (hot stuff)", "lava and ash"], ["The moon has many ___. (holes)", "craters"]], extra: "stuff", trap: [1, "stuff"], why: "Name what comes out: lava and ash.", win: "Topic vocabulary makes it clear." },
    { say: "Swap these by yourself.", rows: [["Bees collect ___ from flowers. (stuff)", "nectar"], ["A frog begins life as a ___. (baby thing)", "tadpole"], ["Rain, snow and hail are ___. (wet things)", "precipitation"]], extra: "things|a lot", trap: [0, "things"] },
  ],
}));
