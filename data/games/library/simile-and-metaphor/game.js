// Simile and Metaphor. Skill L.4.5-1.
// Explaining the meaning of simple similes and metaphors in context. Reading them literally is the known slip.
Sidekick.game(Sidekick.play({
  title: "Simile and Metaphor",
  emoji: "☀️",
  premise: "A simile compares with like or as. A metaphor says one thing IS another. Neither one is meant literally.",
  outro: "Similes and metaphors compare two things to show a quality they share.",
  scene: "sky",
  kind: "fill",
  cast: "",
  hint: "What quality do the two things share?",
  tag: "reads_figuratively_as_literal",
  rounds: [
    { say: "What does each comparison mean?", rows: [["Her smile was as bright as the sun.", "her smile was very cheerful"], ["The classroom was a zoo.", "the room was loud and wild"]], extra: "animals were in class|", trap: [1, "animals were in class"], why: "No animals. The room is being compared to a zoo for its noise.", win: "A simile and a metaphor." },
    { say: "What does each comparison mean?", rows: [["He runs like the wind.", "he runs very fast"], ["Time is a thief.", "time takes things away quietly"], ["The lake was a mirror.", "the water was smooth and still"]], trap: [2, "he runs very fast"], why: "A mirror is smooth and reflects. That is what the lake is like.", win: "Fast, sneaky and still." },
    { say: "Work these out by yourself.", rows: [["She is as busy as a bee.", "she is working hard"], ["The snow was a white blanket.", "snow covered everything"], ["His words were knives.", "what he said hurt"]], extra: "he had a weapon|", trap: [2, "he had a weapon"] },
  ],
}));
