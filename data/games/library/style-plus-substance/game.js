// Style Plus Substance. Skill RI.11-12.6-1.
// Determining an author’s point of view or purpose in a text in which the rhetoric is particularly effective, analyzing how style and content contribute. Ignoring style is the known slip.
Sidekick.game(Sidekick.play({
  title: "Style Plus Substance",
  emoji: "🎻",
  premise: "The most persuasive texts work twice: through what they say, and through how they say it. Analyze both.",
  outro: "Analyze how style and content together contribute to the power or persuasiveness of a text.",
  scene: "city",
  kind: "sort",
  fs: 4.2,
  hint: "Is it about what is said (facts, reasons) or how it is said (rhythm, images, word choice)?",
  tag: "ignores_style",
  rounds: [
    { say: "A speech urges people to vote. Is each feature content or style?", bins: "Content|Style", items: ["turnout figures from the last election|the reason one vote can decide a race", "three sentences that start with We will|the image of an empty ballot box"], trap: ["the image of an empty ballot box", 0], why: "An image is a way of saying it. That is style.", win: "What is said, and how." },
    { say: "How does each stylistic choice add power?", kind: "fill", fs: 4.4, cast: "", rows: [["short final sentence", "lands the point with force"], ["repeated phrase", "builds momentum"], ["plain words", "make the speaker sound trustworthy"]], extra: "adds a new fact|", trap: [0, "adds a new fact"], why: "A short sentence adds no fact. Its brevity is what hits.", win: "Style persuades too." },
    { say: "An essay argues for clean rivers. Sort these by yourself.", bins: "Content|Style", items: ["test results from five sites|the cost of treatment plants", "calling the river the town’s spine|a slow, mournful rhythm"], trap: ["calling the river the town’s spine", 0] },
  ],
}));
