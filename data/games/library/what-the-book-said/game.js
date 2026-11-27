// What the Book Said. Skill RI.K.2-2.
// Retelling key details of an informational text. Retelling details that are not in the text is the known slip.
Sidekick.game(Sidekick.play({
  title: "What the Book Said",
  emoji: "🐝",
  premise: "After a fact book, tell what you learned. Only tell things the book really said.",
  outro: "Retell facts that are in the book.",
  scene: "meadow",
  kind: "pick",
  hint: "Can you point to it on the page?",
  tag: "retells_details_not_in_text",
  rounds: [
    { say: "Read the page. Tap the facts the book said.", read: "Bees live in a hive. They make honey.", yes: "Bees live in a hive.|Bees make honey.", no: "Bees are scary.|Bees like pizza.", trap: "Bees are scary.", why: "The book did not say that. Find it on the page first.", win: "Two facts, straight from the book." },
    { say: "Read this page. Tap the facts the book said.", read: "Owls hunt at night. They have big eyes to see in the dark.", yes: "Owls hunt at night.|Owls have big eyes.", no: "Owls are the best bird.|Owls eat cake.|Owls live in the sea.", trap: "Owls are the best bird.", why: "That is what someone thinks. It is not on the page.", win: "You told what the book said." },
    { say: "Tap the facts the book said, by yourself.", read: "Ants are strong. They work as a team to carry food.", yes: "Ants are strong.|Ants work as a team.", no: "Ants are icky.|Ants can fly a kite.|Ants sleep all day.", trap: "Ants are icky." },
  ],
}));
