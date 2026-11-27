// Wise Old Sayings. Skill L.4.5-2.
// Recognizing and explaining the meaning of common idioms, adages and proverbs. Taking them literally is the known slip.
Sidekick.game(Sidekick.play({
  title: "Wise Old Sayings",
  emoji: "🪙",
  premise: "Idioms, adages and proverbs are well-known sayings. They pack a piece of advice into a few words.",
  outro: "A proverb gives advice. Do not take its words literally.",
  scene: "desk",
  kind: "fill",
  cast: "",
  hint: "What advice or truth is the saying really giving?",
  tag: "takes_sayings_literally",
  rounds: [
    { say: "What does each saying mean?", rows: [["A penny saved is a penny earned.", "saving is as good as earning"], ["The early bird catches the worm.", "starting early brings rewards"]], extra: "birds eat worms|", trap: [1, "birds eat worms"], why: "It is not a nature fact. It is advice about getting started early.", win: "Two pieces of advice." },
    { say: "What does each saying mean?", rows: [["Do not judge a book by its cover.", "looks can mislead you"], ["Actions speak louder than words.", "what you do matters most"], ["Two heads are better than one.", "working together helps"]], trap: [0, "working together helps"], why: "A cover is the outside. The saying warns about judging by looks.", win: "Three sayings, three lessons." },
    { say: "Work these out by yourself.", rows: [["Look before you leap.", "think before you act"], ["Practice makes perfect.", "you improve by repeating"], ["Every cloud has a silver lining.", "hard times have a good side"]], extra: "clouds are shiny|", trap: [2, "clouds are shiny"] },
  ],
}));
