// Half the Recipe. Skill 5.NF.B.6-1.
// Solving problems that multiply fractions and mixed numbers: half of 2 1/2 is 5/4. Converting the mixed number incorrectly is the known slip.
Sidekick.game(Sidekick.play({
  title: "Half the Recipe",
  emoji: "🥞",
  premise: "To take a fraction of a mixed number, first turn the mixed number into one fraction. Then multiply.",
  outro: "Change a mixed number to a fraction greater than 1 before you multiply.",
  scene: "kitchen",
  kind: "type",
  icon: "🥞",
  hint: "Change the mixed number: wholes × bottom number, plus the top number, over the bottom.",
  tag: "converts_mixed_number_incorrectly",
  rounds: [
    { say: "Key in the answer as a fraction.", q: "A recipe uses 2 {1/2} cups of flour. How much flour is in {1/2} of the recipe?", ans: "5/4", trap: "3/4", why: "2 and a half is 5 halves, not 3 halves. Two wholes are 4 halves.", win: "5 halves × 1 half = 5 fourths." },
    { say: "Key in this answer.", q: "A board is 1 {1/3} yards long. You use {3/4} of it. How many yards is that?", ans: "1", trap: "1/2", why: "1 and a third is 4 thirds. Then 4 thirds × 3 fourths.", win: "12 twelfths is exactly 1 yard." },
    { say: "Solve it by yourself.", alt: [{ q: "A trail is 3 {1/2} miles long. Jo hikes {1/2} of it. How many miles is that?", ans: "7/4", trap: "1" }, { q: "A jug holds 1 {1/4} liters. You pour out {2/5} of it. How many liters is that?", ans: "1/2", trap: "1/5" }] },
  ],
}));
