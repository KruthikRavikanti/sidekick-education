// Reasons Why. Skill RI.1.8-1.
// Identifying the reasons an author gives to support points in a text. Restating the point is the known slip.
Sidekick.game(Sidekick.play({
  title: "Reasons Why",
  emoji: "🪱",
  premise: "An author makes a point, then backs it up with reasons. Find the reasons the book gives.",
  outro: "Reasons tell why the point is true. They are different from the point itself.",
  scene: "meadow",
  kind: "pick",
  hint: "Which sentences tell WHY?",
  tag: "restates_the_point",
  rounds: [
    { say: "The author says ants are helpful. Tap the reasons the book gives.", read: "Ants are helpful. They dig tunnels that let air into the soil. They carry away dead bugs.", yes: "They let air into the soil.|They carry away dead bugs.", no: "Ants are helpful.|Ants are small.", trap: "Ants are helpful.", why: "That is the point. The reasons tell why it is true.", win: "Two reasons from the book." },
    { say: "The author says worms are good for gardens. Tap the reasons.", read: "Worms are good for gardens. They mix the soil as they move. Their tunnels help water reach the roots.", yes: "They mix the soil.|Their tunnels help water reach roots.", no: "Worms are good for gardens.|Worms are long.|Worms are pink.", trap: "Worms are good for gardens.", why: "That is the point again. Look for why.", win: "Two reasons from the book." },
    { say: "The author says trees help us. Tap the reasons by yourself.", read: "Trees help us. They give shade on hot days. They make fresh air for us to breathe.", yes: "They give shade.|They make fresh air.", no: "Trees help us.|Trees are tall.|Some trees are old.", trap: "Trees help us." },
  ],
}));
