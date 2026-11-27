// Combine Two Sources. Skill RI.4.9-1.
// Integrating information from two texts on the same topic. Reporting the two texts separately is the known slip.
Sidekick.game(Sidekick.play({
  title: "Combine Two Sources",
  emoji: "🧩",
  premise: "To know a topic well, put together what two texts say. The best statements use information from both.",
  outro: "Integrate two texts: combine their information into one fuller understanding.",
  scene: "desk",
  kind: "pick",
  hint: "Does the statement use something from BOTH texts?",
  tag: "reports_texts_separately",
  rounds: [
    { say: "Read both texts. Tap the statements that combine them.", read: "Text 1: Wolves hunt elk in the park. / Text 2: With fewer elk, young trees have grown back.", yes: "By hunting elk, wolves have helped trees grow back.|Wolves affect both the animals and the plants of the park.", no: "Wolves hunt elk.|Young trees have grown back.", trap: "Wolves hunt elk.", why: "That comes from text 1 alone. Put the two ideas together.", win: "One idea built from two texts." },
    { say: "Read both texts. Tap the statements that combine them.", read: "Text 1: Plastic takes hundreds of years to break down. / Text 2: Sea animals often mistake plastic for food.", yes: "Because plastic lasts so long, it keeps harming sea animals for centuries.|Plastic is both long-lasting and dangerous to sea life.", no: "Plastic breaks down slowly.|Animals mistake plastic for food.", trap: "Plastic breaks down slowly.", why: "That is only text 1.", win: "You integrated both sources." },
    { say: "Tap the statements that combine both texts, by yourself.", read: "Text 1: Sleep helps the brain store memories. / Text 2: Many students sleep fewer than eight hours.", yes: "Students who sleep too little may remember less of what they learn.|Short sleep could be hurting how well students store memories.", no: "Sleep stores memories.|Students sleep less than eight hours.", trap: "Sleep stores memories." },
  ],
}));
