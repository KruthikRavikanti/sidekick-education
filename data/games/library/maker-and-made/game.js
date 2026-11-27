// Maker and Made. Skill L.8.5-2.
// Using the relationship between particular words to better understand each. Weak grasp of relationships is the known slip.
Sidekick.game(Sidekick.play({
  title: "Maker and Made",
  emoji: "🎼",
  premise: "An analogy is solved by naming the link: maker and thing made, tool and job, part and whole.",
  outro: "State the relationship in the first pair as a sentence, then apply that sentence to the second pair.",
  scene: "desk",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "Say the link aloud: an author creates a book. A composer creates...",
  tag: "weak_relationships",
  rounds: [
    { say: "Finish each analogy.", rows: [["author is to book as composer is to ___", "music"], ["scissors is to cut as ruler is to ___", "measure"]], extra: "piano|", trap: [0, "piano"], why: "An author creates a book. A composer creates music, not the piano.", win: "Maker and made, tool and job." },
    { say: "Finish each analogy.", rows: [["chapter is to novel as scene is to ___", "play"], ["drought is to famine as earthquake is to ___", "tsunami"], ["architect is to building as chef is to ___", "meal"]], trap: [0, "meal"], why: "A chapter is a part of a novel. A scene is a part of a play.", win: "Part, cause, maker." },
    { say: "Finish these by yourself.", rows: [["sculptor is to statue as poet is to ___", "poem"], ["thermometer is to temperature as clock is to ___", "time"]], extra: "rhyme|numbers", trap: [0, "rhyme"] },
  ],
}));
