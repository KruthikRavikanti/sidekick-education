// Paraphrase, Do Not Copy. Skill W.5.8-1.
// Summarizing or paraphrasing information in notes and finished work, and providing a list of sources. Copying text word for word is the known slip.
Sidekick.game(Sidekick.play({
  title: "Paraphrase, Do Not Copy",
  emoji: "🔁",
  premise: "Paraphrasing means saying the same idea in your own words and sentence shape. Changing one word is still copying.",
  outro: "Paraphrase in your own words, and list the source.",
  scene: "paper",
  kind: "pick",
  hint: "Same idea, new words, new sentence shape?",
  tag: "copies_word_for_word",
  rounds: [
    { say: "The source says this. Tap the true paraphrases.", read: "The cheetah can reach speeds of 70 miles per hour, but only for short bursts.", yes: "Cheetahs are extremely fast, though they cannot keep it up for long.|For a few seconds, a cheetah can outrun a car on a highway.", no: "The cheetah can reach speeds of 70 miles per hour, but only for short bursts.|The cheetah can reach speeds of 70 mph, but only for short bursts.", trap: "The cheetah can reach speeds of 70 mph, but only for short bursts.", why: "Changing one word is still copying. Use your own sentence.", win: "New words, same idea." },
    { say: "The source says this. Tap the true paraphrases.", read: "Honey never spoils because it contains very little water.", yes: "With so little water in it, honey can last almost forever.|Honey stays good for ages since it is so dry.", no: "Honey never spoils because it contains very little water.|Honey never goes bad because it contains very little water.", trap: "Honey never goes bad because it contains very little water.", why: "That swaps two words and keeps the rest. Rebuild the sentence.", win: "A real paraphrase." },
    { say: "Tap the true paraphrases by yourself.", read: "Octopuses have three hearts and blue blood.", yes: "An octopus pumps blue blood with not one heart but three.|Three hearts move the blue blood of an octopus.", no: "Octopuses have three hearts and blue blood.|Octopuses have 3 hearts and blue blood.", trap: "Octopuses have 3 hearts and blue blood." },
  ],
}));
