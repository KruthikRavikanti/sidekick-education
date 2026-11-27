// Spelling Demons. Skill L.5.2-5.
// Spelling grade-appropriate words correctly. Spelling by sound is the known slip.
Sidekick.game(Sidekick.play({
  title: "Spelling Demons",
  emoji: "👹",
  premise: "Necessary, separate, definitely and receive trip up almost everyone. Learn to spot the correct form.",
  outro: "Tricky words must be learned: necessary, separate, definitely, receive.",
  scene: "night",
  kind: "fill",
  fs: 5.6,
  cast: "",
  hint: "Which spelling have you seen in print?",
  tag: "spells_by_sound",
  rounds: [
    { say: "Drop in the correct spelling.", rows: [["Water is ___ for life.", "necessary"], ["Keep the two piles ___.", "separate"]], extra: "neccesary seperate", trap: [1, "seperate"], why: "There is a rat in separate: sep-a-rate.", win: "Necessary and separate." },
    { say: "Drop in the correct spellings.", rows: [["I will ___ be there.", "definitely"], ["Did you ___ my letter?", "receive"], ["It was a strange ___.", "occurrence"]], extra: "definately recieve", trap: [1, "recieve"], why: "After c, the e comes before the i: receive.", win: "Definitely, receive and occurrence." },
    { say: "Drop these in by yourself.", rows: [["She felt ___ about the test.", "anxious"], ["That was an ___ meal.", "excellent"], ["Meet me ___ at noon.", "tomorrow"]], extra: "excelent tommorow", trap: [2, "tommorow"] },
  ],
}));
