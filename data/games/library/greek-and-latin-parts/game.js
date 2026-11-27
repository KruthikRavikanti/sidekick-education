// Greek and Latin Parts. Skill L.4.4-2.
// Using common Greek and Latin affixes and roots as clues to word meaning. Not recognizing the roots is the known slip.
Sidekick.game(Sidekick.play({
  title: "Greek and Latin Parts",
  emoji: "📡",
  premise: "Many English words are built from Greek and Latin parts. Tele means far. Graph means write. Auto means self.",
  outro: "Use Greek and Latin roots and affixes as clues: telegraph is far writing.",
  scene: "space",
  kind: "fill",
  cast: "",
  hint: "Break the word into its parts and put the meanings together.",
  tag: "does_not_recognize_roots",
  rounds: [
    { say: "Tele means far. Graph means write. Auto means self. Match each word.", rows: [["telegraph", "writing sent far away"], ["autograph", "your own written name"]], extra: "a kind of car|", trap: [1, "a kind of car"], why: "Auto here means self, and graph means write.", win: "Far writing, and self writing." },
    { say: "Phone means sound. Photo means light. Bio means life. Match each word.", rows: [["telephone", "sound from far away"], ["photograph", "a picture written with light"], ["biography", "a written life story"]], trap: [2, "a picture written with light"], why: "Bio means life. A biography is the story of a life.", win: "Three words from their parts." },
    { say: "Micro means small. Scope means look. Port means carry. Match by yourself.", rows: [["microscope", "a tool for looking at small things"], ["telescope", "a tool for looking far away"], ["portable", "able to be carried"]], extra: "a small boat|", trap: [0, "a tool for looking far away"] },
  ],
}));
