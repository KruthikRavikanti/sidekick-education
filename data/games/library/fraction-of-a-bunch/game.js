// Fraction of a Bunch. Skill 5.NF.B.4-1.
// Finding a fraction of a whole number: 2/3 of 12 is 8. Multiplying by the numerator only (24) is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fraction of a Bunch",
  emoji: "🍓",
  premise: "To find a fraction of a bunch, split the bunch into equal groups and take some of the groups.",
  outro: "For a fraction of a number: divide by the bottom, then multiply by the top number.",
  scene: "meadow",
  kind: "type",
  icon: "🍓",
  hint: "Split into as many groups as the bottom number says. Take as many groups as the top number says.",
  tag: "multiplies_numerator_only",
  rounds: [
    { say: "The berries are in 3 equal groups. Key in {2/3} of 12.", pic: "🍓🍓🍓🍓  🍓🍓🍓🍓  🍓🍓🍓🍓", ans: 8, trap: 24, trap2: 4, why: "Two thirds of 12 cannot be more than 12. Take 2 of the 3 groups.", why2: "That is one group, which is one third. Take two groups.", win: "Two groups of 4 make 8." },
    { say: "Key in the answer.", q: "{3/4} of 20", ans: 15, trap: 60, why: "Split 20 into 4 equal groups first. Then take 3 of them.", win: "20 ÷ 4 = 5, and 3 × 5 = 15." },
    { say: "Key in the answer by yourself.", alt: [{ q: "{2/5} of 15", ans: 6, trap: 30 }, { q: "{5/6} of 18", ans: 15, trap: 90 }, { q: "{3/8} of 16", ans: 6, trap: 48 }] },
  ],
}));
