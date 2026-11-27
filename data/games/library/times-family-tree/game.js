// Times Family Tree. Skill 3.OA.B.6-2.
// Related multiplication and division facts: the product is the whole in all four facts. Facts with the product in the place of a factor are the known slip.
Sidekick.game(Sidekick.play({
  title: "Times Family Tree",
  emoji: "🌳",
  premise: "Three numbers make a family of multiplication and division facts. Tap every fact that truly belongs.",
  outro: "In a times family, the biggest number is the product.",
  scene: "forest",
  kind: "pick",
  hint: "The biggest number is the product. It is what the two smaller ones multiply to.",
  tag: "product_in_the_wrong_place",
  rounds: [
    { say: "Tap every true fact for this family.", q: "The family: 6, 7 and 42", yes: "6 × 7 = 42|7 × 6 = 42|42 ÷ 6 = 7|42 ÷ 7 = 6", no: "7 ÷ 6 = 42|42 × 6 = 7", trap: "7 ÷ 6 = 42", why: "42 is the product. Dividing 7 by 6 cannot make 42.", win: "Four facts, one family." },
    { say: "Tap every true fact for this family.", q: "The family: 8, 5 and 40", yes: "8 × 5 = 40|5 × 8 = 40|40 ÷ 8 = 5|40 ÷ 5 = 8", no: "8 ÷ 5 = 40|40 × 5 = 8", trap: "8 ÷ 5 = 40", why: "40 is the product. It is what 8 and 5 multiply to.", win: "All four facts found." },
    { say: "Tap every true fact for this family.", q: "The family: 9, 3 and 27", yes: "9 × 3 = 27|3 × 9 = 27|27 ÷ 9 = 3|27 ÷ 3 = 9", no: "9 ÷ 3 = 27|27 × 3 = 9|3 ÷ 9 = 27", trap: "9 ÷ 3 = 27" },
  ],
}));
