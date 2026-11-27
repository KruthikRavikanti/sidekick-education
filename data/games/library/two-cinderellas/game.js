// Two Cinderellas. Skill RL.2.9-1.
// Comparing and contrasting two versions of the same story from different cultures. Retelling both without comparing is the known slip.
Sidekick.game(Sidekick.play({
  title: "Two Cinderellas",
  emoji: "👠",
  premise: "The same story is told in many lands. Each telling keeps some parts and changes others.",
  outro: "To compare two versions, find what is the same in both and what is different.",
  scene: "night",
  kind: "sort",
  hint: "Check both versions for each detail.",
  tag: "retells_without_comparing",
  rounds: [
    { say: "Read both versions. Sort the details.", read: "Version 1: A kind girl loses a glass shoe at a ball. / Version 2: A kind girl loses a gold sandal at a feast.", bins: "Both|Only version 1|Only version 2", items: ["a kind girl|she loses a shoe", "a ball|", "a gold sandal|"], trap: ["a kind girl", 1], why: "Both versions have a kind girl.", win: "Same heart, different details." },
    { say: "Read both versions. Sort the details.", read: "Version 1: A fairy helps her. A prince finds her. / Version 2: A magic fish helps her. A king finds her.", bins: "Both|Only version 1|Only version 2", items: ["someone magic helps|", "a fairy|a prince", "a fish|a king"], trap: ["a fish", 1], why: "The fish is in version 2 only.", win: "You compared the two tellings." },
    { say: "Sort these by yourself.", read: "Version 1: Three pigs build houses. A wolf blows two down. / Version 2: Three goats build huts. A lion knocks two down.", bins: "Both|Only version 1|Only version 2", items: ["three animals build|", "a wolf|pigs", "a lion|goats"], trap: ["three animals build", 1] },
  ],
}));
