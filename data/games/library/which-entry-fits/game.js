// Which Entry Fits?. Skill L.6.4-3.
// Consulting reference materials to find the pronunciation, meaning and part of speech of a word. Picking an entry that does not fit the sentence is the known slip.
Sidekick.game(Sidekick.play({
  title: "Which Entry Fits?",
  emoji: "📚",
  premise: "A dictionary lists several meanings and parts of speech for one word. The sentence tells you which entry you need.",
  outro: "Use the sentence to choose the right part of speech and meaning from a dictionary entry.",
  scene: "desk",
  kind: "fill",
  fs: 4.8,
  cast: "",
  hint: "Is the word an action or a thing in this sentence?",
  tag: "picks_unfitting_entry",
  rounds: [
    { say: "Which dictionary entry fits each sentence?", rows: [["I OBJECT to that plan.", "verb: to disagree"], ["She held a shiny OBJECT.", "noun: a thing"]], extra: "verb: to hold|", trap: [0, "noun: a thing"], why: "Here object is something I do. It is a verb.", win: "An action, then a thing." },
    { say: "Which entry fits each sentence?", rows: [["Please RECORD the score.", "verb: to write down"], ["She broke the school RECORD.", "noun: the best result"]], extra: "noun: a disc of music|", trap: [1, "noun: a disc of music"], why: "A school record in sports is the best result so far.", win: "To write down, and a best result." },
    { say: "Match these by yourself.", rows: [["We will PRESENT our project.", "verb: to show"], ["He opened the PRESENT.", "noun: a gift"]], extra: "adjective: here now|verb: to wrap", trap: [0, "noun: a gift"] },
  ],
}));
