// Closing Sentence. Skill W.2.2-2.
// Providing a concluding statement in informative writing. Stopping without closing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Closing Sentence",
  emoji: "🔚",
  premise: "Informative writing ends with a sentence that wraps up the topic. It should not add a brand new fact.",
  outro: "A concluding statement wraps up the topic.",
  scene: "paper",
  kind: "pick",
  hint: "Which one sounds like the end and sums up the topic?",
  tag: "stops_without_closing",
  rounds: [
    { say: "Read the writing. Tap the best closing sentence.", read: "Penguins are birds that cannot fly. They swim with their wings and eat fish.", yes: "Penguins are amazing birds of the sea.|", no: "Penguins also have feet.|Fish live in water.|And they.", trap: "Penguins also have feet.", why: "That adds one more fact. A closing wraps up.", win: "That sums up the topic." },
    { say: "Read this writing. Tap the best closing sentence.", read: "Rain forests are full of life. Many animals live in the tall trees. It rains there almost every day.", yes: "Rain forests are special places to protect.|", no: "Monkeys eat fruit.|Rain is wet.|There are also bugs.", trap: "There are also bugs.", why: "That starts another fact. Wrap it up instead.", win: "A strong closing." },
    { say: "Tap the best closing by yourself.", read: "The sun is a star. It gives Earth light and heat. Plants need it to grow.", yes: "Life on Earth depends on the sun.|", no: "Stars are far away.|Plants are green.|The sun is also.|Heat is warm.|It is yellow.", trap: "Stars are far away." },
  ],
}));
