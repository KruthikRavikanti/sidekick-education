// Say It Precisely. Skill L.4.3-1.
// Choosing words and phrases to convey ideas precisely. Using vague words is the known slip.
Sidekick.game(Sidekick.play({
  title: "Say It Precisely",
  emoji: "🐆",
  premise: "The animal moved quickly could be anything. The cheetah sprinted puts a clear picture in the mind.",
  outro: "Choose precise nouns and verbs so the reader sees exactly what you mean.",
  scene: "sand",
  kind: "fill",
  fs: 5.4,
  cast: "",
  hint: "Which choice names the exact thing and the exact action?",
  tag: "uses_vague_words",
  rounds: [
    { say: "Swap the vague sentence parts for precise ones.", rows: [["The animal (a fast cat)", "The cheetah"], ["moved quickly", "sprinted"]], extra: "The thing|went", trap: [1, "went"], why: "Went is even vaguer. Sprinted shows the speed.", win: "The cheetah sprinted." },
    { say: "Swap these for precise words.", rows: [["The bird (large, hunts)", "The eagle"], ["went down fast", "dived"], ["got the fish", "snatched the trout"]], extra: "did it|", trap: [1, "did it"], why: "Did it tells nothing. Dived shows the action.", win: "The eagle dived and snatched the trout." },
    { say: "Swap these by yourself.", rows: [["The person (cooks)", "The chef"], ["made food", "grilled salmon"], ["in a good way", "expertly"]], extra: "Someone|stuff", trap: [0, "Someone"] },
  ],
}));
