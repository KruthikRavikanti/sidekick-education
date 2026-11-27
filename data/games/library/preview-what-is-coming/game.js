// Preview What Is Coming. Skill W.7.2-1.
// Introducing a topic clearly, previewing what is to follow. Leaving out the preview is the known slip.
Sidekick.game(Sidekick.play({
  title: "Preview What Is Coming",
  emoji: "🗺️",
  premise: "A good introduction names the topic and gives the reader a map of what the piece will cover.",
  outro: "Introduce the topic clearly and preview the main points that follow.",
  scene: "desk",
  kind: "sort",
  fs: 4.4,
  hint: "Does it tell you what parts are coming?",
  tag: "no_preview",
  rounds: [
    { say: "Which introductions preview what follows?", bins: "Previews|No preview", items: ["Volcanoes form in three ways: at plate edges, at hot spots and at rifts.|This report covers how bees find, share and store food.", "Volcanoes are interesting.|Bees exist."], trap: ["Volcanoes are interesting.", 0], why: "It names the topic but gives no map of what comes next.", win: "A preview lists the parts." },
    { say: "Build the introduction: topic first, then the preview.", kind: "row", fs: 4.4, seq: "Hurricanes are among the strongest storms on Earth.|This report explains how they form, how they are tracked and how people prepare.", trap: "reverse", why: "Name the topic first. Then tell what the report will cover.", win: "Topic, then preview." },
    { say: "Sort these by yourself.", bins: "Previews|No preview", items: ["The heart has four chambers, each with its own job.|Recycling involves sorting, processing and remaking.", "The heart is in your chest.|Recycling is a word."], trap: ["The heart is in your chest.", 0] },
  ],
}));
