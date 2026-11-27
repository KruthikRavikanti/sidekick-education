// Noun or Verb Entry?. Skill L.7.4-3.
// Consulting reference materials to determine a word’s precise meaning and part of speech. Choosing a definition that does not fit is the known slip.
Sidekick.game(Sidekick.play({
  title: "Noun or Verb Entry?",
  emoji: "📖",
  premise: "Many words are both a noun and a verb, with different meanings and even different stress. The sentence tells you which.",
  outro: "Check the part of speech in the sentence, then choose the matching dictionary definition.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "Is the word naming something, or is it an action?",
  tag: "unfitting_definition",
  rounds: [
    { say: "Which entry fits each sentence?", rows: [["Her CONDUCT in class was excellent.", "noun: behavior"], ["She will CONDUCT the orchestra.", "verb: to lead"]], extra: "noun: a train worker|", trap: [0, "verb: to lead"], why: "Here conduct is a thing she has. It is a noun: behavior.", win: "Behavior, and to lead." },
    { say: "Which entry fits each sentence?", rows: [["The farm sells fresh PRODUCE.", "noun: fruits and vegetables"], ["The factory will PRODUCE 500 cars.", "verb: to make"]], extra: "verb: to show|", trap: [1, "noun: fruits and vegetables"], why: "Here it is an action the factory does.", win: "A noun, then a verb." },
    { say: "Match these by yourself.", rows: [["They signed a CONTRACT.", "noun: a written agreement"], ["Muscles CONTRACT when you lift.", "verb: to tighten"]], extra: "verb: to sign|noun: a muscle", trap: [1, "noun: a written agreement"] },
  ],
}));
