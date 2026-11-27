// Fraction Stories. Skill 5.NF.A.2-1.
// Word problems adding and subtracting fractions with unlike denominators. Choosing the other operation is the known slip.
Sidekick.game(Sidekick.play({
  title: "Fraction Stories",
  emoji: "🚶",
  premise: "Read the story, decide whether the amounts are joined or taken away, then rename the fractions and compute.",
  outro: "Decide the operation from the story first. Then use a common denominator.",
  scene: "forest",
  kind: "type",
  icon: "🚶",
  hint: "Is the story putting amounts together or taking some away?",
  tag: "chooses_the_other_operation",
  rounds: [
    { say: "Key in the answer as a fraction.", q: "Ana walked {3/4} mile and then {2/3} mile. How far in all?", ans: "17/12", trap: "1/12", why: "She walked both parts, so the distances are added.", win: "9 twelfths + 8 twelfths = 17 twelfths." },
    { say: "Key in what is left.", q: "A jug holds {5/6} liter. Ben drinks {1/4} liter. How much is left?", ans: "7/12", trap: "13/12", why: "Drinking takes some away. Subtract.", win: "10 twelfths − 3 twelfths = 7 twelfths." },
    { say: "Solve it by yourself.", alt: [{ q: "Kim read for {1/2} hour and then {2/5} hour. How long in all?", ans: "9/10", trap: "1/10" }, { q: "A rope is {7/8} yard long. You cut off {1/2} yard. How long is it now?", ans: "3/8", trap: "11/8" }] },
  ],
}));
