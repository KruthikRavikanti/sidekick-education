// Plant Notes. Skill W.1.7-1.
// Participating in shared research and writing projects: observations are recorded from the texts read. Copying random facts is the known slip.
Sidekick.game(Sidekick.play({
  title: "Plant Notes",
  emoji: "🌿",
  premise: "The class read two books about plants. Write down what the books taught, not just anything you think of.",
  outro: "In research, write down facts you learned from your books.",
  scene: "meadow",
  kind: "pick",
  hint: "Is it something one of the books said?",
  tag: "copies_random_facts",
  rounds: [
    { say: "Read what the books said. Tap the notes to write down.", read: "Book 1: Plants need sun and water. / Book 2: Roots take in water from the soil.", yes: "Plants need sun and water.|Roots take in water.", no: "Plants can talk.|I like my bike.", trap: "Plants can talk.", why: "Neither book said that.", win: "Two notes, one from each book." },
    { say: "Tap the notes to write down.", read: "Book 1: Seeds can travel on the wind. / Book 2: Some seeds stick to animal fur.", yes: "Seeds travel on the wind.|Some seeds stick to fur.", no: "Seeds are candy.|Wind is cold.|Dogs bark.", trap: "Wind is cold.", why: "That may be true, but the books were about seeds.", win: "Notes from both books." },
    { say: "Tap the notes by yourself.", read: "Book 1: Leaves make food from sunlight. / Book 2: Leaves fall off some trees in autumn.", yes: "Leaves make food from sunlight.|Some leaves fall in autumn.", no: "Leaves are made of paper.|My tree is big.|Sunlight is yellow.", trap: "My tree is big." },
  ],
}));
