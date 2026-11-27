// A Word Doing Double Duty. Skill RL.11-12.4-1.
// Analyzing the impact of specific word choices, including words with multiple meanings. Naming the device only is the known slip.
Sidekick.game(Sidekick.play({
  title: "A Word Doing Double Duty",
  emoji: "🗝️",
  premise: "Writers choose words that mean two things at once. Catch both meanings and the line opens up.",
  outro: "Analyze how a word with multiple meanings adds to meaning and tone.",
  scene: "night",
  kind: "fill",
  fs: 4.4,
  cast: "",
  hint: "What are the two senses of the word? How do both fit the moment?",
  tag: "names_only",
  rounds: [
    { say: "In Romeo and Juliet, the dying Mercutio says he will be “a grave man” tomorrow. Unpack the word.", rows: [["meaning 1", "serious"], ["meaning 2", "in a grave"], ["effect", "a joke that carries real dread"]], extra: "it is a pun|", trap: [2, "it is a pun"], why: "Naming the device is a start. Say what the double meaning does: he jokes while dying.", win: "Both senses at once." },
    { say: "A widow says: “The house feels light without his boots by the door.” Unpack light.", rows: [["meaning 1", "not heavy"], ["meaning 2", "bright"], ["effect", "relief and emptiness blur together"]], extra: "a lamp is on|", trap: [2, "a lamp is on"], why: "No lamp is mentioned. The word lets the house feel both freer and emptier.", win: "Two senses, mixed feeling." },
    { say: "A debtor says: “I will be bound to you forever.” Unpack bound by yourself.", rows: [["meaning 1", "tied up"], ["meaning 2", "obligated"], ["effect", "gratitude sounds like captivity"]], extra: "it is a verb|", trap: [2, "it is a verb"] },
  ],
}));
