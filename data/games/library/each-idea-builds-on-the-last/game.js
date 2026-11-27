// Each Idea Builds on the Last. Skill W.11-12.2-1.
// Introducing a topic and organizing complex ideas so that each new element builds on that which precedes it. Writing a disorganized piece is the known slip.
Sidekick.game(Sidekick.play({
  title: "Each Idea Builds on the Last",
  emoji: "🧱",
  premise: "In a strong explanation the order is not arbitrary. Each idea is a step the next one stands on.",
  outro: "Organize complex ideas so that each new element builds on what precedes it to create a unified whole.",
  scene: "desk",
  kind: "row",
  fs: 4.4,
  hint: "Which idea must the reader understand before the next one makes sense?",
  tag: "disorganized",
  rounds: [
    { say: "Put these points in an order where each builds on the one before.", seq: "A vaccine shows the body a harmless piece of a germ.|The body makes antibodies against that piece.|Memory cells keep the pattern.|So the real germ is recognized fast.", trap: "Memory cells keep the pattern.|A vaccine shows the body a harmless piece of a germ.|The body makes antibodies against that piece.|So the real germ is recognized fast.", why: "There is no pattern to keep until the body has met the piece and responded.", win: "Step, then the step that needs it." },
    { say: "Put these points in order.", seq: "Money today can earn interest.|So a dollar today is worth more than a dollar later.|Lenders therefore charge for waiting.|That charge is the interest rate.", trap: "That charge is the interest rate.|Money today can earn interest.|So a dollar today is worth more than a dollar later.|Lenders therefore charge for waiting.", why: "That charge points back to something. The charge must be introduced first.", win: "Each sentence leans on the last." },
    { say: "Put these points in order by yourself.", seq: "DNA stores instructions as a code.|Cells copy a gene into a messenger.|The messenger is read to build a protein.|Proteins carry out the cell’s work.", trap: "The messenger is read to build a protein.|DNA stores instructions as a code.|Cells copy a gene into a messenger.|Proteins carry out the cell’s work." },
  ],
}));
