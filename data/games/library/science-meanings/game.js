// Science Meanings. Skill RI.6.4-1.
// Determining the technical meanings of words in an informational text. Using the everyday meaning is the known slip.
Sidekick.game(Sidekick.play({
  title: "Science Meanings",
  emoji: "🧫",
  premise: "A familiar word can mean something new in a science or history article. Let the subject guide you.",
  outro: "Technical meanings depend on the subject: in biology, a culture is a batch of cells grown in a lab.",
  scene: "desk",
  kind: "fill",
  fs: 4.6,
  cast: "",
  hint: "What is the article about? Which meaning fits that subject?",
  tag: "everyday_meaning",
  rounds: [
    { say: "What does the word in capitals mean here?", rows: [["The lab grew a bacterial CULTURE.", "cells grown in a dish"], ["The CELL split in two.", "a tiny unit of life"]], extra: "a people’s traditions|", trap: [0, "a people’s traditions"], why: "That is the everyday meaning. In a lab, a culture is grown.", win: "Science gives the words new jobs." },
    { say: "What does each word mean here?", rows: [["Plates meet at a FAULT.", "a crack in the crust"], ["The rock has a high iron CONTENT.", "amount inside"]], extra: "a mistake someone made|", trap: [0, "a mistake someone made"], why: "In earth science, a fault is a break in rock.", win: "A crack, and an amount." },
    { say: "Match these by yourself.", rows: [["The river’s MOUTH is wide.", "where it meets the sea"], ["A bill needs a VOTE in the HOUSE.", "a law-making group"]], extra: "part of a face|a place to live", trap: [0, "part of a face"] },
  ],
}));
