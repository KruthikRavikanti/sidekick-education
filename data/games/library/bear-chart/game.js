// Bear Chart. Skill W.K.7-1.
// Participating in shared research and writing: facts from several texts are chosen for a class chart. Not contributing facts from the sources is the known slip.
Sidekick.game(Sidekick.play({
  title: "Bear Chart",
  emoji: "🐻",
  premise: "The class read books about bears. Now we make a chart of what the books taught us.",
  outro: "Add facts from the books to a shared chart.",
  scene: "forest",
  kind: "pick",
  hint: "Did the books say it?",
  tag: "does_not_use_the_books",
  rounds: [
    { say: "Read what the books said. Tap the facts for our bear chart.", read: "Bears have thick fur. Bears eat fish and berries.", yes: "Bears eat fish.|Bears have thick fur.", no: "Bears drive cars.|I saw a cat.", trap: "I saw a cat.", why: "That is not about bears, and it is not from the books.", win: "Two facts for the chart." },
    { say: "Tap the facts for our chart.", read: "Bears sleep in dens. Baby bears are called cubs.", yes: "Bears sleep in dens.|Baby bears are cubs.", no: "Bears like to dance.|My dad is tall.|Bears are purple.", trap: "Bears like to dance.", why: "The books did not say that.", win: "Two more facts for the chart." },
    { say: "Tap the facts for our penguin chart by yourself.", read: "Penguins are birds that swim. They live where it is cold.", yes: "Penguins swim.|Penguins live in the cold.", no: "Penguins can talk.|I like ice cream.|Penguins fly to the moon.", trap: "I like ice cream." },
  ],
}));
