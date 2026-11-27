// Decimal Dock. Skill 4.NF.C.6-2.
// Placing decimals on a number line: 0.5 is halfway between 0 and 1. Placing 0.5 between 5 and 6 is the known slip.
Sidekick.game(Sidekick.play({
  title: "Decimal Dock",
  emoji: "⛵",
  premise: "Every decimal has a spot on the number line. Sail the boat to the right dock.",
  outro: "Decimals less than 1 sit between 0 and 1. The digit before the point tells the whole number.",
  scene: "ocean",
  kind: "line",
  icon: "⛵",
  cast: "",
  hint: "Read the whole number part first. Then count the tenths past it.",
  tag: "reads_decimal_as_whole",
  rounds: [
    { say: "Sail the boat to 0.5.", line: [0, 6, 0.5, 2], ans: 0.5, trap: 5.5, why: "0.5 is five tenths. It is halfway between 0 and 1.", win: "0.5 is half of one whole." },
    { say: "Sail the boat to 1.3.", line: [0, 2, 0.1, 10], ans: 1.3, trap: 0.3, why: "That is 0.3. For 1.3, go to 1 and then 3 tenths more.", win: "1.3 is past 1, by 3 tenths." },
    { say: "Sail the boat by yourself.", alt: [{ say: "Sail the boat to 0.8 by yourself.", line: [0, 10, 0.2, 5], ans: 0.8, trap: 8 }, { say: "Sail the boat to 1.7 by yourself.", line: [0, 3, 0.1, 10], ans: 1.7, trap: 0.7 }] },
  ],
}));
