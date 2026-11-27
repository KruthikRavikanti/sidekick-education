// In Your Own Words. Skill W.2.7-1.
// Participating in shared research and writing projects: facts are recorded in the writer’s own words. Copying sentences from the book is the known slip.
Sidekick.game(Sidekick.play({
  title: "In Your Own Words",
  emoji: "🌋",
  premise: "A report tells what you learned in your own words. Copying a sentence straight from the book is not your writing.",
  outro: "Write facts from your research in your own words.",
  scene: "sand",
  kind: "pick",
  hint: "Does it say the same idea with different words?",
  tag: "copies_sentences",
  rounds: [
    { say: "The book says this. Tap the notes that are in your own words.", read: "Volcanoes erupt when hot magma pushes up through cracks in the ground.", yes: "Hot melted rock pushes up and out.|A volcano blows when magma rises.", no: "Volcanoes erupt when hot magma pushes up through cracks in the ground.|Volcanoes are fun.", trap: "Volcanoes erupt when hot magma pushes up through cracks in the ground.", why: "That is the book sentence, word for word.", win: "Same idea, your words." },
    { say: "The book says this. Tap the notes in your own words.", read: "Ash from a volcano can travel hundreds of miles on the wind.", yes: "Wind can carry volcano ash very far.|Ash can blow a long way.", no: "Ash from a volcano can travel hundreds of miles on the wind.|Ash is gray.|I like wind.", trap: "Ash from a volcano can travel hundreds of miles on the wind.", why: "That copies the book. Say it your own way.", win: "Your own words." },
    { say: "Tap the notes in your own words, by yourself.", read: "When lava cools, it hardens into new rock.", yes: "Cooled lava turns into rock.|Lava becomes hard rock as it cools.", no: "When lava cools, it hardens into new rock.|Rocks are heavy.|Lava is orange.", trap: "When lava cools, it hardens into new rock." },
  ],
}));
