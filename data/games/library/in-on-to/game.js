// In, On, To. Skill L.K.1-5.
// Using the most frequently occurring prepositions. Leaving the preposition out is the known slip.
Sidekick.game(Sidekick.play({
  title: "In, On, To",
  emoji: "📦",
  premise: "Little words like in, on, to and off tell where things are and where they go.",
  outro: "Words like in, on, to, from, out and off tell where or which way.",
  scene: "desk",
  kind: "fill",
  fs: 6,
  cast: "",
  hint: "Read it with each little word. Which one sounds right?",
  tag: "leaves_out_prepositions",
  rounds: [
    { say: "Drop in the little word that fits.", rows: [["The fish swims ___ the water.", "in"], ["The hat goes ___ my head.", "on"]], extra: "off", trap: [0, "on"], why: "A fish swims inside the water: in the water.", win: "In the water, on my head." },
    { say: "Drop in the word that fits.", rows: [["We walk ___ school.", "to"], ["Take your shoes ___.", "off"], ["The milk is ___ the cup.", "in"]], extra: "on", trap: [1, "on"], why: "You take shoes off.", win: "To school, shoes off, in the cup." },
    { say: "Drop in the words by yourself.", rows: [["The cat ran ___ of the house.", "out"], ["This card is ___ my friend.", "from"], ["Put the book ___ the desk.", "on"]], extra: "off", trap: [0, "off"] },
  ],
}));
