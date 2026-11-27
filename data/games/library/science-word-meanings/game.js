// Science Word Meanings. Skill RI.3.4-1.
// Determining the meaning of general academic and domain-specific words in a text. Using the everyday meaning for a science word is the known slip.
Sidekick.game(Sidekick.play({
  title: "Science Word Meanings",
  emoji: "🦎",
  premise: "Science words can look like everyday words but mean something special. The text tells you which meaning.",
  outro: "Use the definition or clue in the text to learn what a subject word means.",
  scene: "sand",
  kind: "fill",
  cast: "",
  hint: "Look for the words right after it: or, which means, called.",
  tag: "uses_everyday_meaning",
  rounds: [
    { say: "Read the sentences. Match each word to its meaning in the text.", read: "Animals adapt, or change over time, to survive. Their habitat is the place where they live.", rows: [["adapt", "change over time"], ["habitat", "the place they live"]], extra: "get a new pet|", trap: [0, "get a new pet"], why: "Read after the word or: change over time.", win: "Adapt and habitat." },
    { say: "Match each word to its meaning in the text.", read: "A force is a push or a pull. Matter is anything that takes up space.", rows: [["force", "a push or a pull"], ["matter", "anything that takes up space"]], extra: "a problem|", trap: [1, "a problem"], why: "In everyday talk, matter can mean a problem. In science it means stuff that takes up space.", win: "Force and matter." },
    { say: "Match these by yourself.", read: "A solution is a mixture in which one thing dissolves in another. Energy is the ability to do work.", rows: [["solution", "a mixture"], ["energy", "the ability to do work"]], extra: "an answer|a kind of drink", trap: [0, "an answer"] },
  ],
}));
